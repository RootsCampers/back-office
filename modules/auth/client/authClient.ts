import { GoTrueClient } from "@supabase/auth-js";
import ENVIRONMENT from "@/lib/environment";

/**
 * Auth Client using @supabase/auth-js (GoTrue client)
 *
 * This is a minimal GoTrue client that works with your self-hosted GoTrue instance.
 * It provides all auth operations (sign in, sign up, refresh, OAuth) with automatic
 * token refresh and PKCE OAuth support.
 */
export const authClient = new GoTrueClient({
  url: `${ENVIRONMENT.AUTH_URL}`,
  // Custom storage adapter - we handle cookies via API routes
  // This prevents auth-js from trying to use localStorage
  storage: {
    getItem: () => null, // Cookies are handled server-side
    setItem: () => {}, // Cookies are set via API routes
    removeItem: () => {}, // Cookies are cleared via API routes
  },
  // Auto refresh is disabled - we handle it in middleware
  autoRefreshToken: false,
  persistSession: false, // We persist via HttpOnly cookies, not localStorage
});
