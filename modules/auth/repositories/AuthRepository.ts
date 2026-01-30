import { authClient } from "@/modules/auth/client";
import { SignUpLoginRequest, SignInWithOAuthRequest } from "../domain";
import { parseSupabaseAuthError } from "../utils/errors";
import ENVIRONMENT from "@/lib/environment";
import { isAuthApiError, type AuthApiError } from "@supabase/auth-js";
import { validateSupabaseResponse } from "../utils/validateSupabaseResponse";
import { mapSupabaseToAuthSession } from "../utils/mapSupabaseToAuthSession";

/**
 * Converts @supabase/auth-js error to ApiError for i18n translations
 *
 * @supabase/auth-js errors are AuthApiError with:
 * - `code`: GoTrue error_code (e.g., "weak_password", "invalid_credentials")
 * - `status`: HTTP status code
 * - `message`: Error message
 *
 * We convert to ApiError so components can use error.tag for translations
 */
function convertAuthError(error: unknown): never {
  // Handle AuthApiError from @supabase/auth-js - use directly
  if (isAuthApiError(error)) {
    const authError = error as AuthApiError;
    // Convert to ApiError for i18n (components expect ApiError.tag)
    throw parseSupabaseAuthError(
      authError.code || "unknown_error",
      authError.message || "An authentication error occurred",
    );
  }

  // Handle other errors (SyntaxError, network errors, etc.)
  if (error instanceof Error) {
    // If it's already an ApiError, rethrow it
    if ("tag" in error) {
      throw error;
    }
    // Convert generic errors
    throw parseSupabaseAuthError(
      "unknown_error",
      error.message || "An unexpected error occurred",
    );
  }

  // Fallback
  throw parseSupabaseAuthError("unknown_error", "An unexpected error occurred");
}

export class AuthRepository {
  /**
   * Signs up a new user
   *
   * Uses @supabase/auth-js GoTrueClient.signUp()
   * Returns session data in format expected by validators
   *
   * @param request - Sign up request with email and password
   * @returns Promise<unknown> - Raw auth session data from backend
   */
  async signUp(request: SignUpLoginRequest): Promise<unknown> {
    try {
      const { data, error } = await authClient.signUp({
        email: request.email,
        password: request.password,
      });

      if (error) convertAuthError(error);

      const { user, session } = validateSupabaseResponse(data, "signup");
      return mapSupabaseToAuthSession(user, session);
    } catch (error) {
      convertAuthError(error);
    }
  }

  /**
   * Signs in with email and password
   *
   * Uses @supabase/auth-js GoTrueClient.signInWithPassword()
   * Returns session data in format expected by validators
   *
   * @param request - Sign in request with email and password
   * @returns Promise<unknown> - Raw auth session data from backend
   */
  async signInWithPassword(request: SignUpLoginRequest): Promise<unknown> {
    try {
      const { data, error } = await authClient.signInWithPassword({
        email: request.email,
        password: request.password,
      });

      if (error) convertAuthError(error);

      const { user, session } = validateSupabaseResponse(data, "signin");
      return mapSupabaseToAuthSession(user, session);
    } catch (error) {
      convertAuthError(error);
    }
  }

  /**
   * Initiates OAuth sign in/sign up flow
   *
   * Uses @supabase/auth-js GoTrueClient.signInWithOAuth() with PKCE
   *
   * Note: This redirects the user to the OAuth provider, so it doesn't return a session.
   * The session is obtained after the OAuth callback.
   *
   * @param request - OAuth request with provider and redirect URL
   * @returns Promise<void> - Redirects user to OAuth provider
   */
  async signInWithOAuth(request: SignInWithOAuthRequest): Promise<void> {
    const redirectTo =
      request.redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback");

    const { data, error } = await authClient.signInWithOAuth({
      provider: request.provider,
      options: {
        redirectTo,
        // PKCE is enabled by default in @supabase/auth-js
      },
    });

    if (error) convertAuthError(error);

    // Redirect browser to OAuth provider
    if (data?.url && typeof window !== "undefined") {
      window.location.href = data.url;
    }
  }

  /**
   * Refreshes the access token using refresh token
   *
   * Uses @supabase/auth-js GoTrueClient.refreshSession()
   * Returns session data in format expected by validators
   *
   * @param refreshToken - The refresh token to use
   * @returns Promise<unknown> - Raw auth session data from backend
   */
  async refreshToken(refreshToken: string): Promise<unknown> {
    try {
      const { data, error } = await authClient.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) convertAuthError(error);

      const { user, session } = validateSupabaseResponse(data, "refresh");
      // Keep original refresh token if new one not returned
      return mapSupabaseToAuthSession(user, session, refreshToken);
    } catch (error) {
      convertAuthError(error);
    }
  }

  /**
   * Logs out the user
   *
   * Calls GoTrue /logout endpoint directly (returns 204 No Content on success)
   * Then calls authClient.signOut() to clear local state
   *
   * Note: If backend logout fails, we continue with local logout anyway
   * to ensure the user is logged out locally.
   *
   * @param accessToken - The access token to authenticate the request
   * @returns Promise<void> - Logs out the user
   */
  async logout(accessToken: string): Promise<void> {
    // Try to invalidate token on server (204/205 = success)
    try {
      const response = await fetch(`${ENVIRONMENT.AUTH_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // 204/205 No Content means success
      // Any other status we log but continue with local logout
      if (response.status !== 204 && response.status !== 205) {
        console.warn(
          `Logout endpoint returned ${response.status}, continuing with local logout`,
        );
      }
    } catch (error) {
      // Network errors or other issues - log but don't block logout
      // We still want to clear local state even if backend logout fails
      console.warn(
        "Error calling logout endpoint (continuing with local logout):",
        error,
      );
    }

    // Always clear local auth state (signOut doesn't need parameters)
    // This ensures logout works even if backend call fails
    const { error } = await authClient.signOut();
    if (error) {
      // Log but don't throw - we're already logged out locally
      console.warn("Error clearing local auth state:", error);
    }
  }
}

/**
 * Factory function to create AuthRepository instance
 */
export function createAuthRepository(): AuthRepository {
  return new AuthRepository();
}
