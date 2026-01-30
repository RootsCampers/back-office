import { z } from "zod";
import { Region } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating Region from backend
 */
const RegionSchema = z.object({
  code: z.string().optional(),
  country_code: z.string(),
  id: z.string(),
  is_active: z.boolean(),
  name: z.string(),
  timezone: z.string().optional(),
});

/**
 * Zod schema for validating regions list response from backend
 */
const RegionsListSchema = z.object({
  regions: z.array(RegionSchema),
});

/**
 * Validates region data
 * Returns validated region data
 */
export function validateRegionData(data: unknown): Region {
  return RegionSchema.parse(data) as Region;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateRegionDataHandled(data: unknown): Region {
  try {
    return validateRegionData(data);
  } catch (error) {
    handleZodValidationError(error, "region");
  }
}

/**
 * Validates regions list response
 * Returns validated regions array
 */
export function validateRegionsListDataHandled(data: unknown): Region[] {
  try {
    const result = RegionsListSchema.parse(data);
    return result.regions as Region[];
  } catch (error) {
    handleZodValidationError(error, "regions list");
  }
}
