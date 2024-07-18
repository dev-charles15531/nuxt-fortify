import type { LogLevel } from "consola";

/**
 * Options to be passed to the module.
 */
export interface BaseModuleOptions {
  /**
   * The base URL of the Laravel API.
   */
  baseUrl: string;

  /**
   * The mode to use for authentication.
   */
  authMode: "cookie" | "token";

  /**
   * The route to redirect to when the user is not authenticated.
   */
  loginRoute: string;

  /**
   * The route to redirect to after successful user authentication.
   */
  authHome?: string;

  /**
   * The name of the cookie that contains the CSRF token.
   */
  cookieKey: string;

  /**
   * The name of the cookie header that contains the CSRF token.
   */
  cookieHeader: string;

  /**
   * The key to store the token in the storage.
   */
  tokenStorageKey: string;

  /**
   * The endpoints to use for API requests.
   */
  endpoints: ApiEndpoints;

  /**
   * Whether to redirect to the intended route after successful authentication.
   */
  intendedRedirect: Boolean;

  /**
   * The features to enable.
   */
  features?: FortifyFeatures;

  /**
   * Whether to redirect to Two Factor Authentication page after successful login.
   */
  tfaAfterLogin: Boolean;

  /**
   * The route to redirect to for Two Factor Authentication.
   */
  tfaRoute: string;

  /**
   * The log level to use for the module.
   */
  logLevel: LogLevel;
}

export interface ApiEndpoints {
  /**
   * The endpoint to request a new CSRF token.
   * @default '/sanctum/csrf-cookie'
   */
  csrf: string;
  /**
   * The endpoint to send user credentials to authenticate.
   * @default '/login'
   */
  login: string;
  /**
   * The endpoint to destroy current user session.
   * @default '/logout'
   */
  logout: string;
  /**
   * The endpoint to fetch current user data.
   * @default '/user'
   */
  user: string;

  tfa?: {
    enable: string;
    code: string;
    recoveryCode: string;
    challenge: string;
    disable: string;
  };
}

export interface FortifyFeatures {
  /**
   * Whether to enable registration feature.
   * @default true
   */
  registration: Boolean;

  /**
   * Whether to enable reset password feature.
   * @default true
   */
  resetPasswords: Boolean;

  /**
   * Whether to enable email verification feature.
   * @default true
   */
  emailVerification: Boolean;

  /**
   * Whether to enable user profile update feature.
   * @default false
   */
  updateProfileInformation?: Boolean;

  /**
   * Whether to enable user password update feature.
   * @default false
   */
  updatePasswords?: Boolean;

  /**
   * Whether to enable two factor authentication feature.
   */
  twoFactorAuthentication?: Boolean;
}
