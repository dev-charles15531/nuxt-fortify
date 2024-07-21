import { createConsola, type ConsolaInstance } from 'consola'
import type { FetchOptions } from 'ofetch'
import { useFortifyIntendedRedirect } from '../composables/useFortifyIntendedRedirect'
import { useFortifyUser } from '../composables/useFortifyUser'
import type { BaseModuleOptions } from '../types/options'
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useCookie,
  navigateTo,
  useRoute,
  useRequestURL,
  useRequestHeaders,
} from '#app'

/**
 * Creates the default fetch options for the Fortify API.
 *
 * @param {BaseModuleOptions} config The module configuration.
 * @returns {FetchOptions} The default fetch options.
 */
function buildFetchOptions(config: BaseModuleOptions): FetchOptions {
  /**
   * Check if the browser supports the "credentials" option in the Fetch API.
   */
  const isCredentialsSupported = 'credentials' in Request.prototype

  /**
   * The default fetch options.
   */
  const options: FetchOptions = {
    baseURL: config.baseUrl,
    redirect: 'manual',
  }

  /**
   * If the auth mode is set to "cookie", set the credentials mode to "include" if the browser supports it.
   */
  if (config.authMode === 'cookie') {
    options.credentials = isCredentialsSupported ? 'include' : undefined
  }

  return options
}

/**
 * Calls the CSRF cookie endpoint to fetch the CSRF token.
 *
 * @param {BaseModuleOptions} config - The module configuration.
 * @param {ConsolaInstance} logger - The logger instance.
 * @returns {Promise<void>} - A promise that resolves when the CSRF cookie is called.
 */
async function callCsrfCookie(
  config: BaseModuleOptions,
  logger: ConsolaInstance,
): Promise<void> {
  await $fetch(config.endpoints.csrf, {
    baseURL: config.baseUrl,
    credentials: 'include',
  })

  logger.debug('CSRF cookie has been called')
}

/**
 * Initializes the CSRF header for API requests.
 *
 * @param {Headers} headers - The headers object.
 * @param {BaseModuleOptions} config - The module configuration.
 * @param {ConsolaInstance} logger - The logger instance.
 * @returns {Promise<HeadersInit>} - The modified headers with the CSRF token.
 */
async function initializeCsrfHeader(
  headers: Headers,
  config: BaseModuleOptions,
  logger: ConsolaInstance,
): Promise<HeadersInit> {
  let csrfToken = useCookie(config.cookieKey, { readonly: true })

  // If the CSRF token is not present, call the CSRF cookie endpoint to fetch it
  if (!csrfToken.value) {
    await callCsrfCookie(config, logger)

    csrfToken = useCookie(config.cookieKey, { readonly: true })
  }

  // If the CSRF token is still not present, log a warning and return the original headers
  if (!csrfToken.value) {
    logger.warn(
      `${config.cookieKey} cookie is missing, unable to set ${config.cookieHeader} header`,
    )

    return headers
  }

  logger.debug(`Added API ${config.cookieHeader} header.`)

  // Return the modified headers with the CSRF token
  return {
    ...headers,
    ...(csrfToken.value && {
      [config.cookieHeader]: csrfToken.value,
    }),
  }
}

/**
 * Initializes the token for API requests.
 *
 * @param {Headers} headers - The headers object.
 * @param {BaseModuleOptions} config - The module configuration.
 * @param {ConsolaInstance} logger - The logger instance.
 * @returns {Promise<HeadersInit>} - The modified headers with the token.
 */
async function initializeToken(
  headers: Headers,
  config: BaseModuleOptions,
  logger: ConsolaInstance,
): Promise<HeadersInit> {
  const token = useCookie(config.tokenStorageKey, { secure: true })
  const user = useFortifyUser()

  if (!token.value) {
    logger.warn(`Token not found`)

    return headers
  }

  // If the token is present but the user is not present, fetch the user details
  if (token.value && !user.value) {
    try {
      user.value = await $fetch(config.endpoints.user, {
        baseURL: config.baseUrl,
        method: 'POST',
        headers: {
          ...headers,
          Authorization: `Bearer ${token.value}`,
        },
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  if (!user.value) {
    logger.warn(`Token is not valid, unable to set Authorization header`)
    token.value = null

    return headers
  }

  // Return the modified headers with the Authorization header set to the token
  return {
    ...headers,
    Authorization: `Bearer ${token.value}`,
  }
}

/**
 * Builds the request headers based on the configuration, options, and user details.
 *
 * @param {BaseModuleOptions} config - The module configuration.
 * @param {FetchOptions} options - The fetch options.
 * @param {ConsolaInstance} logger - The logger instance.
 * @returns {Promise<HeadersInit>} - The built request headers.
 */
async function buildRequestHeaders(
  config: BaseModuleOptions,
  options: FetchOptions,
  logger: ConsolaInstance,
): Promise<HeadersInit> {
  const authMode = config.authMode

  // Default headers with common values
  let defaultHeaders: HeadersInit = {
    ...options.headers,
    Accept: 'application/json',
    Referer: origin,
    Origin: origin,
  }

  if (authMode === 'token') {
    // Initialize headers with token-based authentication
    return {
      ...defaultHeaders,
      ...(await initializeToken(defaultHeaders as Headers, config, logger)),
    }
  }
  else if (authMode === 'cookie') {
    const clientCookies = useRequestHeaders(['cookie'])
    const origin = config.origin ?? useRequestURL().origin

    if (import.meta.server) {
      defaultHeaders = {
        ...options.headers,
        Accept: 'application/json',
        Referer: origin,
        Origin: origin,
        ...(clientCookies.cookie && clientCookies),
      }
    }
    // Initialize headers with CSRF token
    return {
      ...(await initializeCsrfHeader(
        defaultHeaders as Headers,
        config,
        logger,
      )),
    }
  }

  // Return the default headers if not using secure methods
  return defaultHeaders
}

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions
  const user = useFortifyUser()
  const logger = createConsola({ level: config.logLevel }).withTag(
    'nuxt-fortify',
  )
  const route = useRoute()

  const $customFetch = $fetch.create({
    ...buildFetchOptions(config),

    async onRequest({ options }) {
      options.headers = {
        ...(await buildRequestHeaders(config, options, logger)),
      }
    },

    async onResponseError({ response }) {
      if (response.status === 419) {
        logger.warn('CSRF token mismatch, check your API configuration')
        return
      }

      if (response.status === 401) {
        if (user.value !== null) {
          logger.warn('User session is not set or access token expired')
          user.value = null
        }

        if (import.meta.client && config.loginRoute) {
          // save current route to be able to redirect to it after login
          if (config.intendedRedirect) {
            const intendedRoute = useFortifyIntendedRedirect()
            intendedRoute.value = route
          }

          await _nuxtApp.runWithContext(() => {
            if (route.path !== config.loginRoute) navigateTo(config.loginRoute)
          })
        }
      }
    },
  })

  // Expose to useNuxtApp().$fortifyApi
  return {
    provide: {
      fortifyApi: $customFetch,
    },
  }
})
