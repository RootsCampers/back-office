import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type { VehicleDetail, VehicleDocumentsData, VehicleVideosData, VehicleInstructionalVideo, VehicleDocument } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod Schemas for Vehicle Detail validation
 * Validates response from GET /api/vehicles/{id}
 */

const VehicleDetailSchema = z.object({
  id: z.string(),
  owner_id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  type: z.string(),
  manufacturer: z.string().nullable(),
  model: z.string().nullable(),
  year_of_registration: z.number().nullable(),
  license_plate: z.string().nullable(),
  registration_country: z.string().nullable(),
  transmission: z.string().nullable(),
  mileage: z.number().nullable(),
  fuel: z.string().nullable(),
  vehicle_weight: z.number().nullish(),
  vehicle_length: z.number().nullish(),
  acquisition_value: z.number().nullish(),
  passengers: z.number().nullable(),
  images: z.array(z.string()).default([]),
  available_amenities: z.array(z.string()).default([]),
  preparation_days: z.number().nullish(),
  headquarter_location_id: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

/**
 * Validates vehicle detail data from API response
 * @throws ApiError if validation fails
 */
export function validateVehicleDetail(data: unknown): VehicleDetail {
  const result = VehicleDetailSchema.safeParse(data);
  if (!result.success) {
    console.error("Vehicle detail validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid vehicle detail data received from server"
    );
  }
  return result.data as VehicleDetail;
}

/**
 * Validates vehicle detail data with graceful handling (throws on error)
 */
export function validateVehicleDetailHandled(data: unknown): VehicleDetail {
  return validateVehicleDetail(data);
}

// ============================================================================
// Vehicle Documents Schema
// ============================================================================

const VehicleDocumentSchema = z.object({
  id: z.string(),
  vehicle_id: z.string(),
  document_type: z.string(),
  document_url: z.string(),
  document_name: z.string().nullable().optional(),
  expiration_date: z.string().nullable().optional(),
  is_valid: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const VehicleDocumentsDataSchema = z.object({
  documents: z.array(VehicleDocumentSchema),
});

/**
 * Validates vehicle documents data from API response
 * @throws ApiError if validation fails
 */
export function validateVehicleDocumentsData(data: unknown): VehicleDocumentsData {
try {
  return VehicleDocumentsDataSchema.parse(data) as VehicleDocumentsData;
} catch (error) {
  handleZodValidationError(error, "vehicle_documents_data");
}
}

/**
 * Validates vehicle documents data with graceful handling
 */
export function validateVehicleDocumentsDataHandled(data: unknown): VehicleDocumentsData {
  try {
    return validateVehicleDocumentsData(data);
  } catch (error) {
    console.error("Vehicle documents validation failed, returning empty data:", error);
    return { documents: [] };
  }
}

/**
 * Validates a single document from API response
 * @throws ApiError if validation fails
 */
export function validateVehicleDocument(data: unknown): VehicleDocument {
  const result = VehicleDocumentSchema.safeParse(data);
  if (!result.success) {
    console.error("Vehicle document validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid vehicle document data received from server"
    );
  }
  return result.data as VehicleDocument;
}

// ============================================================================
// Vehicle Videos Schema
// ============================================================================

const VehicleInstructionalVideoSchema = z.object({
  id: z.string(),
  vehicle_id: z.string(),
  title: z.string(),
  youtube_url: z.string(),
  description: z.string().nullish(),
  display_order: z.number(),
  is_active: z.boolean(),
  created_by: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const VehicleVideosDataSchema = z.object({
  videos: z.array(VehicleInstructionalVideoSchema),
});

/**
 * Validates vehicle videos data from API response
 * @throws ApiError if validation fails
 */
export function validateVehicleVideosData(data: unknown): VehicleVideosData {
  const result = VehicleVideosDataSchema.safeParse(data);
  if (!result.success) {
    console.error("Vehicle videos validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid vehicle videos data received from server"
    );
  }
  return result.data as VehicleVideosData;
}

/**
 * Validates vehicle videos data with graceful handling
 */
export function validateVehicleVideosDataHandled(data: unknown): VehicleVideosData {
  try {
    return validateVehicleVideosData(data);
  } catch (error) {
    console.error("Vehicle videos validation failed, returning empty data:", error);
    return { videos: [] };
  }
}

/**
 * Validates a single instructional video from API response
 * @throws ApiError if validation fails
 */
export function validateVehicleInstructionalVideo(data: unknown): VehicleInstructionalVideo {
  const result = VehicleInstructionalVideoSchema.safeParse(data);
  if (!result.success) {
    console.error("Vehicle video validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid vehicle video data received from server"
    );
  }
  return result.data as VehicleInstructionalVideo;
}
