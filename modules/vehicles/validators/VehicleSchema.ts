import { z } from "zod";
import { VehiclesData } from "@/modules/vehicles/domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating Vehicle from backend
 */
const VehicleSchema = z.object({
  advertising_id: z.number().int().positive(),
  available_amenities: z.array(z.string()),
  description: z.string(),
  financials: z.object({
    base_price_per_day: z.number().positive(),
    currency: z.string(),
    security_deposit: z.number().nonnegative().nullable().default(0),
  }),
  headquarter_location_id: z.string(),
  id: z.string(),
  images: z.array(z.string()),
  location: z.object({
    address: z.string().optional().default(""),
    city: z.string().optional().default(""),
    country: z.string(),
    state: z.string().optional().default(""),
  }),
  manufacturer: z.string(),
  minimum_days: z.number().int().positive(),
  model: z.string(),
  name: z.string(),
  passengers: z.number().int().positive(),
  type: z.string(),
  vehicle_length: z.number().nonnegative(),
});

/**
 * Zod schema for validating Vehicles response from backend
 */
const VehiclesDataSchema = z.object({
  vehicles: z.array(VehicleSchema),
  count: z.number().int().nonnegative(),
});

/**
 * Validates vehicles data
 * Returns validated vehicles data
 */
export function validateVehiclesData(data: unknown): VehiclesData {
  return VehiclesDataSchema.parse(data) as VehiclesData;
}

/**
 * Type-safe validation with error handling
 * Filters out invalid vehicles instead of failing the entire request
 * Returns validated data or throws ApiError with validation error code
 */
export function validateVehiclesDataHandled(data: unknown): VehiclesData {
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

    const dataObj = data as { vehicles?: unknown[]; count?: unknown };
    const rawVehicles = dataObj.vehicles || [];
    const rawCount = dataObj.count || 0;

    // Filter out invalid vehicles
    const validVehicles = rawVehicles
      .map((vehicle) => {
        const result = VehicleSchema.safeParse(vehicle);
        if (!result.success) {
          console.warn(
            "[VehicleSchema] Skipping invalid vehicle:",
            result.error.errors,
          );
          return null;
        }
        return result.data;
      })
      .filter((v): v is z.infer<typeof VehicleSchema> => v !== null);

    return {
      vehicles: validVehicles,
      count: typeof rawCount === "number" ? rawCount : validVehicles.length,
    } as VehiclesData;
  } catch (error) {
    handleZodValidationError(error, "vehicles data");
  }
}
