export type Advertising = {
  created_at: string;
  description?: string;
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  max_daily_km?: number;
  minimum_days: number;
  name: string;
  security_deposit_amount?: number;
  updated_at: string;
  vehicle_id: string;
  cancellation_policy_id?: string;
};

// ============================================================================
// Advertising Pricing Rules
// ============================================================================

export type PricingRule = {
  id: string;
  advertising_id: number;
  name?: string;
  start_month: number;
  start_day?: number;
  end_month: number;
  end_day?: number;
  price_per_day?: number;
  tier_pricing?: TierPricing;
  created_at: string;
  updated_at: string;
};

// TierPricing is an array of pricing tiers (matches backend LegacyTier format)
export type TierPricing = PricingTier[];

export type PricingTier = {
  min_days: number;
  max_days?: number | null;
  price_per_day: number;
};

// ============================================================================
// Advertising Extras
// ============================================================================

export type AdvertisingExtra = {
  id: string;
  advertising_id: number;
  name: string;
  description?: string;
  price_per_day: number;
  max_quantity?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// Advertising Offers
// ============================================================================

export type AdvertisingOffer = {
  id: string;
  advertising_id: number;
  name: string;
  description?: string;
  discount_percentage?: number;
  minimum_days?: number;
  valid_from: string;
  valid_until: string;
  is_active?: boolean;
  max_usage_count?: number;
  usage_count?: number;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// Update Advertising With Pricing (Transactional)
// ============================================================================

export type PricingRuleInput = {
  name: string;
  start_month: number;
  start_day?: number;
  end_month: number;
  end_day?: number;
  price_per_day: number;
  tier_pricing?: TierPricing;
};

export type ExtraInput = {
  name: string;
  description?: string;
  price_per_day: number;
  max_quantity?: number;
  is_active: boolean;
};

export type OfferInput = {
  name: string;
  description?: string;
  discount_percentage: number;
  minimum_days?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  max_usage_count?: number;
};

export type UpdateAdvertisingWithPricingRequest = {
  minimum_days: number;
  cancellation_policy_id?: string;
  max_daily_km?: number;
  security_deposit?: number;
  pricing_rules: PricingRuleInput[] | null;
  extras?: ExtraInput[] | null;
  offers?: OfferInput[] | null;
};

export type UpdateAdvertisingWithPricingResponse = {
  advertising_id: number;
  pricing_rules_created: number;
  extras_created: number;
  offers_created: number;
};


// ============================================================================
// Deactivate Advertising
// ============================================================================
export type ModifyAdvertisingRequest = {
  cancellation_policy_id?: string;
  description?: string;
  is_active: boolean;
  max_daily_km?: number;
  minimum_days?: number;
  name?: string;
  security_deposit_amount?: number;
}

export type ModifyAdvertisingResponse = {
  cancellation_policy_id?: string;
  created_at: string;
  description?: string;
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  max_daily_km?: number;
  minimum_days: number;
  name: string;
  security_deposit_amount?: number;
  updated_at: string;
  vehicle_id: string;
}