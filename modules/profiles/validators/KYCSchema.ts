import { z } from "zod";
import {
  CreateKYCSessionResponse,
  KYCStatus,
  KYCStatusData,
} from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating KYCStatusData from backend
 */
const KYCStatusDataSchema = z.object({
  can_create_session: z.boolean(),
  extracted_birth_date: z.string().optional(),
  extracted_dni: z.string().optional(),
  extracted_full_name: z.string().optional(),
  extracted_nationality: z.string().optional(),
  is_verified: z.boolean(),
  session_id: z.string().optional(),
  status: z.nativeEnum(KYCStatus),
  synced_at: z.string().optional(),
  verified_at: z.string().optional(),
});

/**
 * Zod schema for validating CreateKYCSessionResponse from backend
 */
const CreateKYCSessionResponseSchema = z.object({
  existing_session: z.boolean(),
  session_id: z.string(),
  verification_url: z.string().optional(),
});

/**
 * Validates KYCStatusData data
 * Returns validated KYCStatusData data
 */
export function validateKYCStatusData(data: unknown): KYCStatusData {
  return KYCStatusDataSchema.parse(data) as KYCStatusData;
}

/**
 * Validates CreateKYCSessionResponse data
 * Returns validated CreateKYCSessionResponse data
 */
export function validateCreateKYCSessionResponse(
  data: unknown,
): CreateKYCSessionResponse {
  return CreateKYCSessionResponseSchema.parse(data) as CreateKYCSessionResponse;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateKYCStatusDataHandled(data: unknown): KYCStatusData {
  try {
    return validateKYCStatusData(data);
  } catch (error) {
    handleZodValidationError(error, "kyc_status_data");
  }
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateCreateKYCSessionResponseHandled(
  data: unknown,
): CreateKYCSessionResponse {
  try {
    return validateCreateKYCSessionResponse(data);
  } catch (error) {
    handleZodValidationError(error, "create_kyc_session_response");
  }
}

