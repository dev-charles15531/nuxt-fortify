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
}
