import { z } from "zod";
import { ApiError } from "../api/errors";
import { ERROR_CODES } from "../constants/errorCodes";

/**
 * Handles Zod validation errors by converting them to ApiError
 *
 * @param error - The error to handle (expected to be ZodError)
 * @param context - Context string for error messages (e.g., "vehicle", "location", "country")
 * @throws {ApiError} Always throws an ApiError with VALIDATION_FAILED code for ZodErrors
 * @throws {unknown} Re-throws non-Zod errors as-is
 *
 * @example
 * ```ts
 * try {
 *   return schema.parse(data);
 * } catch (error) {
 *   handleZodValidationError(error, "vehicle");
 * }
 * ```
 */
export function handleZodValidationError(
  error: unknown,
  context: string, // "vehicle", "location", "country", "region", "city"
): never {
  if (error instanceof z.ZodError) {
    console.error(`[${context}] Validation failed:`, error.errors);
    const errorMessage = error.errors
      .map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      })
      .join(", ");
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      `Invalid ${context} data structure: ${errorMessage}`,
    );
  }
  throw error;
}
