import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type { Trip, TripsData, PendingConfirmationsData } from "../domain";

/**
 * Zod Schemas for Trip validation
 */

const TripStatusSchema = z.object({
  id: z.string(),
  status: z.string(),
  timestamp: z.string(),
});

const TripCamperSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(z.string()).default([]),
  type: z.string(),
  license_plate: z.string().optional(),
});

const TripTravelerSchema = z.object({
  id: z.string(),
  email: z.string(),
});

const OwnerReviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  created_at: z.string(),
});

const TravelerReviewSchema = z.object({
  id: z.string(),
  owner_rating: z.number(),
  owner_comment: z.string(),
  camper_rating: z.number(),
  camper_comment: z.string(),
  created_at: z.string(),
});

const InspectionPhotoSchema = z.object({
  id: z.string(),
  photo_position: z.string(),
  storage_url: z.string(),
  uploaded_at: z.string(),
});

const InspectionSummarySchema = z.object({
  id: z.string(),
  inspection_type: z.enum(["check_out", "check_in"]),
  completed_at: z.string().nullable(),
  photo_count: z.number(),
  photos: z.array(InspectionPhotoSchema),
});

const TripSchema = z.object({
  id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  total_price: z.number(),
  created_at: z.string(),
  start_km: z.number().nullable().optional(),
  end_km: z.number().nullable().optional(),
  total_km: z.number().nullable().optional(),
  price_per_day: z.number(),
  minimum_days: z.number(),
  statuses: z.array(TripStatusSchema),
  camper: TripCamperSchema,
  traveler: TripTravelerSchema,
  owner_review: OwnerReviewSchema.nullable(),
  traveler_review: TravelerReviewSchema.nullable(),
  can_review: z.boolean(),
  inspection: InspectionSummarySchema.nullable().optional(),
});

const TripsDataSchema = z.object({
  trips: z.array(TripSchema),
  count: z.number(),
});

const PendingConfirmationSchema = z.object({
  trip_id: z.string(),
  end_date: z.string(),
  camper_id: z.string(),
  created_at: z.string(),
  start_date: z.string(),
  camper_name: z.string(),
  total_price: z.number(),
  traveler_id: z.string(),
  advertising_name: z.string(),
  status_timestamp: z.string(),
  default_security_deposit: z.number(),
});

const PendingConfirmationsDataSchema = z.object({
  confirmations: z.array(PendingConfirmationSchema),
  count: z.number(),
});

/**
 * Validates trips data from API response
 * @throws ApiError if validation fails
 */
export function validateTripsData(data: unknown): TripsData {
  const result = TripsDataSchema.safeParse(data);
  if (!result.success) {
    console.error("Trips validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid trips data received from server"
    );
  }
  return result.data;
}

/**
 * Validates a single trip from API response
 * @throws ApiError if validation fails
 */
export function validateTrip(data: unknown): Trip {
  const result = TripSchema.safeParse(data);
  if (!result.success) {
    console.error("Trip validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid trip data received from server"
    );
  }
  return result.data;
}

/**
 * Validates pending confirmations data from API response
 * @throws ApiError if validation fails
 */
export function validatePendingConfirmationsData(
  data: unknown
): PendingConfirmationsData {
  const result = PendingConfirmationsDataSchema.safeParse(data);
  if (!result.success) {
    console.error("Pending confirmations validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid pending confirmations data received from server"
    );
  }
  return result.data;
}

/**
 * Validates trips data with graceful handling (returns default on error)
 */
export function validateTripsDataHandled(data: unknown): TripsData {
  try {
    return validateTripsData(data);
  } catch {
    return { trips: [], count: 0 };
  }
}

/**
 * Validates pending confirmations with graceful handling
 */
export function validatePendingConfirmationsDataHandled(
  data: unknown
): PendingConfirmationsData {
  try {
    return validatePendingConfirmationsData(data);
  } catch {
    return { confirmations: [], count: 0 };
  }
}
