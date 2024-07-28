import type { BaseModuleOptions } from '../types/options'
import { useFortifyIntendedRedirect } from '../composables/useFortifyIntendedRedirect'
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'
import { useFortifyUser } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions
  const { user } = useFortifyUser()

  if (user.value) {
    return
  }

  // save current route to be able to redirect to it after login
  if (config.intendedRedirect) {
    const intendedRoute = useFortifyIntendedRedirect()
    intendedRoute.value = from.fullPath
  }

  if (to.path !== config.loginRoute) {
    return navigateTo(config.loginRoute, { replace: true })
  }
})
