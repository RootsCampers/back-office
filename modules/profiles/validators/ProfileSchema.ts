import { z } from "zod";
import { PersonalInfo } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

/**
 * Zod schema for validating Profile from backend
 */
const ProfileSchema = z.object({
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  birth_date: z.string().optional(),
  created_at: z.string().optional(),
  full_name: z.string(),
  id: z.string(),
  languages: z.array(z.string()).nullable(),
  nationality: z.string().optional(),
  personal_tax_id: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Validates profile data
 * Returns validated profile data
 */
export function validateProfileData(data: unknown): PersonalInfo {
  return ProfileSchema.parse(data) as PersonalInfo;
}

/**
 * Type-safe validation with error handling
 * Returns validated data or throws ApiError with validation error code
 */
export function validateProfileDataHandled(data: unknown): PersonalInfo {
  try {
    return validateProfileData(data);
  } catch (error) {
    handleZodValidationError(error, "profile");
  }
}
