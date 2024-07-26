import type { BaseModuleOptions } from '../types/options'
import { useFortifyUser } from '../composables/useFortifyUser'
import { useFortifyIntendedRedirect } from '../composables/useFortifyIntendedRedirect'
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions
  const { user } = useFortifyUser<object>()

  if (user.value) {
    return
  }

  // save current route to be able to redirect to it after login
  if (config.intendedRedirect) {
    const intendedRoute = useFortifyIntendedRedirect()
    intendedRoute.value = from.fullPath
  }

  if (to.path !== config.loginRoute) {
    return navigateTo(config.loginRoute)
  }
})
