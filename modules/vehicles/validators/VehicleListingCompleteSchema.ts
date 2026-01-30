import { z } from "zod";
import { VehiclesCompleteListingData } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { RVType } from "@/modules/shared/domain";

/**
 * Zod schema for validating Vehicle Complete Listing from backend
 */
const VehicleCompleteListingSchema = z.object({
  advertising: z.object({
    base_price_per_day: z.number().positive(),
    id: z.number().int().positive(),
    is_active: z.boolean(),
    max_daily_km: z.number().int().positive().nullable(),
    minimum_days: z.number().int().positive(),
    price_range: z.object({
      max_price: z.number().positive(),
      min_price: z.number().positive(),
    }),
    pricing_rules: z.array(
      z.object({
        end_day: z.number().int().nonnegative(),
        end_month: z.number().int().positive(),
        id: z.string(),
        name: z.string(),
        price_per_day: z.number().positive(),
        start_day: z.number().int().nonnegative(),
        start_month: z.number().int().positive(),
        tier_pricing: z.unknown(),
      }),
    ),
    security_deposit_amount: z.number().nonnegative(),
  }),
  available_amenities: z.array(z.string()),
  description: z.string(),
  id: z.string(),
  images: z.array(z.string()),
  location: z.object({
    city: z.string(),
    country: z.string(),
    country_code: z.string(),
    id: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    name: z.string(),
    state: z.string(),
  }),
  manufacturer: z.string(),
  model: z.string(),
  name: z.string(),
  passengers: z.number().int().positive(),
  type: z.nativeEnum(RVType),
  vehicle_length: z.number().nonnegative(),
  year_of_registration: z.number().int().positive(),
});

/**
 * Zod schema for validating Vehicles Complete Listings response from backend
 */
const VehiclesCompleteListingDataSchema = z.object({
  fleet: z.array(VehicleCompleteListingSchema),
  total_count: z.number().int().nonnegative(),
});

/**
 * Validates complete vehicles listings data
 */
export function validateVehiclesCompleteListingsData(
  data: unknown,
): VehiclesCompleteListingData {
  return VehiclesCompleteListingDataSchema.parse(
    data,
  ) as VehiclesCompleteListingData;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateVehiclesCompleteListingsDataHandled(
  data: unknown,
): VehiclesCompleteListingData {
  try {
    if (!data || typeof data !== "object") {
      throw new z.ZodError([
        {
          code: "invalid_type",
          expected: "object",
          received: typeof data,
          path: [],
          message: "Invalid vehicles data structure",
        },
      ]);
    }

    const dataObj = data as { fleet?: unknown[]; total_count?: unknown };
    const rawVehicles = dataObj.fleet || [];
    const rawCount = dataObj.total_count || 0;

    // Filter out invalid vehicles
    const validVehicles = rawVehicles
      .map((vehicle) => {
        const result = VehicleCompleteListingSchema.safeParse(vehicle);
        if (!result.success) {
          console.warn(
            "[VehicleCompleteListingSchema] Skipping invalid vehicle:",
            result.error.errors,
          );
          return null;
        }
        return result.data;
      })
      .filter(
        (v): v is z.infer<typeof VehicleCompleteListingSchema> => v !== null,
      );

    return {
      fleet: validVehicles,
      total_count:
        typeof rawCount === "number" ? rawCount : validVehicles.length,
    } as VehiclesCompleteListingData;
  } catch (error) {
    handleZodValidationError(error, "vehicles complete listings data");
  }
}
