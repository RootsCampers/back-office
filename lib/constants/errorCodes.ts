/**
 * Error codes that match public/locales/{lang}/errors.json
 *
 * Use these constants when throwing ApiError to ensure consistency
 * with i18n translations.
 *
 * Example:
 * ```ts
 * throw new ApiError(ERROR_CODES.FETCH_FAILED, "Failed to fetch data");
 * ```
 *
 * In component:
 * ```tsx
 * const { t } = useTranslation("errors");
 * t(error.tag); // Gets translated message from errors.json
 * ```
 */
export const ERROR_CODES = {
  // Validation errors
  INVALID_ID: "invalid_id",
  INVALID_REQUEST: "invalid_request",
  VALIDATION_FAILED: "validation_failed",
  CONFLICT: "conflict",
  SELF_CONFLICT: "self_conflict",

  // Resource operations
  NOT_FOUND: "not_found",
  ALREADY_EXISTS: "already_exists",
  CREATION_FAILED: "creation_failed",
  UPDATE_FAILED: "update_failed",
  DELETION_FAILED: "deletion_failed",
  FETCH_FAILED: "fetch_failed",
  UPLOAD_FAILED: "upload_failed",

  // Auth errors
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  SESSION_EXPIRED: "session_expired",

  USER_ALREADY_EXISTS: "user_already_exists",
  WEAK_PASSWORD: "weak_password",
  INVALID_CREDENTIALS: "invalid_credentials",
  INVALID_GRANT: "invalid_grant",
  ACCESS_DENIED: "access_denied",

  // Network/Server errors
  NETWORK_ERROR: "network_error",
  TIMEOUT: "timeout",
  SERVER_ERROR: "server_error",

  // Generic
  UNKNOWN_ERROR: "unknown_error",
} as const;

// Type for error codes
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Validates if a tag from backend is a known error code
 *
 * Example:
 * ```ts
 * import { validateErrorTag } from "@/lib/constants/errorCodes";
 *
 * const errorCode = validateErrorTag("invalid_id");
 * console.log(errorCode); // → "invalid_id" (if valid) or "unknown_error"
 * ```
 */
export function validateErrorTag(tag: string): ErrorCode {
  // Check if tag exists in ERROR_CODES values
  const validCodes = Object.values(ERROR_CODES) as string[];
  return (
    validCodes.includes(tag) ? tag : ERROR_CODES.UNKNOWN_ERROR
  ) as ErrorCode;
}

/**
 * Error codes that represent transient failures and can be retried
 *
 * Use this to determine if showing a "Retry" button makes sense
 *
 * Example:
 * ```tsx
 * const isRetryable = RETRYABLE_ERROR_CODES.includes(error.code);
 * {isRetryable && <Button onClick={retry}>Try Again</Button>}
 * ```
 */
export const RETRYABLE_ERROR_CODES: ErrorCode[] = [
  ERROR_CODES.NETWORK_ERROR,
  ERROR_CODES.TIMEOUT,
  ERROR_CODES.SERVER_ERROR,
  ERROR_CODES.FETCH_FAILED,
];

/**
 * Checks if an error code is retryable
 */
export function isRetryableError(code: string): boolean {
  return RETRYABLE_ERROR_CODES.includes(code as ErrorCode);
}
