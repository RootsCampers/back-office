import {
  UserBookingStatus,
  RVType,
  TripOperationalStatus,
} from "@/modules/shared/domain/types";

export type ExtraBooking = {
  advertising_extra_id: string;
  quantity: number;
};

export type BookingRequest = {
  advertising_id: number;
  dropoff_fee?: number;
  dropoff_location_id?: string;
  end_date: string;
  extras?: ExtraBooking[];
  pickup_fee?: number;
  pickup_location_id?: string;
  special_requests?: string;
  start_date: string;
};

export type BookingResponse = {
  advertising_id: number;
  booking_number: string;
  created_at?: string;
  discount_amount?: number;
  discount_code?: string;
  dropoff_fee: number;
  dropoff_location_id: string;
  end_date: string;
  id: string;
  internal_notes?: string;
  metadata?: unknown;
  origin: string;
  pickup_fee: number;
  pickup_location_id: string;
  special_requests?: string;
  start_date: string;
  subtotal: number;
  tax_amount?: number;
  total_days: number;
  total_price: number;
  updated_at?: string;
  user_id: string;
};

export type BookingsData = {
  bookings: BookingResponse[];
  total: number;
};

export type QuoteRequest = {
  advertising_id: number;
  end_date: string;
  extras?: ExtraBooking[];
  start_date: string;
};

// ============================================================================
// Dashboard Types (Enriched booking data for owner/admin dashboard)
// ============================================================================

/**
 * Booking status values
 * Matches bookings.booking_status enum in database
 */
export type BookingStatus =
  // Payment flow
  | "pending_payment"
  | "payment_processing"
  | "payment_failed"
  | "paid"
  // Confirmation flow
  | "pending_confirmation"
  | "confirmed"
  // Deposit flow
  | "deposit_pending"
  | "deposit_paid"
  // Trip flow
  | "active"
  | "completed"
  // Cancellation flow
  | "cancellation_requested"
  | "cancelled_by_traveler"
  | "cancelled_by_owner"
  | "cancelled_by_system"
  // Refund flow
  | "refund_pending"
  | "refund_partial"
  | "refunded"
  // Legacy/mapped statuses (for backward compatibility)
  | "pending"
  | "scheduled"
  | "in_progress"
  | "cancelled";

/**
 * Status history entry
 */
export type BookingStatusRecord = {
  id: string;
  status: BookingStatus;
  timestamp: string;
};

/**
 * Camper info nested in dashboard booking
 */
export type DashboardBookingCamper = {
  id: string;
  name: string;
  images: string[];
  type: string;
  license_plate?: string;
};

/**
 * Traveler info nested in dashboard booking
 */
export type DashboardBookingTraveler = {
  id: string;
  email: string;
};

/**
 * Advertising info nested in dashboard booking
 */
export type DashboardBookingAdvertising = {
  id: number;
  minimum_days: number;
};

/**
 * Owner's review of the traveler
 */
export type OwnerReview = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
};

/**
 * Traveler's review (of both owner and camper)
 */
export type TravelerReview = {
  id: string;
  owner_rating: number;
  owner_comment: string;
  camper_rating: number;
  camper_comment: string;
  created_at: string;
};

/**
 * Inspection photo
 */
export type InspectionPhoto = {
  id: string;
  photo_position: string;
  storage_url: string;
  uploaded_at: string;
};

/**
 * Inspection summary
 */
export type InspectionSummary = {
  id: string;
  inspection_type: "check_out" | "check_in";
  completed_at: string | null;
  photo_count: number;
  photos: InspectionPhoto[];
};

/**
 * Enriched booking for owner/admin dashboard
 * Contains all related data (camper, traveler, statuses, reviews, etc.)
 */
export type DashboardBooking = {
  // Core booking fields
  id: string;
  booking_number: string;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string;

  // Current status (convenience field)
  status: BookingStatus;

  // Status history
  statuses: BookingStatusRecord[];

  // Trip operational status (from trips.trip_status_history)
  trip_id?: string;

  trip_operational_status?: TripOperationalStatus | string;

  // Operational data (km tracking)
  start_km?: number | null;
  end_km?: number | null;
  total_km?: number | null;

  // Related entities (joined)
  camper: DashboardBookingCamper;
  traveler: DashboardBookingTraveler;
  advertising: DashboardBookingAdvertising;

  // Reviews
  owner_review: OwnerReview | null;
  traveler_review: TravelerReview | null;
  can_review: boolean;

  // Inspection (optional)
  inspection?: InspectionSummary | null;
};

/**
 * Response from GET /api/bookings/dashboard
 */
export type DashboardBookingsData = {
  bookings: DashboardBooking[];
  count: number;
};

/**
 * Request body for PATCH /api/bookings/{id} (status update)
 */
export type UpdateBookingStatusRequest = {
  status: BookingStatus;
  km_reading?: number;
};

/**
 * Response from PATCH /api/bookings/{id}
 */
export type UpdateBookingStatusResponse = {
  success: boolean;
  message: string;
  booking?: DashboardBooking;
};

// ============================================================================
// Pending Confirmations Types (Bookings awaiting owner confirmation)
// ============================================================================

/**
 * Pending confirmation booking (status = 'paid', awaiting owner confirmation)
 */
export type PendingConfirmation = {
  booking_id: string;
  traveler_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string;
  camper_id: string;
  camper_name: string;
  advertising_name: string;
  default_security_deposit: number;
  status_timestamp: string;
  // Traveler profile info
  traveler_full_name: string;
  traveler_nationality: string;
  traveler_languages: string[];
  // Location info
  location_name: string;
  location_city: string;
  location_state: string;
  location_country: string;
};

/**
 * Response from GET /api/bookings/pending-confirmations
 */
export type PendingConfirmationsData = {
  confirmations: PendingConfirmation[];
};

// ============================================================================
// Booking Confirmation Types (Owner actions: confirm/reject)
// ============================================================================

/**
 * Request body for POST /api/bookings/{id}/reject
 */
export type RejectBookingRequest = {
  reason?: string;
};

/**
 * Response from POST /api/bookings/{id}/confirm or /reject
 */
export type BookingStatusUpdateResult = {
  booking_id: string;
  from_status: string;
  new_status: string;
  message: string;
};

// ============================================================================
// Quote Types
// ============================================================================

export type QuoteResponse = {
  all_discounts: {
    amount_saved: number;
    description: string;
    id?: string;
    name: string;
    percentage?: number;
    type: string;
  }[];
  applied_offer?: {
    amount_saved: number;
    description: string;
    id?: string;
    name: string;
    percentage?: number;
    type: string;
  };
  average_daily_rate: number;
  calculated_at: string;
  currency: string;
  daily_prices: {
    base_price: number;
    date: string;
    effective_price: number;
    rule_id?: string;
    rule_name: string;
    tier_applied?: {
      label: string;
      min_days: number;
      price_per_day: number;
    };
    tier_savings: number;
  }[];
  end_date: string;
  evaluated_offers: {
    description: string;
    discount_percentage: number;
    ineligible_reason?: string;
    is_eligible: boolean;
    name: string;
    offer_id: string;
    potential_savings: number;
    was_applied: boolean;
  }[];
  extras: {
    days: number;
    extra_id: string;
    name: string;
    price_per_day: number;
    quantity: number;
    total: number;
  }[];
  extras_total: number;
  fee_amount: number;
  gross_base_price: number;
  max_daily_rate: number;
  min_daily_rate: number;
  net_base_price: number;
  offer_savings: number;
  season_breakdown?: {
    base_price_per_day: number;
    date_range: string;
    days: number;
    gross_subtotal: number;
    net_subtotal: number;
    rule_id?: string;
    rule_name: string;
    savings: number;
    tier_label?: string;
    tier_price_per_day?: number;
  }[];
  start_date: string;
  subtotal: number;
  tax_amount: number;
  tier_savings: number;
  total_days: number;
  total_price: number;
  total_savings: number;
};

export type UserBooking = {
  booking_number: string;
  can_review: boolean;
  created_at: string;
  current_status: UserBookingStatus;
  end_date: string;
  id: string;
  owner: {
    id: string;
    name: string;
  };
  owner_review?: {
    comment?: string;
    created_at: string;
    id: string;
    rating: number;
  };
  start_date: string;
  statuses: {
    changed_by?: string;
    from_status?: UserBookingStatus;
    id: string;
    reason?: string;
    timestamp: string;
    to_status: UserBookingStatus;
  }[];
  total_price: number;
  traveler_review?: {
    camper_comment?: string;
    camper_rating: number;
    created_at: string;
    id: string;
    owner_comment?: string;
    owner_rating: number;
  } | null;
  vehicle: {
    id: string;
    images: string[] | null;
    name: string;
    type: string;
  };
};

export type UserBookingsData = {
  bookings: UserBooking[];
  total: number;
};

export type UserBookingParams = {
  limit: number;
  offset: number;
};

export type UserBookingPricingRule = {
  advertising_id: number;
  end_day?: number | null;
  end_month: number;
  id: string;
  price_per_day: number;
  start_day?: number | null;
  start_month: number;
  tier_pricing?: unknown | null;
};

export type UserBookingDetails = {
  advertising: {
    cancellation_policy?: {
      cancellation_rules: unknown;
      id: string;
      name: string;
      policy_type: string;
    };
    id: number;
    max_daily_km?: number;
    minimum_days: number;
    pricing_rules: UserBookingPricingRule[];
    security_deposit_amount?: number;
  };
  booking_number: string;
  can_review: boolean;
  cancellation?: {
    cancellation_deadline?: string;
    eligible: boolean;
    eligible_until?: string;
    reason: string;
    refund_amount?: number;
    refund_percentage?: number;
  };
  created_at: string;
  current_status: UserBookingStatus;
  discount_amount?: number;
  discount_code?: string;
  dropoff_fee: number;
  dropoff_location: {
    contact_name?: string;
    contact_phone?: string;
    formatted_address: string;
    id: string;
    instructions?: string;
    latitude: number;
    longitude: number;
    name: string;
  };
  end_date: string;
  extras: {
    id: string;
    booking_id: string;
    advertising_extra_id?: string;
    quantity: number;
    total_price: number;
    extra_name: string;
    extra_description?: string;
    extra_price_per_day?: number;
  }[];
  id: string;
  instructional_videos: {
    id: string;
    vehicle_id: string;
    title: string;
    youtube_url: string;
    description: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at?: string | undefined;
    created_by?: string | undefined;
  }[];
  owner: {
    admin_user_id?: string;
    organization_email?: string;
    organization_id: string;
    organization_name: string;
  };
  owner_review?: {
    comment?: string;
    created_at: string;
    id: string;
    rating: number;
  };
  pickup_fee: number;
  pickup_location: {
    contact_name?: string;
    contact_phone?: string;
    description?: string;
    formatted_address: string;
    id: string;
    instructions?: string;
    latitude: number;
    longitude: number;
    name: string;
  };
  special_requests?: string;
  start_date: string;
  status_history: {
    booking_id: string;
    changed_by: string | null;
    created_at: string;
    from_status: UserBookingStatus | null;
    id: string;
    reason: string;
    to_status: UserBookingStatus;
  }[];
  subtotal: number;
  tax_amount: number;
  total_days: number;
  total_price: number;
  traveler_review?: {
    camper_comment?: string;
    camper_rating: number;
    created_at: string;
    id: string;
    owner_comment?: string;
    owner_rating: number;
  };
  trip?: {
    actual_dropoff_at?: string;
    actual_pickup_at?: string;
    dropoff_notes?: string;
    end_fuel_level?: number;
    end_km?: number;
    operational_status: TripOperationalStatus;
    pickup_notes?: string;
    start_fuel_level?: number;
    start_km?: number;
    trip_id: string;
  };
  vehicle: {
    amenities: string[] | null;
    description?: string;
    id: string;
    images: string[] | null;
    length?: number;
    license_plate?: string;
    manufacturer?: string;
    model?: string;
    name: string;
    passengers: number;
    preparation_days: number;
    type: RVType;
    year?: number;
  };
};
