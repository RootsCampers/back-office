import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import type {
  CancellationPolicy,
  CancellationPolicyListResponse,
  CancellationPolicyTemplate,
  CancellationPolicyTemplateListResponse,
} from "../domain/types";

// Schema for a single cancellation rule tier
const CancellationRuleSchema = z.object({
  days_before: z.number(),
  refund_percentage: z.number(),
});

// Schema for the canonical cancellation_rules payload
// Backend sends this as a single object: { min_hours_before_trip, refund_tiers }
// But may also send as array (legacy) or null, so we normalize it
const CancellationRulesSchema = z.preprocess(
  (val) => {
    // If it's already null or undefined, return null
    if (val === null || val === undefined) return null;
    // If it's an array, take the first element (legacy format)
    if (Array.isArray(val)) return val[0] || null;
    // Otherwise, return as-is (object)
    return val;
  },
  z.object({
    min_hours_before_trip: z.number().optional(),
    refund_tiers: z.array(CancellationRuleSchema).optional(),
  }).nullable()
);

// Schema for a single cancellation policy
const CancellationPolicySchema = z.object({
  id: z.string().uuid(),
  policy_type: z.string(), // Backend accepts any string, not just enum values
  name: z.string(),
  cancellation_rules: CancellationRulesSchema,
  template_id: z.string().uuid().nullable().optional(),
  is_custom: z.boolean().nullable().optional(),
  created_by: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Schema for the list response
const CancellationPolicyListResponseSchema = z.object({
  policies: z.array(CancellationPolicySchema),
  count: z.number(),
});

// Schema for a single template
const CancellationPolicyTemplateSchema = z.object({
  id: z.string().uuid(),
  policy_type: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  market_share_percentage: z.number().nullable().optional(),
  booking_window: z.number().nullable().optional(),
  popularity_score: z.number().nullable().optional(),
  cancellation_rules: CancellationRulesSchema.optional(),
  is_active: z.boolean().nullable().optional(),
  updated_at: z.string(),
});

// Schema for the templates list response
const CancellationPolicyTemplateListResponseSchema = z.object({
  templates: z.array(CancellationPolicyTemplateSchema),
  count: z.number(),
});

// Validation functions
export function validateCancellationPolicyListResponse(
  data: unknown
): CancellationPolicyListResponse {
  try {
    return CancellationPolicyListResponseSchema.parse(
      data
    ) as CancellationPolicyListResponse;
  } catch (error) {
    handleZodValidationError(error, "cancellation policies list");
  }
}

export function validateCancellationPolicy(data: unknown): CancellationPolicy {
  try {
    return CancellationPolicySchema.parse(data) as CancellationPolicy;
  } catch (error) {
    handleZodValidationError(error, "cancellation policy");
  }
}

export function validateCancellationPolicyTemplateListResponse(
  data: unknown
): CancellationPolicyTemplateListResponse {
  try {
    return CancellationPolicyTemplateListResponseSchema.parse(
      data
    ) as CancellationPolicyTemplateListResponse;
  } catch (error) {
    handleZodValidationError(error, "cancellation policy templates list");
  }
}

export function validateCancellationPolicyTemplate(
  data: unknown
): CancellationPolicyTemplate {
  try {
    return CancellationPolicyTemplateSchema.parse(
      data
    ) as CancellationPolicyTemplate;
  } catch (error) {
    handleZodValidationError(error, "cancellation policy template");
  }
}
