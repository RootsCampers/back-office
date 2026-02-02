/**
 * Translation helper utilities.
 */

/**
 * Format a string to a valid translation key.
 */
export function formatTranslationKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
