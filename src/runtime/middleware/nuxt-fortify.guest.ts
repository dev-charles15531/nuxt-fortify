import type { BaseModuleOptions } from '../types/options'
import { useFortifyUser } from '../composables/useFortifyUser'
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig, useCookie } from '#app'
import { computed } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions
  const token = useCookie(config.tokenStorageKey, { secure: true })

  // determine if the user is authenticated
  const isAuth = computed(() => {
    let _user: object | null = null
    const { user, fetchUser } = useFortifyUser()

    _user = user.value ?? fetchUser(config, token.value as string)

    return _user !== null
  })

  if (isAuth.value === false) {
    return
  }

  if (to.path !== config.authHome) navigateTo(config.authHome)
})
