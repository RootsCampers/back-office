import { z } from "zod";
import { ApiError } from "@/lib/api/errors";

/**
 * Lead stage enum for validation
 */
export const LeadStageSchema = z.enum([
  "new_inquiry",
  "contacted",
  "quote_sent",
  "negotiating",
  "booked",
  "lost",
]);

/**
 * Trip dates schema
 */
export const TripDatesSchema = z.object({
  start: z.string(),
  end: z.string(),
});

/**
 * Lead schema for API responses
 */
export const LeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  stage: LeadStageSchema,
  source: z.string(),
  notes: z.string().optional(),
  vehicleInterest: z.string().optional(),
  tripDates: TripDatesSchema.optional(),
  quotedPrice: z.number().optional(),
  lostReason: z.string().optional(),
  assignedTo: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Lead list schema
 */
export const LeadListSchema = z.array(LeadSchema);

/**
 * Create lead data schema
 */
export const CreateLeadDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional(),
  vehicleInterest: z.string().optional(),
  tripDates: TripDatesSchema.optional(),
});

/**
 * Update lead data schema
 */
export const UpdateLeadDataSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  stage: LeadStageSchema.optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  vehicleInterest: z.string().optional(),
  tripDates: TripDatesSchema.optional(),
  quotedPrice: z.number().optional(),
  lostReason: z.string().optional(),
  assignedTo: z.string().optional(),
});

/**
 * Validate lead data from API response
 */
export function validateLeadDataHandled(data: unknown) {
  const result = LeadSchema.safeParse(data);
  if (!result.success) {
    console.error("Lead validation error:", result.error);
    throw new ApiError("validation_error", "Invalid lead data");
  }
  return result.data;
}

/**
 * Validate lead list from API response
 */
export function validateLeadListHandled(data: unknown) {
  const result = LeadListSchema.safeParse(data);
  if (!result.success) {
    console.error("Lead list validation error:", result.error);
    throw new ApiError("validation_error", "Invalid lead list data");
  }
  return result.data;
}

/**
 * Validate create lead input
 */
export function validateCreateLeadData(data: unknown) {
  const result = CreateLeadDataSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError("validation_error", result.error.errors[0]?.message || "Invalid input");
  }
  return result.data;
}

/**
 * Validate update lead input
 */
export function validateUpdateLeadData(data: unknown) {
  const result = UpdateLeadDataSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError("validation_error", result.error.errors[0]?.message || "Invalid input");
  }
  return result.data;
}
