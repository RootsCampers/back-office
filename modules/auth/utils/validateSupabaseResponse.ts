import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

/**
 * Validates and extracts user and session from @supabase/auth-js response
 *
 * @param data - Response data from @supabase/auth-js (can be null/undefined)
 * @param operation - Operation name for error messages (e.g., "signup", "signin", "refresh")
 * @returns Validated user and session objects
 * @throws ApiError if validation fails
 */
export function validateSupabaseResponse(
  data: { user: unknown; session: unknown } | null | undefined,
  operation: string,
): {
  user: { id: string; email?: string; [key: string]: unknown };
  session: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: number;
    token_type?: string;
    [key: string]: unknown;
  };
} {
  if (!data) {
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      `No data returned from ${operation}`,
    );
  }

  if (!data.session) {
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      `No session returned from ${operation}`,
    );
  }

  if (!data.user) {
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      `No user returned from ${operation}`,
    );
  }

  const session = data.session as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: number;
    token_type?: string;
    [key: string]: unknown;
  };

  if (!session.access_token) {
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      `No access_token in session from ${operation}`,
    );
  }

  // After validation, we know access_token exists
  return {
    user: data.user as { id: string; email?: string; [key: string]: unknown },
    session: {
      ...session,
      access_token: session.access_token,
    } as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      expires_at?: number;
      token_type?: string;
      [key: string]: unknown;
    },
  };
}
