export default defineNuxtConfig({
  modules: ["../src/module"],
  nuxtFortify: {
    baseUrl: "http://localhost:80/api",
    authMode: "token",
  },
  devtools: { enabled: true },
  compatibilityDate: "2024-07-14",
});
