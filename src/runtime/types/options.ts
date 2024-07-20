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

  /**
   * The origin to use for CORS requests.
   */
  origin?: string;
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

  /**
   * 2FA endpoints.
   */
  tfa?: {
    /**
     * The endpoint to enable 2FA.
     * @default '/user/two-factor-authentication'
     */
    enable: string;
    /**
     * The endpoint to initialize 2FA QR code.
     * @default '/user/two-factor-qr-code'
     */
    code: string;
    /**
     * The endpoint to retrieve 2FA recovery codes.
     * @default '/user/two-factor-recovery-codes'
     */
    recoveryCode: string;
    /**
     * The endpoint to solve 2FA challenge.
     * @default '/two-factor-challenge'
     */
    challenge: string;
    /**
     * The endpoint to disable 2FA.
     * @default '/user/two-factor-authenticatione'
     */
    disable: string;
  };

  /**
   * The endpoint to send user credentials for registration.
   * @default '/register'
   */
  register?: String;

  /**
   * The endpoint to send user an email containing reset password link.
   * @default '/forgot-password'
   */
  resetPassword?: String;

  /**
   * The endpoint to send user credentials for a password reset.
   * @default '/reset-password'
   */
  updatePassword?: String;

  /**
   * The endpoint to send user an email containing verification link.
   * @default '/email/verification-notification'
   */
  resendEmailVerificationLink?: String;

  /**
   * The endpoint for user password confirmation.
   * @default '/user/confirm-password'
   */
  confirmPassword?: String;
}

export interface FortifyFeatures {
  /**
   * Whether to enable registration feature.
   * @default true
   */
  registration?: Boolean;

  /**
   * Whether to enable reset password feature.
   * @default true
   */
  resetPasswords?: Boolean;

  /**
   * Whether to enable email verification feature.
   * @default true
   */
  emailVerification?: Boolean;

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
