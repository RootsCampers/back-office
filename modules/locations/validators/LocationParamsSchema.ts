import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { LocationParams } from "../domain";

/**
 * Zod schema for validating location query parameters
 * - limit: must be between 1 and 100, defaults to 50
 * - offset: must be >= 0, defaults to 0
 */
const LocationParamsSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be at most 100")
    .default(50),
  offset: z.coerce
    .number()
    .int()
    .min(0, "Offset must be at least 0")
    .default(0),
});

/**
 * Validates location query parameters
 * Applies defaults if values are missing or invalid
 * Returns validated location query parameters
 */
export function validateLocationParams(params: unknown): LocationParams {
  return LocationParamsSchema.parse(params);
}

/**
 * Type-safe validation with error handling
 * Returns validated params or throws ApiError with validation error code
 */
export function validateLocationParamsHandled(params: unknown): LocationParams {
  try {
    return validateLocationParams(params);
  } catch (error) {
    handleZodValidationError(error, "location params");
  }
}
