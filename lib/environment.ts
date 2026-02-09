/**
 * Environment configuration.
 *
 * IMPORTANT: Next.js only inlines NEXT_PUBLIC_ vars when accessed with
 * literal dot notation (e.g. process.env.NEXT_PUBLIC_GO_API_URL).
 * Dynamic access like process.env[key] will NOT be replaced at build time.
 */

const ENVIRONMENT = {
  API_BASE_URL: process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080",
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:9999",
} as const;

export default ENVIRONMENT;
