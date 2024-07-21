export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtFortify: {
    baseUrl: 'http://localhost:80/api',
    authMode: 'token',
    features: {
      registration: true,
      resetPasswords: true,
      emailVerification: true,
      twoFactorAuthentication: true,
      updatePasswords: true,
    },
    tfaAfterLogin: true,
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-07-14',
})
