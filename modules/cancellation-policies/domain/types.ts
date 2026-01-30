// Cancellation Policy types

// A single cancellation rule tier
export interface CancellationRule {
  days_before: number;
  refund_percentage: number;
}

// The canonical cancellation rules payload used by the backend
export interface CancellationRulesPayload {
  min_hours_before_trip: number;
  refund_tiers: CancellationRule[];
}

export interface CancellationPolicy {
  id: string;
  policy_type: "flexible" | "moderate" | "strict" | "custom";
  name: string;
  cancellation_rules: CancellationRulesPayload | null;
  template_id: string | null;
  is_custom: boolean | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CancellationPolicyListResponse {
  policies: CancellationPolicy[];
  count: number;
}

export interface CancellationPolicyTemplate {
  id: string;
  policy_type: string;
  name: string;
  description: string | null;
  market_share_percentage: number | null;
  booking_window: number | null;
  popularity_score: number | null;
  cancellation_rules: CancellationRulesPayload | null;
  is_active: boolean | null;
  updated_at: string;
}

export interface CancellationPolicyTemplateListResponse {
  templates: CancellationPolicyTemplate[];
  count: number;
}

export interface CreateCancellationPolicyRequest {
  policy_type: string;
  name: string;
  cancellation_rules?: CancellationRulesPayload;
  template_id?: string;
  is_custom?: boolean;
}

export interface UpdateCancellationPolicyRequest {
  policy_type: string;
  name: string;
  cancellation_rules?: CancellationRulesPayload;
  template_id?: string;
  is_custom?: boolean;
}
