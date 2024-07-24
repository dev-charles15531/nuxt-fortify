import type { BaseModuleOptions } from '../types/options'
import { useApi } from './useApi'
import { useState } from '#imports'

/**
 * Fortify currently authenticated user composable.
 * @returns Reference to the user state as T or null | Fetch user function.
 */
export function useFortifyUser<T>() {
  const user = useState<T | null>('nuxt-fortify-user', () => null)

  /**
   * Fetches the user details.
   *
   * @param {BaseModuleOptions} config - The module configuration.
   * @param {string} token - The authentication token (API TOKEN).
   * @returns {Promise<void>} - A Promise that resolves when the user details are fetched.
   */
  async function fetchUser(
    config: BaseModuleOptions,
    token: string,
  ): Promise<void> {
    if (config.authMode === 'token') {
      try {
        await $fetch(config.endpoints.user, {
          baseURL: config.baseUrl,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Referer: origin,
            Origin: origin,
            Authorization: `Bearer ${token}`,
          },
        })
      }
      catch (error) {
        console.log(error)
      }
    }
    else if (config.authMode === 'cookie') {
      const api = useApi()
      await api(config.endpoints.user, { method: 'POST' })
    }
  }

  return { user, fetchUser }
}
