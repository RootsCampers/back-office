import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type { OwnerDashboardData } from "../domain";

/**
 * Zod Schemas for Owner Dashboard validation
 * Validates response from GET /api/vehicles/owner-dashboard
 */

const OwnerLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  formatted_address: z.string().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  is_active: z.boolean(),
  location_type: z.string(),
});

const OwnerInfoSchema = z.object({
  id: z.string(),
  business_type: z.string(),
  business_name: z.string().nullable().optional(),
  tax_id: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  locations: z.array(OwnerLocationSchema),
});

const CamperLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  is_active: z.boolean(),
});

const SeasonalPricingRuleSchema = z.object({
  id: z.string(),
  start_month: z.number(),
  start_day: z.number().nullable().optional(),
  end_month: z.number(),
  end_day: z.number().nullable().optional(),
  price_per_day: z.number(),
  tier_pricing: z.unknown().optional(),
});

const DashboardAdvertisingSchema = z.object({
  id: z.number(),
  minimum_days: z.number(),
  is_active: z.boolean(),
  security_deposit: z.number().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  price_per_day: z.number().nullable().optional(),
  seasonal_pricing: z.array(SeasonalPricingRuleSchema),
});

const DashboardAdvertisingSummarySchema = z.object({
  id: z.number(),
  minimum_days: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  price_per_day: z.number().nullable().optional(),
});

const DashboardCamperSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  type: z.string(),
  passengers: z.number(),
  vehicle_length: z.number().nullable().optional(),
  images: z.array(z.string()).default([]),
  manufacturer: z.string(),
  model: z.string(),
  license_plate: z.string(),
  location: CamperLocationSchema.nullable().optional(),
  active_advertising: DashboardAdvertisingSchema.nullable().optional(),
  all_advertisings: z.array(DashboardAdvertisingSummarySchema).default([]),
});

const OwnerDashboardDataSchema = z.object({
  owner: OwnerInfoSchema,
  campers: z.array(DashboardCamperSchema),
});

/**
 * Validates owner dashboard data from API response
 * @throws ApiError if validation fails
 */
export function validateOwnerDashboardData(data: unknown): OwnerDashboardData {
  const result = OwnerDashboardDataSchema.safeParse(data);
  if (!result.success) {
    console.error("Owner dashboard validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid owner dashboard data received from server"
    );
  }
  return result.data as OwnerDashboardData;
}

/**
 * Validates owner dashboard data with graceful handling (returns default on error)
 */
export function validateOwnerDashboardDataHandled(
  data: unknown
): OwnerDashboardData {
  try {
    return validateOwnerDashboardData(data);
  } catch (error) {
    console.error("Owner dashboard validation failed, returning empty data:", error);
    return {
      owner: {
        id: "",
        business_type: "",
        created_at: "",
        updated_at: "",
        locations: [],
      },
      campers: [],
    };
  }
}
