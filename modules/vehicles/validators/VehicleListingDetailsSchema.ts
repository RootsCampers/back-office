import { z } from "zod";
import { VehicleListingDetails } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { FuelType, RVType, TransmissionType } from "@/modules/shared/domain";

/**
 * Zod schema for validating Vehicle Details from backend
 */
const VehicleListingDetailsSchema = z.object({
  acquisition_value: z.number().int().nonnegative(),
  advertising: z.object({
    active_offers: z.array(
      z.object({
        description: z.string().optional().default(""),
        discount_percentage: z.number().positive(),
        id: z.string(),
        minimum_days: z.number().int().nonnegative().optional().default(1),
        name: z.string(),
        valid_from: z.string(),
        valid_until: z.string(),
      }),
    ),
    cancellation_policy: z
      .object({
        cancellation_rules: z.unknown(),
        id: z.string(),
        name: z.string(),
        policy_type: z.string(),
      })
      .nullable()
      .optional(),
    description: z.string().optional().default(""),
    extras: z.array(
      z.object({
        description: z.string().optional().default(""),
        id: z.string(),
        max_quantity: z.number().int().nonnegative(),
        name: z.string(),
        price_per_day: z.number().nonnegative(),
      }),
    ),
    id: z.number().int().positive(),
    max_daily_km: z.number().int().nonnegative().nullable().optional(),
    minimum_days: z.number().int().positive(),
    name: z.string(),
    pricing_rules: z.array(
      z.object({
        end_day: z.number().int().positive().nullable().optional(),
        end_month: z.number().int().positive(),
        id: z.string(),
        price_per_day: z.number().nonnegative(),
        start_day: z.number().int().positive().nullable().optional(),
        start_month: z.number().int().positive(),
        tier_pricing: z.unknown().optional(),
      }),
    ),
    security_deposit_amount: z.number().nonnegative().nullable().optional(),
  }),
  available_amenities: z.array(z.string()),
  description: z.string(),
  fuel: z.nativeEnum(FuelType),
  id: z.string(),
  images: z.array(z.string()),
  license_plate: z.string(),
  location: z.object({
    city: z.string().optional().default(""),
    city_id: z.string().optional().default(""),
    country: z.string(),
    country_code: z.string(),
    id: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().optional().default(""),
    region_id: z.string().optional().default(""),
    state: z.string().optional().default(""),
  }),
  manufacturer: z.string(),
  mileage: z.number().int().nonnegative(),
  model: z.string(),
  name: z.string(),
  owner_id: z.string(),
  passengers: z.number().int().positive(),
  preparation_days: z.number().int().nonnegative(),
  registration_country: z.string(),
  transmission: z.nativeEnum(TransmissionType),
  type: z.nativeEnum(RVType),
  vehicle_length: z.number().nonnegative(),
  vehicle_weight: z.number().nonnegative(),
  year_of_registration: z.number().int().positive(),
});

/**
 * Validates vehicle listing details data
 * Returns validated vehicle listing details data
 */
export function validateVehicleListingDetailsData(
  data: unknown,
): VehicleListingDetails {
  return VehicleListingDetailsSchema.parse(data) as VehicleListingDetails;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateVehicleListingDetailsDataHandled(
  data: unknown,
): VehicleListingDetails {
  try {
    return validateVehicleListingDetailsData(data);
  } catch (error) {
    handleZodValidationError(error, "vehicle details");
  }
}
