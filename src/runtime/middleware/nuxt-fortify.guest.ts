import type { BaseModuleOptions } from '../types/options'
import { useFortifyUser } from '../composables/useFortifyUser'
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions

  const { user } = useFortifyUser()

  if (!user.value) {
    return
  }

  if (to.path !== config.authHome) return navigateTo(config.authHome, { replace: true })
})
