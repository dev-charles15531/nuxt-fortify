import { type Ref } from 'vue'
import type { BaseModuleOptions } from '../types/options'
import { useRuntimeConfig, useState } from '#imports'

/**
 * Returns a reference to the token stored in the state.
 *
 * @returns {Ref<T | null>} - A reference to the token.
 */
export function useTokenStorage<T>(): Ref<T | null> {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions

  // Get the token from the state using the token storage key.
  // If the token is not set, it returns null.
  const cookieToken = useState<T | null>(config.tokenStorageKey, () => null)

  return cookieToken
}
