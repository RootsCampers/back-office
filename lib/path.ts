import { languages } from "@/app/i18n/settings";

/**
 * Strips the locale prefix from a path if present.
 * Useful for normalizing redirect paths to prevent locale duplication.
 *
 * @example
 * stripLocalePrefix("/es/camper-hire/123") // returns "/camper-hire/123"
 * stripLocalePrefix("/camper-hire/123")    // returns "/camper-hire/123"
 * stripLocalePrefix("/es")                 // returns "/"
 */
export function stripLocalePrefix(path: string): string {
  for (const lang of languages) {
    if (path.startsWith(`/${lang}/`)) {
      return path.slice(lang.length + 1);
    }
    if (path === `/${lang}`) {
      return "/";
    }
  }
  return path;
}
