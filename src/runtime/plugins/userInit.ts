import { useFortifyUser } from '../composables/useFortifyUser'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const { user, refreshUser } = useFortifyUser()

  if (!user.value) {
    await refreshUser()
  }
})
