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

export interface FortifyFeatures {
  isAuth: Ref<boolean>;
  login: (credentials: Credentials) => Promise<void>;
}

// Define the credentials type
interface Credentials {
  username: string;
  password: string;
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

          // redirect to intended route
          if (config.authHome) {
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

  return {
    isAuth,
    login,
  };
}
