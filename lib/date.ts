/**
 * Date utility functions for API communication
 */

/**
 * Converts a date string (YYYY-MM-DD) to RFC 3339 datetime format.
 * Required by rootend API endpoints that expect datetime fields.
 *
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns RFC 3339 datetime string (e.g., "2026-03-04T00:00:00Z")
 *
 * @example
 * toRFC3339("2026-03-04") // Returns "2026-03-04T00:00:00Z"
 */
export function toRFC3339(dateStr: string): string {
  return `${dateStr}T00:00:00Z`;
}

/**
 * Extracts the date portion (YYYY-MM-DD) from an RFC 3339 datetime string.
 * Useful for displaying dates in forms after receiving from API.
 *
 * @param rfc3339Str - RFC 3339 datetime string
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * fromRFC3339("2026-03-04T00:00:00Z") // Returns "2026-03-04"
 */
export function fromRFC3339(rfc3339Str: string): string {
  return rfc3339Str.split("T")[0];
}
