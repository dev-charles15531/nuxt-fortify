import type { BaseModuleOptions } from '../types/options'
import { useTokenStorage } from './useTokenStorage'
import { useCookie, useRequestHeaders, useRequestURL, useRuntimeConfig, useState } from '#imports'

/**
 * Fortify currently authenticated user composable.
 * @returns Reference to the user state as T or null | Fetch user function.
 */
export function useFortifyUser<T>() {
  const user = useState<T | null>('nuxt-fortify-user', () => null)
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions

  /**
   * Refresh the user state, fetches it from the API.
   *
   */
  const refreshUser = async () => {
    const token = useTokenStorage().value ?? useCookie(config.tokenStorageKey).value

    user.value = await fetchUser(config, token as string) as T
  }

  /**
   * Fetches the user details.
   *
   * @param {BaseModuleOptions} moduleConfig - The module configuration.
   * @param {string} authToken - The authentication token (API TOKEN).
   * @returns - A Promise that resolves with the user details or null if not authenticated.
   */
  async function fetchUser(
    moduleConfig: BaseModuleOptions,
    authToken: string,
  ) {
    const requestOrigin = moduleConfig.origin ?? useRequestURL().origin
    const cookie = useCookie(moduleConfig.cookieKey, { readonly: true })

    let headers: Record<string, string> = {
      Accept: 'application/json',
      Referer: requestOrigin,
      Origin: requestOrigin,
    }

    if (moduleConfig.authMode === 'token') {
      headers.Authorization = `Bearer ${authToken}`
    }
    else if (moduleConfig.authMode === 'cookie') {
      headers[moduleConfig.cookieHeader] = cookie.value as string

      const clientCookies = useRequestHeaders(['cookie'])
      if (import.meta.server) {
        headers = {
          ...headers,
          ...(clientCookies.cookie && clientCookies),
        }
      }
    }

    try {
      const isCredentialsSupported = 'credentials' in Request.prototype

      const response = await $fetch(moduleConfig.endpoints.user, {
        baseURL: moduleConfig.baseUrl,
        method: 'POST',
        credentials: config.authMode == 'cookie' ? isCredentialsSupported ? 'include' : undefined : undefined,
        headers,
      })

      if (response) {
        return response
      }
    }
    catch (error) {
      console.log(error)
    }

    return null
  }

  return { user, refreshUser, fetchUser }
}
