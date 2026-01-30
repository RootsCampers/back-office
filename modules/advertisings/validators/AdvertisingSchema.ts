import { z } from "zod";
import {
  Advertising,
  PricingRule,
  AdvertisingExtra,
  AdvertisingOffer,
  UpdateAdvertisingWithPricingResponse,
  UpdateAdvertisingWithPricingRequest,
  ModifyAdvertisingRequest,
  ModifyAdvertisingResponse,
} from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

const AdvertisingSchema = z.object({
  created_at: z.string(),
  description: z.string().optional().nullable(),
  id: z.number().int().positive(),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  max_daily_km: z.number().int().positive().optional().nullable(),
  minimum_days: z.number().int().positive(),
  name: z.string(),
  security_deposit_amount: z.number().positive().optional().nullable(),
  updated_at: z.string(),
  vehicle_id: z.string(),
  cancellation_policy_id: z.string().uuid().optional().nullable(),
});

export function validateAdvertisingResponseHandled(data: unknown): Advertising {
  try {
    return AdvertisingSchema.parse(data) as Advertising;
  } catch (error) {
    handleZodValidationError(error, "advertising");
  }
}

// ============================================================================
// Pricing Rules Schema
// ============================================================================

const PricingTierSchema = z.object({
  min_days: z.number().int().positive(),
  max_days: z.number().int().positive().nullable().optional(),
  price_per_day: z.number().nonnegative(),
});

// TierPricing is returned as a raw array of tiers from the backend
const TierPricingSchema = z.array(PricingTierSchema);

const PricingRuleSchema = z.object({
  id: z.string().uuid(),
  advertising_id: z.number().int().positive(),
  name: z.string().optional().nullable(),
  start_month: z.number().int().min(1).max(12),
  start_day: z.number().int().min(1).max(31).optional().nullable(),
  end_month: z.number().int().min(1).max(12),
  end_day: z.number().int().min(1).max(31).optional().nullable(),
  price_per_day: z.number().nonnegative().optional().nullable(),
  tier_pricing: TierPricingSchema.optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export function validatePricingRuleResponseHandled(data: unknown): PricingRule {
  try {
    return PricingRuleSchema.parse(data) as PricingRule;
  } catch (error) {
    handleZodValidationError(error, "pricing_rule");
  }
}

// List response schema (backend returns paginated wrapper)
const PricingRulesListResponseSchema = z.object({
  pricing_rules: z.array(PricingRuleSchema),
  page_size: z.number().int().nonnegative(),
  total_count: z.number().int().nonnegative(),
});

export function validatePricingRulesArrayResponseHandled(
  data: unknown
): PricingRule[] {
  try {
    const response = PricingRulesListResponseSchema.parse(data);
    return response.pricing_rules as PricingRule[];
  } catch (error) {
    handleZodValidationError(error, "pricing_rules");
  }
}

// ============================================================================
// Advertising Extras Schema
// ============================================================================

const AdvertisingExtraSchema = z.object({
  id: z.string().uuid(),
  advertising_id: z.number().int().positive(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price_per_day: z.number().nonnegative(),
  max_quantity: z.number().int().positive().optional().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export function validateAdvertisingExtraResponseHandled(
  data: unknown
): AdvertisingExtra {
  try {
    return AdvertisingExtraSchema.parse(data) as AdvertisingExtra;
  } catch (error) {
    handleZodValidationError(error, "advertising_extra");
  }
}

// List response schema (backend returns paginated wrapper)
const AdvertisingExtrasListResponseSchema = z.object({
  extras: z.array(AdvertisingExtraSchema),
  page_size: z.number().int().nonnegative(),
  total_count: z.number().int().nonnegative(),
});

export function validateAdvertisingExtrasArrayResponseHandled(
  data: unknown
): AdvertisingExtra[] {
  try {
    const response = AdvertisingExtrasListResponseSchema.parse(data);
    return response.extras as AdvertisingExtra[];
  } catch (error) {
    handleZodValidationError(error, "advertising_extras");
  }
}

// ============================================================================
// Advertising Offers Schema
// ============================================================================

const AdvertisingOfferSchema = z.object({
  id: z.string().uuid(),
  advertising_id: z.number().int().positive(),
  name: z.string(),
  description: z.string().optional().nullable(),
  discount_percentage: z.number().min(0).max(100).optional().nullable(),
  minimum_days: z.number().int().positive().optional().nullable(),
  valid_from: z.string(),
  valid_until: z.string(),
  is_active: z.boolean().optional().nullable(),
  max_usage_count: z.number().int().positive().optional().nullable(),
  usage_count: z.number().int().nonnegative().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export function validateAdvertisingOfferResponseHandled(
  data: unknown
): AdvertisingOffer {
  try {
    return AdvertisingOfferSchema.parse(data) as AdvertisingOffer;
  } catch (error) {
    handleZodValidationError(error, "advertising_offer");
  }
}

// List response schema (backend returns paginated wrapper)
const AdvertisingOffersListResponseSchema = z.object({
  offers: z.array(AdvertisingOfferSchema),
  page_size: z.number().int().nonnegative(),
  total_count: z.number().int().nonnegative(),
});

export function validateAdvertisingOffersArrayResponseHandled(
  data: unknown
): AdvertisingOffer[] {
  try {
    const response = AdvertisingOffersListResponseSchema.parse(data);
    return response.offers as AdvertisingOffer[];
  } catch (error) {
    handleZodValidationError(error, "advertising_offers");
  }
}

// ============================================================================
// Update Advertising With Pricing RequestSchema
// ============================================================================

const UpdateAdvertisingWithPricingRequestSchema = z.object({
  minimum_days: z.number().int().positive(),
  cancellation_policy_id: z.string().uuid().optional().nullable(),
  max_daily_km: z.number().int().positive().optional().nullable(),
  security_deposit: z.number().positive().optional().nullable(),
  pricing_rules: z.array(
    z.object({
      name: z.string(),
      start_month: z.number().int().min(1).max(12),
      start_day: z.number().int().min(1).max(31).optional().nullable(),
      end_month: z.number().int().min(1).max(12),
      end_day: z.number().int().min(1).max(31).optional().nullable(),
      price_per_day: z.number().nonnegative(),
      tier_pricing: TierPricingSchema.optional().nullable(),
    })
  ).optional().nullable(),
  extras: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      price_per_day: z.number().nonnegative(),
      max_quantity: z.number().int().positive().optional().nullable(),
      is_active: z.boolean(),
    })
  ).optional().nullable(),
  offers: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      discount_percentage: z.number().min(0).max(100).optional().nullable(),
      minimum_days: z.number().int().positive().optional().nullable(),
      valid_from: z.string(),
      valid_until: z.string(),
      is_active: z.boolean(),
      max_usage_count: z.number().int().positive().optional().nullable(),
    })
  ).optional().nullable(),
});

export function validateUpdateAdvertisingWithPricingRequestHandled(
  data: unknown
): UpdateAdvertisingWithPricingRequest {
  try {
    return UpdateAdvertisingWithPricingRequestSchema.parse(data) as UpdateAdvertisingWithPricingRequest;
  } catch (error) {
    handleZodValidationError(error, "update_advertising_with_pricing_request");
  }
}


// ============================================================================
// Update Advertising With Pricing Response Schema
// ============================================================================

const UpdateAdvertisingWithPricingResponseSchema = z.object({
  advertising_id: z.number().int().positive(),
  pricing_rules_created: z.number().int().nonnegative(),
  extras_created: z.number().int().nonnegative(),
  offers_created: z.number().int().nonnegative(),
});

export function validateUpdateAdvertisingWithPricingResponseHandled(
  data: unknown
): UpdateAdvertisingWithPricingResponse {
  try {
    return UpdateAdvertisingWithPricingResponseSchema.parse(
      data
    ) as UpdateAdvertisingWithPricingResponse;
  } catch (error) {
    handleZodValidationError(error, "update_advertising_with_pricing_response");
  }
}


// ============================================================================
// Change Active Status of Advertising Request Schema
// ============================================================================

const ModifyAdvertisingRequestSchema = z.object({
  cancellation_policy_id: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.boolean(),
  max_daily_km: z.number().int().positive().optional().nullable(),
  minimum_days: z.number().int().positive().optional().nullable(),
  name: z.string().optional().nullable(),
  security_deposit_amount: z.number().positive().optional().nullable(),
});


export function validateModifyAdvertisingRequestHandled(
  data: unknown
): ModifyAdvertisingRequest {
  try {
    return ModifyAdvertisingRequestSchema.parse(data) as ModifyAdvertisingRequest;
  } catch (error) {
    handleZodValidationError(error, "modify_advertising_request");
  }
}

const ModifyAdvertisingResponseSchema = z.object({
  cancellation_policy_id: z.string().optional().nullable(),
  created_at: z.string(),
  description: z.string().optional().nullable(),
  id: z.number().int().positive(),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  max_daily_km: z.number().int().positive().optional().nullable(),
  minimum_days: z.number().int().positive(),
  name: z.string().optional().nullable(),
  security_deposit_amount: z.number().positive().optional().nullable(),
  updated_at: z.string(),
  vehicle_id: z.string(),
});

export function validateModifyAdvertisingResponseHandled(
  data: unknown
): ModifyAdvertisingResponse {
  try {
    return ModifyAdvertisingResponseSchema.parse(data) as ModifyAdvertisingResponse;
  } catch (error) {
    handleZodValidationError(error, "modify_advertising_response");
  }
}