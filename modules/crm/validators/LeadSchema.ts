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
 * Lead source enum for validation - matches backend crm.lead_source
 */
export const LeadSourceSchema = z.enum([
  "website",
  "referral",
  "social_media",
  "marketplace",
  "phone",
  "email",
  "walk_in",
  "other",
]);

/**
 * Lead schema for API responses - matches backend LeadResponse
 */
export const LeadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  stage: LeadStageSchema,
  stage_changed_at: z.string(),
  assigned_to: z.string().uuid().optional().nullable(),
  source: LeadSourceSchema.optional().nullable(),
  source_detail: z.string().optional().nullable(),
  trip_start_date: z.string().optional().nullable(),
  trip_end_date: z.string().optional().nullable(),
  destination: z.string().optional().nullable(),
  travelers_count: z.number().int().optional().nullable(),
  advertising_id: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
  next_follow_up_at: z.string().optional().nullable(),
  lost_reason: z.string().optional().nullable(),
  booking_id: z.string().uuid().optional().nullable(),
  converted_at: z.string().optional().nullable(),
  organization_id: z.string().uuid(),
  created_by: z.string().uuid().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Lead list response schema
 */
export const LeadListResponseSchema = z.object({
  leads: z.array(LeadSchema),
  total: z.number().int(),
});

/**
 * Lead stats response schema
 */
export const LeadStatsSchema = z.object({
  new_inquiry_count: z.number().int(),
  contacted_count: z.number().int(),
  quote_sent_count: z.number().int(),
  negotiating_count: z.number().int(),
  booked_count: z.number().int(),
  lost_count: z.number().int(),
  total_count: z.number().int(),
});

/**
 * Lead status history response schema
 */
export const LeadStatusHistorySchema = z.object({
  id: z.string().uuid(),
  lead_id: z.string().uuid(),
  from_stage: LeadStageSchema.optional().nullable(),
  to_stage: LeadStageSchema,
  changed_by: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  created_at: z.string(),
});

export const LeadStatusHistoryListSchema = z.array(LeadStatusHistorySchema);

/**
 * Create lead data schema - matches backend LeadCreateRequest
 */
export const CreateLeadDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  stage: LeadStageSchema.optional(),
  assigned_to: z.string().uuid().optional(),
  source: LeadSourceSchema.optional(),
  source_detail: z.string().optional(),
  trip_start_date: z.string().optional(),
  trip_end_date: z.string().optional(),
  destination: z.string().optional(),
  travelers_count: z.number().int().optional(),
  advertising_id: z.number().int().optional(),
  notes: z.string().optional(),
  next_follow_up_at: z.string().optional(),
});

/**
 * Update lead data schema - matches backend LeadUpdateRequest
 */
export const UpdateLeadDataSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  source: LeadSourceSchema.optional(),
  source_detail: z.string().optional(),
  trip_start_date: z.string().optional(),
  trip_end_date: z.string().optional(),
  destination: z.string().optional(),
  travelers_count: z.number().int().optional(),
  advertising_id: z.number().int().optional(),
  notes: z.string().optional(),
  next_follow_up_at: z.string().optional(),
});

/**
 * Stage update schema - matches backend LeadStageUpdateRequest
 */
export const LeadStageUpdateSchema = z.object({
  stage: LeadStageSchema,
  lost_reason: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Convert lead schema - matches backend LeadConvertRequest
 */
export const LeadConvertSchema = z.object({
  booking_id: z.string().uuid(),
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
export function validateLeadListResponseHandled(data: unknown) {
  const result = LeadListResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("Lead list validation error:", result.error);
    throw new ApiError("validation_error", "Invalid lead list data");
  }
  return result.data;
}

/**
 * Validate lead stats from API response
 */
export function validateLeadStatsHandled(data: unknown) {
  const result = LeadStatsSchema.safeParse(data);
  if (!result.success) {
    console.error("Lead stats validation error:", result.error);
    throw new ApiError("validation_error", "Invalid lead stats data");
  }
  return result.data;
}

/**
 * Validate lead status history from API response
 */
export function validateLeadStatusHistoryHandled(data: unknown) {
  const result = LeadStatusHistoryListSchema.safeParse(data);
  if (!result.success) {
    console.error("Lead status history validation error:", result.error);
    throw new ApiError("validation_error", "Invalid lead status history data");
  }
  return result.data;
}

/**
 * Validate create lead input
 */
export function validateCreateLeadData(data: unknown) {
  const result = CreateLeadDataSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(
      "validation_error",
      result.error.errors[0]?.message || "Invalid input"
    );
  }
  return result.data;
}

/**
 * Validate update lead input
 */
export function validateUpdateLeadData(data: unknown) {
  const result = UpdateLeadDataSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(
      "validation_error",
      result.error.errors[0]?.message || "Invalid input"
    );
  }
  return result.data;
}

/**
 * Validate stage update input
 */
export function validateLeadStageUpdate(data: unknown) {
  const result = LeadStageUpdateSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(
      "validation_error",
      result.error.errors[0]?.message || "Invalid input"
    );
  }
  return result.data;
}
