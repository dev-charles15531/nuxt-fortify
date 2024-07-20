import {
  defineNuxtModule,
  addPlugin,
  addImportsDir,
  createResolver,
  useLogger,
} from "@nuxt/kit";
import type { BaseModuleOptions } from "./runtime/types/options";
import { defu } from "defu";

export default defineNuxtModule<BaseModuleOptions>({
  meta: {
    name: "nuxt-fortify",
    configKey: "nuxtFortify",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    baseUrl: "http://localhost:3000/api",
    loginRoute: "/login",
    logLevel: 1,
    authHome: "/home",
    authMode: "cookie",
    cookieHeader: "X-XSRF-TOKEN",
    cookieKey: "XSRF-TOKEN",
    tokenStorageKey: "API-TOKEN",
    endpoints: {
      csrf: "/sanctum/csrf-cookie",
      login: "/login",
      logout: "/logout",
      user: "/user",
      tfa: {
        enable: "/user/two-factor-authentication",
        disable: "/user/two-factor-authentication",
        code: "/user/two-factor-qr-code",
        recoveryCode: "/user/two-factor-recovery-codes",
        challenge: "/two-factor-challenge",
      },
      register: "/register",
      resetPassword: "/forgot-password",
      updatePassword: "/reset-password",
      confirmPassword: "/confirm-password",
      resendEmailVerificationLink: "/email/verification-notification",
    },
    intendedRedirect: true,
    features: {
      registration: true,
      resetPasswords: true,
      emailVerification: true,
    },
    tfaAfterLogin: false,
    tfaRoute: "/two-factor-authentication",
  },
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    const runtimeDir = resolver.resolve("./runtime");
    _nuxt.options.build.transpile.push(runtimeDir);

    const nuxtFortifyConfig = defu(
      _nuxt.options.runtimeConfig.public.nuxtFortify as any,
      _options
    );
    _nuxt.options.runtimeConfig.public.nuxtFortify = nuxtFortifyConfig;

    const logger = useLogger("nuxt-fortify", {
      level: nuxtFortifyConfig.logLevel,
    });

    logger.start("Initializing Nuxt Fortify module...");

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugins/fortifyApi"));
    addImportsDir(resolver.resolve("./runtime/composables"));
  },
});
