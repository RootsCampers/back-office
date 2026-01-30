import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { VehiclesSearchParams } from "../domain";

/**
 * Zod schema for validating vehicles search parameters
 * - country: must be a string
 * - end_date: must be a string
 * - start_date: must be a string
 * - passengers: must be a number, optional
 * - state: must be a string, optional
 */
const VehiclesSearchParamsSchema = z.object({
  country: z.string(),
  end_date: z.string(),
  start_date: z.string(),
  passengers: z.number().int().positive().optional(),
  state: z.string().optional(),
});

/**
 * Validates vehicles search params
 * Returns validated vehicles search params
 */
export function validateVehiclesSearchParams(
  params: unknown,
): VehiclesSearchParams {
  return VehiclesSearchParamsSchema.parse(params);
}

/**
 * Type-safe validation with error handling
 * Returns validated params or throws ApiError with validation error code
 */
export function validateVehiclesSearchParamsHandled(
  params: unknown,
): VehiclesSearchParams {
  try {
    return validateVehiclesSearchParams(params);
  } catch (error) {
    handleZodValidationError(error, "vehicles search params");
  }
}
