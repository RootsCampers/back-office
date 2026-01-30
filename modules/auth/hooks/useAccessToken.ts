import { useAuth } from "../hooks";

/**
 * Hook to get the current access token
 *
 * @example
 * ```tsx
 * const token = useAccessToken()
 * // token: string | null
 * ```
 */
export function useAccessToken(): string | null {
  const { session } = useAuth();
  return session?.access_token || null;
}
