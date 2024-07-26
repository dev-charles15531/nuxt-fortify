import { type Ref } from 'vue'
import { useState } from '#imports'

/**
 * Returns a reference to the intended route stored in the state.
 *
 * @template RouteLocationNormalized - The type of the route location.
 * @returns {Ref<string | null>} - A reference to the intended route.
 */
export function useFortifyIntendedRedirect(): Ref<string | null> {
  // Get the intended route from the state.
  // If the intended route is not set, it returns null.
  const intendedRoute = useState<string | null>(
    'nuxt-fortify-intended-redirect',
    () => null,
  )

  return intendedRoute
}
