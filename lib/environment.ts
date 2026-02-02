/**
 * Environment configuration.
 *
 * These variables are required for the app to function properly.
 * In production/staging, set them in Vercel Environment Variables.
 *
 * For local development, copy .env.example to .env.local and fill in values.
 */

// Only throw errors at runtime, not build time
// This allows Vercel to build even without env vars configured
const isBuildTime = process.env.NODE_ENV === "production" && typeof window === "undefined";

function getRequiredEnv(key: string, defaultForBuild?: string): string {
  const value = process.env[key];
  if (value) return value;

  // During build, use placeholder to allow build to complete
  // The actual values must be set in Vercel for the app to work
  if (isBuildTime && defaultForBuild) {
    console.warn(`[Build] ${key} not set, using placeholder. Set this in Vercel for production.`);
    return defaultForBuild;
  }

  throw new Error(`${key} is not set. Please configure it in your environment variables.`);
}

const ENVIRONMENT = {
  API_BASE_URL: getRequiredEnv("NEXT_PUBLIC_GO_API_URL", "https://api.example.com"),
  AUTH_URL: getRequiredEnv("NEXT_PUBLIC_AUTH_URL", "https://api.example.com/auth/v1"),
} as const;

export default ENVIRONMENT;
