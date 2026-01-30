import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

/**
 * Maps @supabase/auth-js error codes to our ERROR_CODES for i18n
 *
 * Reference: https://supabase.com/docs/guides/auth/debugging/error-codes
 *
 * Note: @supabase/auth-js uses GoTrue error codes, which may differ from
 * our backend's error codes. This map ensures consistent i18n translations.
 */
const AUTH_ERROR_CODE_MAP: Record<string, string> = {
  // User already exists (Supabase uses email_already_registered)
  email_already_registered: ERROR_CODES.USER_ALREADY_EXISTS,
  user_already_exists: ERROR_CODES.USER_ALREADY_EXISTS, // Fallback for backend compatibility

  // Password errors
  weak_password: ERROR_CODES.WEAK_PASSWORD,
  password_too_short: ERROR_CODES.WEAK_PASSWORD,

  // Authentication errors
  invalid_credentials: ERROR_CODES.INVALID_CREDENTIALS,
  invalid_login_credentials: ERROR_CODES.INVALID_CREDENTIALS, // Common variant

  // Token errors
  invalid_grant: ERROR_CODES.INVALID_GRANT,
  token_expired: ERROR_CODES.SESSION_EXPIRED,
  invalid_token: ERROR_CODES.INVALID_GRANT,

  // Access errors
  access_denied: ERROR_CODES.ACCESS_DENIED,
  unauthorized: ERROR_CODES.UNAUTHORIZED,
  forbidden: ERROR_CODES.FORBIDDEN,

  // Network/Server errors
  network_error: ERROR_CODES.NETWORK_ERROR,
  server_error: ERROR_CODES.SERVER_ERROR,
  timeout: ERROR_CODES.TIMEOUT,
};

/**
 * Parses a @supabase/auth-js error (AuthApiError) and converts it to ApiError
 *
 * Used for errors from @supabase/auth-js library methods (signUp, signIn, etc.)
 * AuthApiError format: { code: "weak_password", status: 400, message: "..." }
 *
 * @param errorCode - The error code from AuthApiError.code (e.g., "weak_password")
 * @param errorMessage - The error message from AuthApiError.message
 * @returns ApiError with mapped error code for translations
 *
 * @example
 * ```ts
 * const { error } = await authClient.signUp(...);
 * if (error) {
 *   throw parseSupabaseAuthError(error.code, error.message);
 * }
 * ```
 */
export function parseSupabaseAuthError(
  errorCode: string | undefined,
  errorMessage: string,
): ApiError {
  // Map Supabase error code to our ERROR_CODES
  const mappedCode =
    AUTH_ERROR_CODE_MAP[errorCode || ""] || ERROR_CODES.UNKNOWN_ERROR;

  return new ApiError(mappedCode, errorMessage);
}
