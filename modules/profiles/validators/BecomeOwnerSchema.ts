import { z } from "zod";
import { BecomeOwnerRequest, BecomeOwnerResponse } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating BecomeOwner response from backend
 */
const BecomeOwnerResponseSchema = z.object({
    organization_id: z.string(),
    role: z.string(),
    message: z.string(),
});

const BecomeOwnerRequestSchema = z.object({
    personal_info: z.object({
        full_name: z.string(),
        birth_date: z.string().optional().nullable(),
        personal_tax_id: z.string(),
        nationality: z.string(),
        languages: z.array(z.object({ language: z.string(), level: z.string() })),
    }),
    business_info: z.object({
        type: z.enum(["individual", "business"]),
        name: z.string().optional().nullable(),
        tax_id: z.string().optional().nullable(),
    }),
});

/**
 * Validates become-owner response data
 * Returns validated response data
 */
export function validateBecomeOwnerResponse(data: unknown): BecomeOwnerResponse {
    return BecomeOwnerResponseSchema.parse(data) as BecomeOwnerResponse;
}

/**
 * Validates become-owner request data
 * Returns validated request data
 */
export function validateBecomeOwnerRequest(data: unknown): BecomeOwnerRequest {
    return BecomeOwnerRequestSchema.parse(data) as BecomeOwnerRequest;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateBecomeOwnerResponseHandled(data: unknown): BecomeOwnerResponse {
    try {
        return validateBecomeOwnerResponse(data);
    } catch (error) {
        handleZodValidationError(error, "become_owner");
    }
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateBecomeOwnerRequestHandled(data: unknown): BecomeOwnerRequest {
    try {
        return validateBecomeOwnerRequest(data);
    } catch (error) {
        handleZodValidationError(error, "become_owner_request");
    }
}