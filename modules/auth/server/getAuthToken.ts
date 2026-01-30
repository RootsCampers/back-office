/**
 * Server-side auth utilities
 * Functions to access authentication data in Server Components
 */

import { cookies } from "next/headers";
import {
  getAuthTokenFromCookies,
  getAuthRefreshTokenFromCookies,
} from "../utils/cookies";

/**
 * Get the current access token from cookies (Server Component)
 *
 * @returns Access token or null if not authenticated
 *
 * @example
 * ```tsx
 * import { getAuthToken } from '@/modules/auth/server'
 *
 * export default async function MyServerComponent() {
 *   const token = await getAuthToken()
 *
 *   if (!token) {
 *     // User not authenticated
 *     return <div>Please log in</div>
 *   }
 *
 *   // Use token for API calls
 *   const data = await fetch('/api/protected', {
 *     headers: { Authorization: `Bearer ${token}` }
 *   })
 * }
 * ```
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return getAuthTokenFromCookies(cookieStore);
  } catch {
    return null;
  }
}

/**
 * Get the current refresh token from cookies (Server Component)
 *
 * @returns Refresh token or null if not authenticated
 */
export async function getAuthRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return getAuthRefreshTokenFromCookies(cookieStore);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (Server Component)
 *
 * @returns true if access token exists
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token !== null;
}
