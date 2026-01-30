import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { UploadResponse } from "../domain/types";

/**
 * Schema for upload response
 */
export const UploadResponseSchema = z.object({
  path: z.string(),
  public_url: z.string().url(),
  size: z.number(),
});

/**
 * Schema for delete response
 */
export const DeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

/**
 * Validates upload response data
 */
export function validateUploadResponse(data: unknown) {
  try {
    return UploadResponseSchema.parse(data) as UploadResponse;
  } catch (error) {
    handleZodValidationError(error, "upload_response");
  }
}

/**
 * Validates delete response data
 */
export function validateDeleteResponse(data: unknown) {
  const result = DeleteResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("[storage] Validation failed:", result.error.format());
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      `Invalid delete response data structure: ${result.error.message}`
    );
  }
  return result.data;
}
