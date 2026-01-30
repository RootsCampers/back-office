import { z } from "zod";
import { Location, LocationsData } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating activeLocation from backend
 */
const LocationSchema = z.object({
  can_be_dropoff: z.boolean(),
  can_be_pickup: z.boolean(),
  category: z.string(),
  city_id: z.string().nullable().optional(),
  contact_name: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  country_code: z.string(),
  description: z.string().nullable().optional(),
  dropoff_fee: z.number().min(0),
  formatted_address: z.string(),
  google_place_id: z.string().nullable().optional(),
  id: z.string(),
  instructions: z.string().nullable().optional(),
  is_active: z.boolean(),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
  operating_hours: z.string().nullable().optional(),
  owner_id: z.string(),
  pickup_fee: z.number().min(0),
  region_id: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Zod schema for validating active Locations response from backend
 */
const LocationsDataSchema = z.object({
  locations: z.array(LocationSchema),
  total: z.number().int().min(0),
});

/**
 * Validates active locations data
 * Returns validated active locations data
 */
export function validateLocationsData(data: unknown): LocationsData {
  return LocationsDataSchema.parse(data) as LocationsData;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateLocationsDataHandled(data: unknown): LocationsData {
  try {
    return validateLocationsData(data);
  } catch (error) {
    handleZodValidationError(error, "locations");
  }
}

/**
 * Validates a single location
 * Returns validated location data
 */
export function validateLocation(data: unknown): Location {
  return LocationSchema.parse(data) as Location;
}

/**
 * Type-safe validation with error handling for single location
 * Returns validated data or throws ApiError with validation error code
 */
export function validateLocationHandled(data: unknown): Location {
  try {
    return validateLocation(data);
  } catch (error) {
    handleZodValidationError(error, "location");
  }
}
