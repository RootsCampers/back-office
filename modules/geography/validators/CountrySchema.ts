import { z } from "zod";
import { Country } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating Country from backend
 */
const CountrySchema = z.object({
  code: z.string(),
  default_currency: z.string(),
  default_timezone: z.string(),
  is_active: z.boolean(),
  name: z.string(),
  phone_code: z.string().optional(),
});

/**
 * Validates country data
 * Returns validated country data
 */
export function validateCountryData(data: unknown): Country {
  return CountrySchema.parse(data) as Country;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateCountryDataHandled(data: unknown): Country {
  try {
    return validateCountryData(data);
  } catch (error) {
    handleZodValidationError(error, "country");
  }
}
