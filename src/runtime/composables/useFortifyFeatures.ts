import {
  navigateTo,
  useCookie,
  useNuxtApp,
  useRoute,
  useRuntimeConfig,
} from "#imports";
import { type Ref, computed } from "vue";
import { useFortifyUser } from "./useFortifyUser";
import type { BaseModuleOptions } from "../types/options";
import type { RouteLocationNormalized } from "vue-router";
import { useApi } from "./useApi";
import { useFortifyIntendedRedirect } from "./useFortifyIntendedRedirect";
import { createConsola } from "consola";

export interface FortifyFeatures {
  isAuth: Ref<boolean>;
  login: (credentials: Credentials) => Promise<void>;
  enableTwoFactorAuthentication: () => Promise<void>;
  getTwoFactorAuthenticationQRCode: () => Promise<void>;
  showTwoFactorAuthenticationRecoveryCodes: () => Promise<void>;
  solveTwoFactorAuthenticationChallenge: (
    twoFactorCredentials: TwoFactorCredentials
  ) => Promise<void>;
  disableTwoFactorAuthentication: () => Promise<void>;
  register: (registrationCredentials: RegistrationCredentials) => Promise<void>;
  resendEmailVerification?: () => Promise<void>;
}

// Define the login credentials type
interface Credentials {
  username: string;
  password: string;
}

// Define the 2fa credentials type
interface HasCode {
  code: Number;
}
interface HasRecoveryCode {
  recovery_code: string;
}
type TwoFactorCredentials = HasCode | HasRecoveryCode;

// Define the registeration credentials type
interface RegistrationCredentials {
  name: string;
  password: string;
  password_confirmation: string;
}

/**
 * This function initializes and returns the fortify features.
 *
 * @returns An object containing the ref for fortify and the computed property for fortified.
 */
export function useFortifyFeatures(): FortifyFeatures {
  const config = useRuntimeConfig().public.nuxtFortify as BaseModuleOptions;
  const nuxtApp = useNuxtApp();
  const api = useApi();
  const user = useFortifyUser();
  const logger = createConsola({ level: config.logLevel }).withTag(
    "nuxt-fortify"
  );

  // determine if the user is authenticated
  const isAuth = computed(() => {
    return useFortifyUser().value !== null;
  });

  /**
   * Initializes the user object based on the authentication mode.
   *
   * @param token - The authentication token.
   */
  async function initAuthUser(token: string) {
    // If the authentication mode is "token", make a POST request to the user endpoint
    // with the authorization header set to the token.
    if (config.authMode === "token") {
      user.value = await $fetch(config.endpoints.user, {
        baseURL: config.baseUrl,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Set the authorization header to the token
        },
      });
    }
    // If the authentication mode is "cookie", make a POST request to the user endpoint.
    else if (config.authMode === "cookie") {
      user.value = await api(config.endpoints.user, { method: "POST" });
    }
  }

  /**
   * Logs in the user with the provided credentials.
   *
   * @param credentials - The user credentials.
   */
  async function login(credentials: Credentials) {
    const currentRoute = useRoute();

    if (isAuth.value === true) {
      if (config.authHome === undefined) {
        throw new Error("User is already authenticated");
      } else if (currentRoute.path === config.authHome) {
        return;
      }

      await nuxtApp.runWithContext(() => navigateTo(config.authHome));
    }

    await api(config.endpoints.login, {
      method: "POST",
      body: credentials,
    })
      .then(async (response) => {
        if (response.status === 200 || response.token) {
          // set the auth token if auth mode is token
          if (config.authMode === "token") {
            const token = useCookie(config.tokenStorageKey, { secure: true });
            token.value = response.token;
          }

          await initAuthUser(response.token);

          // redirect to 2fa page if configured
          if (config.tfaAfterLogin) {
            if (config.tfaRoute) {
              return await nuxtApp.runWithContext(() =>
                navigateTo(config.tfaRoute)
              );
            } else {
              logger.error("tfaRoute is not configured, redirecting ...");
            }
          }
          // redirect to intended route
          else if (config.authHome) {
            const intendedRoute: Ref<RouteLocationNormalized | null> =
              useFortifyIntendedRedirect();
            if (config.intendedRedirect && intendedRoute.value) {
              return await nuxtApp.runWithContext(() =>
                navigateTo({
                  path: intendedRoute.value?.path,
                  query: intendedRoute.value?.query,
                })
              );
            }

            return await nuxtApp.runWithContext(() =>
              navigateTo(config.authHome)
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Enable 2FA for the user
   *
   * Sends a POST request to enable 2FA for the user
   * @see https://laravel.com/docs/11.x/fortify#enabling-two-factor-authentication
   *
   * @return {Promise<void>}
   */
  const enableTwoFactorAuthentication = async (): Promise<void> => {
    // Check if the 2FA feature is enabled in the config
    if (!config.features?.twoFactorAuthentication) {
      throw new Error("2FA feature not enabled. Please enable it from config");
    }

    // Check if the 2fa enable endpoint is set in the config
    if (!config.endpoints.tfa?.enable) {
      throw new Error(
        "2FA enable endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      return await api(config.endpoints.tfa?.enable, { method: "POST" });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fetches the QR code for two factor authentication setup.
   *
   * Sends a GET request to the server to fetch the QR code for two factor authentication.
   * @see https://laravel.com/docs/11.x/fortify#enabling-two-factor-authentication
   *
   * @return {Promise<string>} The QR code svg data as a string.
   */
  const getTwoFactorAuthenticationQRCode = async (): Promise<void> => {
    // Check if the 2FA feature is enabled in the config
    if (!config.features?.twoFactorAuthentication) {
      throw new Error("2FA feature not enabled. Please enable it from config");
    }

    // Check if the 2fa setup QR code endpoint is set in the config
    if (!config.endpoints.tfa?.code) {
      throw new Error(
        "2FA code endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      return await api(config.endpoints.tfa?.code, { method: "GET" });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Shows the two factor authentication recovery codes.
   *
   * Fetches the two factor authentication recovery codes from the server.
   * @see https://laravel.com/docs/11.x/fortify#displaying-the-recovery-codes
   *
   * @return {Promise<void>} - A Promise that resolves when the recovery codes are fetched.
   */
  const showTwoFactorAuthenticationRecoveryCodes = async (): Promise<void> => {
    // Check if the 2FA feature is enabled in the config
    if (!config.features?.twoFactorAuthentication) {
      throw new Error("2FA feature not enabled. Please enable it from config");
    }

    // Check if the 2fa recodery code endpoint is set in the config
    if (!config.endpoints.tfa?.recoveryCode) {
      throw new Error(
        "2FA recovery code endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      return await api(config.endpoints.tfa?.recoveryCode, { method: "GET" });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Solves the two factor authentication challenge.
   *
   * Sends a POST request to the server to solve the two factor authentication challenge.
   * @see https://laravel.com/docs/11.x/fortify#authenticating-with-two-factor-authentication
   *
   * @param {TwoFactorCredentials} twoFactorCredentials - The two factor authentication credentials.
   * @return {Promise<void>} - A Promise that resolves when the challenge is solved.
   */
  const solveTwoFactorAuthenticationChallenge = async (
    twoFactorCredentials: TwoFactorCredentials
  ): Promise<void> => {
    // Check if the 2FA feature is enabled in the config
    if (!config.features?.twoFactorAuthentication) {
      throw new Error("2FA feature not enabled. Please enable it from config");
    }

    // Check if the 2fa challenge endpoint is set in the config
    if (!config.endpoints.tfa?.challenge) {
      throw new Error(
        "2FA challenge endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      return await api(config.endpoints.tfa?.challenge, {
        method: "POST",
        body: twoFactorCredentials,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Disables two-factor authentication.
   *
   * Sends a DELETE request to the server to disable two-factor authentication.
   * @see https://laravel.com/docs/11.x/fortify#disabling-two-factor-authentication
   *
   * @return {Promise<void>} - A Promise that resolves when two-factor authentication is disabled.
   */
  const disableTwoFactorAuthentication = async (): Promise<void> => {
    // Check if the 2FA feature is enabled in the config
    if (!config.features?.twoFactorAuthentication) {
      throw new Error("2FA feature not enabled. Please enable it from config");
    }

    // Check if the 2fa disable endpoint is set in the config
    if (!config.endpoints.tfa?.disable) {
      throw new Error(
        "2FA disable endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      await api(config.endpoints.tfa?.disable!, { method: "DELETE" });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Registers a new user.
   *
   * Sends a POST request to the server to register a new user.
   *
   * @param {RegistrationCredentials} registrationCredentials - The registration credentials.
   * @throws {Error} If the registration feature is not enabled in the config, or
   * if the registration endpoint is not set in the config.
   * @see https://laravel.com/docs/11.x/fortify#registration
   * @return {Promise<void>} - A Promise that resolves when the user is registered.
   */
  const register = async (
    registrationCredentials: RegistrationCredentials
  ): Promise<void> => {
    // Check if the registration feature is enabled in the config
    if (!config.features?.registration) {
      throw new Error(
        "Registration feature not enabled. Please enable it from config"
      );
    }

    // Check if the register endpoint is set in the config
    if (!config.endpoints?.register) {
      throw new Error(
        "Register endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      // Send a POST request to the server to register a new user
      return await api(config.endpoints.register as RequestInfo, {
        method: "POST",
        body: registrationCredentials,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Resends the email verification link to the user.
   *
   * @throws {Error} If the email verification feature is not enabled in the config, or
   * if the resend email verification link endpoint is not set in the config.
   * @see https://laravel.com/docs/11.x/fortify#resending-email-verification-links
   * @return {Promise<void>} A Promise that resolves when the request is successfully sent.
   */
  const resendEmailVerification = async (): Promise<void> => {
    // Check if the email verification feature is enabled in the config
    if (!config.features?.emailVerification) {
      throw new Error(
        "Email verification feature not enabled. Please enable it from config"
      );
    }

    // Check if the "resend email verification link" endpoint is set in the config
    if (!config.endpoints?.resendEmailVerificationLink) {
      throw new Error(
        "The resend email verification link endpoint not set. Please set this endpoint from config"
      );
    }

    try {
      return await api(
        config.endpoints.resendEmailVerificationLink as RequestInfo,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isAuth,
    login,
    enableTwoFactorAuthentication,
    getTwoFactorAuthenticationQRCode,
    showTwoFactorAuthenticationRecoveryCodes,
    solveTwoFactorAuthenticationChallenge,
    disableTwoFactorAuthentication,
    register,
    resendEmailVerification,
  };
}
