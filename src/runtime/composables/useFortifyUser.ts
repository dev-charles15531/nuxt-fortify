import { type Ref } from 'vue'
import { useState } from '#imports'

/**
 * Returns a current authenticated user information or null if not authenticated.
 * @returns Reference to the user state as T.
 */
export function useFortifyUser<T>(): Ref<T | null> {
  const user = useState<T | null>('nuxt-fortify-user', () => null)

  return user
}
