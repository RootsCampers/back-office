import { FuelType, LatamCountry, RVType, TransmissionType } from "@/modules/shared/domain";
import { z } from "zod";
import { VehicleRequest } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

const VehicleRequestSchema = z.object({
  acquisition_value: z.number().nonnegative().optional(),
  available_amenities: z.array(z.string()).optional().nullable(),
  description: z.string().max(4000).optional(),
  fuel: z.nativeEnum(FuelType).optional(),
  headquarter_location_id: z.string().optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  license_plate: z.string().optional(),
  manufacturer: z.string().optional(),
  mileage: z.number().int().nonnegative().optional(),
  model: z.string().optional(),
  name: z.string().max(100).optional(),
  owner_id: z.string().optional(),
  passengers: z.number().int().positive().optional(),
  preparation_days: z.number().int().nonnegative().optional(),
  registration_country: z.nativeEnum(LatamCountry).optional(),
  transmission: z.nativeEnum(TransmissionType).optional(),
  type: z.nativeEnum(RVType).optional(),
  vehicle_weight: z.number().nonnegative().optional(),
  vehicle_length: z.number().nonnegative().optional(),
  year_of_registration: z.number().int().nonnegative().min(1900).optional(),
});

export function validateVehicleRequestData(data: unknown): VehicleRequest {
  return VehicleRequestSchema.parse(data) as VehicleRequest;
}

export function validateVehicleRequestDataHandled(data: unknown): VehicleRequest {
  try {
    return validateVehicleRequestData(data);
  } catch (error) {
    handleZodValidationError(error, "vehicle request");
  }
}