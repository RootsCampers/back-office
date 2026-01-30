import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { AdvertisingExtra, AdvertisingExtraListResponse } from "../domain";

const AdvertisingExtraSchema = z.object({
  id: z.string(),
  advertising_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price_per_day: z.number(),
  max_quantity: z.number().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const AdvertisingExtraListResponseSchema = z.object({
  extras: z.array(AdvertisingExtraSchema),
  page_size: z.number(),
  total_count: z.number(),
});

/**
 * Validates extras list response data
 * @param data - Raw data to validate
 * @returns Validated AdvertisingExtraListResponse
 * @throws ApiError if validation fails
 */
export function validateExtraListResponse(
  data: unknown
): AdvertisingExtraListResponse {
  const result = AdvertisingExtraListResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("Extras validation error:", result.error);
    throw new ApiError(ERROR_CODES.VALIDATION_FAILED, "Invalid extras data");
  }
  return result.data;
}

/**
 * Validates a single extra response
 * @param data - Raw data to validate
 * @returns Validated AdvertisingExtra
 * @throws ApiError if validation fails
 */
export function validateExtra(data: unknown): AdvertisingExtra {
  const result = AdvertisingExtraSchema.safeParse(data);
  if (!result.success) {
    console.error("Extra validation error:", result.error);
    throw new ApiError(ERROR_CODES.VALIDATION_FAILED, "Invalid extra data");
  }
  return result.data;
}
