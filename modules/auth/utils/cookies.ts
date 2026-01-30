/**
 * Cookie utilities for authentication (Server Components only)
 *
 * ⚠️ IMPORTANT: Cookies are now HttpOnly and managed via API routes:
 * - Setting cookies: Use POST /api/auth/session (from AuthService)
 * - Clearing cookies: Use DELETE /api/auth/session (from AuthService)
 * - Reading cookies: Use these functions in Server Components only
 *
 * Client Components should use useAuth() hook which reads from /api/auth/session
 */

const AUTH_TOKEN_COOKIE = "auth_token";
const AUTH_REFRESH_TOKEN_COOKIE = "auth_refresh_token";

/**
 * Get auth token from cookies (Server Component)
 *
 * @param cookieStore - Cookie store from Next.js cookies()
 * @returns Access token or null
 *
 * @example
 * ```ts
 * import { cookies } from 'next/headers'
 * import { getAuthTokenFromCookies } from '@/modules/auth/utils/cookies'
 *
 * export default async function MyServerComponent() {
 *   const cookieStore = await cookies()
 *   const token = getAuthTokenFromCookies(cookieStore)
 *   // Use token for API calls
 * }
 * ```
 */
export function getAuthTokenFromCookies(
  cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
): string | null {
  try {
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);
    return token?.value || null;
  } catch {
    return null;
  }
}

/**
 * Get refresh token from cookies (Server Component)
 *
 * @param cookieStore - Cookie store from Next.js cookies()
 * @returns Refresh token or null
 */
export function getAuthRefreshTokenFromCookies(
  cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
): string | null {
  try {
    const token = cookieStore.get(AUTH_REFRESH_TOKEN_COOKIE);
    return token?.value || null;
  } catch {
    return null;
  }
}
