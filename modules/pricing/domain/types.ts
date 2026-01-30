export type ActiveOffer = {
  description: string;
  discount_percentage: number;
  id: string;
  minimum_days: number;
  name: string;
  valid_from: string;
  valid_until: string;
};

export type Extra = {
  description: string;
  id: string;
  max_quantity: number;
  name: string;
  price_per_day: number;
};

export type PricingRule = {
  end_day?: number;
  end_month: number;
  id: string;
  price_per_day: number;
  start_day?: number;
  start_month: number;
  tier_pricing?: unknown;
  name?: string;
};

export type PricingStrategy =
  | "flat_rate"
  | "flat_rate_with_tiers"
  | "seasonal_flat_rate"
  | "seasonal"
  | null;

export type ExtraBreakdown = {
  extra_id: string;
  name: string;
  quantity: number;
  price_per_day: number;
  total: number;
};

export type PricingInfo = {
  base_price: number;
  discounted_price: number;
  total_discount_amount: number;
  best_discount_percentage: number;
  applied_offer_name?: string;
  extras_total?: number;
  extras_breakdown?: ExtraBreakdown[];
  final_total?: number;
  /** Subtotal before tax (base price + extras - discounts) */
  subtotal?: number;
  /** Tax amount (19% of subtotal) */
  tax_amount?: number;
};
