import { z } from "zod";
import { AuthSession } from "@/modules/auth/domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating AuthUser from backend
 */

const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
  email_confirmed_at: z.string().datetime(),
  created_at: z.string().datetime(),
  app_metadata: z.object({
    provider: z.string(),
    providers: z.array(z.string()),
  }),
  user_metadata: z.object({
    email: z.string().email(),
    email_verified: z.boolean(),
  }),
});

/**
 * Zod schema for validating AuthSession from backend
 */
const AuthSessionSchema = z
  .object({
    access_token: z.string(),
    expires_in: z.number().int().positive(),
    expires_at: z.number().int().positive(),
    refresh_token: z.string(),
    user: AuthUserSchema,
    token_type: z.string(),
  })
  .passthrough(); // Allow additional fields from backend

/**
 * Validates auth session data
 * Returns validated auth session data
 */
export function validateAuthSession(data: unknown): AuthSession {
  return AuthSessionSchema.parse(data) as AuthSession;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateAuthSessionHandled(data: unknown): AuthSession {
  try {
    if (!data || typeof data !== "object") {
      throw new z.ZodError([
        {
          code: "invalid_type",
          expected: "object",
          received: typeof data,
          path: [],
          message: "Invalid auth session data structure",
        },
      ]);
    }

    return AuthSessionSchema.parse(data) as AuthSession;
  } catch (error) {
    handleZodValidationError(error, "auth session data");
  }
}
