import type { AuthSession } from "../domain/types";

/**
 * Maps @supabase/auth-js { user, session } format to our AuthSession format
 *
 * @param user - User object from @supabase/auth-js
 * @param session - Session object from @supabase/auth-js
 * @param fallbackRefreshToken - Optional refresh token to use if session doesn't have one
 * @returns AuthSession in our format
 */
export function mapSupabaseToAuthSession(
  user: { id: string; email?: string; [key: string]: unknown },
  session: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: number;
    token_type?: string;
    [key: string]: unknown;
  },
  fallbackRefreshToken?: string,
): AuthSession {
  const expiresIn =
    typeof session.expires_in === "number" ? session.expires_in : 3600;
  const expiresAt =
    typeof session.expires_at === "number"
      ? session.expires_at
      : Math.floor(Date.now() / 1000) + expiresIn;

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token || fallbackRefreshToken || "",
    expires_in: expiresIn,
    expires_at: expiresAt,
    token_type: session.token_type || "bearer",
    user: {
      id: user.id,
      email: user.email || "",
      // Role is stored in app_metadata.role (set by Go backend), fallback to "traveler"
      role:
        (user as { app_metadata?: { role?: string } }).app_metadata?.role ||
        (user as { role?: string }).role ||
        "traveler",
      email_confirmed_at:
        (user as { email_confirmed_at?: string }).email_confirmed_at ||
        new Date().toISOString(),
      created_at:
        (user as { created_at?: string }).created_at ||
        new Date().toISOString(),
      app_metadata: {
        provider:
          (user as { app_metadata?: { provider?: string } }).app_metadata
            ?.provider || "email",
        providers: (user as { app_metadata?: { providers?: string[] } })
          .app_metadata?.providers || ["email"],
      },
      user_metadata: {
        email: user.email || "",
        email_verified:
          (user as { user_metadata?: { email_verified?: boolean } })
            .user_metadata?.email_verified || false,
      },
    },
  };
}
