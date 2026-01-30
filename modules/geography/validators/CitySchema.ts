import { z } from "zod";
import { City } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating City from backend
 */
const CitySchema = z.object({
  id: z.string(),
  is_active: z.boolean(),
  is_capital: z.boolean(),
  name: z.string(),
  region_id: z.string(),
  timezone: z.string().optional(),
});

/**
 * Zod schema for validating cities list response from backend
 */
const CitiesListSchema = z.object({
  cities: z.array(CitySchema),
});

/**
 * Validates city data
 * Returns validated city data
 */
export function validateCityData(data: unknown): City {
  return CitySchema.parse(data) as City;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateCityDataHandled(data: unknown): City {
  try {
    return validateCityData(data);
  } catch (error) {
    handleZodValidationError(error, "city");
  }
}

/**
 * Validates cities list response
 * Returns validated cities array
 */
export function validateCitiesListDataHandled(data: unknown): City[] {
  try {
    const result = CitiesListSchema.parse(data);
    return result.cities as City[];
  } catch (error) {
    handleZodValidationError(error, "cities list");
  }
}
