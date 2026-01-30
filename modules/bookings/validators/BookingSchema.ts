import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import {
  BookingRequest,
  BookingResponse,
  BookingStatusUpdateResult,
  QuoteRequest,
  QuoteResponse,
  DashboardBooking,
  DashboardBookingsData,
  UpdateBookingStatusResponse,
  PendingConfirmation,
  PendingConfirmationsData,
} from "../domain";

const BookingRequestSchema = z.object({
  advertising_id: z.number().int().positive(),
  dropoff_fee: z.number().positive().optional(),
  dropoff_location_id: z.string().optional(),
  end_date: z.string(),
  extras: z
    .array(
      z.object({
        advertising_extra_id: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .optional(),
  pickup_fee: z.number().positive().optional(),
  pickup_location_id: z.string().optional(),
  special_requests: z.string().optional(),
  start_date: z.string(),
});

const BookingResponseSchema = z.object({
  advertising_id: z.number().positive(),
  booking_number: z.string(),
  created_at: z.string().optional(),
  discount_amount: z.number().nonnegative().optional(),
  discount_code: z.string().optional(),
  dropoff_fee: z
    .number()
    .nonnegative()
    .nullable()
    .transform((val) => val ?? 0),
  dropoff_location_id: z.string(),
  end_date: z.string(),
  id: z.string(),
  internal_notes: z.string().optional(),
  metadata: z.unknown().optional(),
  origin: z.string(),
  pickup_fee: z
    .number()
    .nonnegative()
    .nullable()
    .transform((val) => val ?? 0),
  pickup_location_id: z.string(),
  special_requests: z.string().optional(),
  start_date: z.string(),
  subtotal: z.number().nonnegative(),
  tax_amount: z
    .union([z.number().nonnegative(), z.null(), z.undefined()])
    .optional()
    .transform((val) => val ?? 0),
  total_days: z.number().int().positive(),
  total_price: z.number().nonnegative(),
  updated_at: z.string().optional(),
  user_id: z.string(),
});

const QuoteRequestSchema = z.object({
  advertising_id: z.number().int().positive(),
  end_date: z.string(),
  extras: z
    .array(
      z.object({
        advertising_extra_id: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .optional(),
  start_date: z.string(),
});

const QuoteResponseSchema = z.object({
  all_discounts: z.array(
    z.object({
      amount_saved: z.number().nonnegative(),
      description: z.string(),
      id: z.string().optional(),
      name: z.string(),
      percentage: z.number().nonnegative().optional(),
      type: z.string(),
    }),
  ),
  applied_offer: z
    .object({
      amount_saved: z.number().nonnegative(),
      description: z.string(),
      id: z.string().optional(),
      name: z.string(),
      percentage: z.number().nonnegative().optional(),
      type: z.string(),
    })
    .optional(),
  average_daily_rate: z.number().nonnegative(),
  calculated_at: z.string(),
  currency: z.string(),
  daily_prices: z.array(
    z.object({
      base_price: z.number().nonnegative(),
      date: z.string(),
      effective_price: z.number().nonnegative(),
      rule_id: z.string().optional(),
      rule_name: z.string(),
      tier_applied: z
        .object({
          label: z.string(),
          min_days: z.number().int().positive(),
          price_per_day: z.number().nonnegative(),
        })
        .optional(),
      tier_savings: z.number().nonnegative(),
    }),
  ),
  end_date: z.string(),
  evaluated_offers: z.array(
    z.object({
      description: z.string(),
      discount_percentage: z.number().nonnegative(),
      ineligible_reason: z.string().optional(),
      is_eligible: z.boolean(),
      name: z.string(),
      offer_id: z.string(),
      potential_savings: z.number().nonnegative(),
      was_applied: z.boolean(),
    }),
  ),
  extras: z.array(
    z.object({
      days: z.number().int().nonnegative(),
      extra_id: z.string(),
      name: z.string(),
      price_per_day: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      total: z.number().nonnegative(),
    }),
  ),
  extras_total: z.number().nonnegative(),
  fee_amount: z.number().nonnegative(),
  gross_base_price: z.number().nonnegative(),
  max_daily_rate: z.number().nonnegative(),
  min_daily_rate: z.number().nonnegative(),
  net_base_price: z.number().nonnegative(),
  offer_savings: z.number().nonnegative(),
  season_breakdown: z
    .array(
      z.object({
        base_price_per_day: z.number().nonnegative(),
        date_range: z.string(),
        days: z.number().int().positive(),
        gross_subtotal: z.number().nonnegative(),
        net_subtotal: z.number().nonnegative(),
        rule_id: z.string().optional(),
        rule_name: z.string(),
        savings: z.number().nonnegative(),
        tier_label: z.string().optional(),
        tier_price_per_day: z.number().nonnegative().optional(),
      }),
    )
    .optional(),
  start_date: z.string(),
  subtotal: z.number().nonnegative(),
  tax_amount: z.number().nonnegative(),
  tier_savings: z.number().nonnegative(),
  total_days: z.number().int().positive(),
  total_price: z.number().nonnegative(),
  total_savings: z.number().nonnegative(),
});

export function validateBookingRequestHandled(data: unknown): BookingRequest {
  try {
    return BookingRequestSchema.parse(data) as BookingRequest;
  } catch (error) {
    handleZodValidationError(error, "booking");
  }
}

export function validateBookingResponseHandled(data: unknown): BookingResponse {
  try {
    return BookingResponseSchema.parse(data) as BookingResponse;
  } catch (error) {
    handleZodValidationError(error, "booking");
  }
}

export function validateQuoteRequestHandled(data: unknown): QuoteRequest {
  try {
    return QuoteRequestSchema.parse(data) as QuoteRequest;
  } catch (error) {
    handleZodValidationError(error, "quote");
  }
}

export function validateQuoteResponseHandled(data: unknown): QuoteResponse {
  try {
    return QuoteResponseSchema.parse(data) as QuoteResponse;
  } catch (error) {
    handleZodValidationError(error, "quote");
  }
}

// ============================================================================
// Dashboard Schemas (Enriched booking data for owner/admin)
// ============================================================================

const BookingStatusSchema = z.enum([
  // Payment flow
  "pending_payment",
  "payment_processing",
  "payment_failed",
  "paid",
  // Confirmation flow
  "pending_confirmation",
  "confirmed",
  // Deposit flow
  "deposit_pending",
  "deposit_paid",
  // Trip flow
  "active",
  "completed",
  // Cancellation flow
  "cancellation_requested",
  "cancelled_by_traveler",
  "cancelled_by_owner",
  "cancelled_by_system",
  // Refund flow
  "refund_pending",
  "refund_partial",
  "refunded",
  // Legacy/mapped statuses (for backward compatibility)
  "pending",
  "scheduled",
  "in_progress",
  "cancelled",
]);

const BookingStatusRecordSchema = z.object({
  id: z.string(),
  status: BookingStatusSchema,
  timestamp: z.string(),
});

const DashboardBookingCamperSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(z.string()).default([]),
  type: z.string(),
  license_plate: z.string().optional(),
});

const DashboardBookingTravelerSchema = z.object({
  id: z.string(),
  email: z.string(),
});

const DashboardBookingAdvertisingSchema = z.object({
  id: z.number(),
  minimum_days: z.number(),
});

const OwnerReviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  created_at: z.string(),
});

const TravelerReviewSchema = z.object({
  id: z.string(),
  owner_rating: z.number(),
  owner_comment: z.string(),
  camper_rating: z.number(),
  camper_comment: z.string(),
  created_at: z.string(),
});

const InspectionPhotoSchema = z.object({
  id: z.string(),
  photo_position: z.string(),
  storage_url: z.string(),
  uploaded_at: z.string(),
});

const InspectionSummarySchema = z.object({
  id: z.string(),
  inspection_type: z.enum(["check_out", "check_in"]),
  completed_at: z.string().nullable(),
  photo_count: z.number(),
  photos: z.array(InspectionPhotoSchema),
});

const TripOperationalStatusSchema = z.enum([
  "scheduled",
  "ready_for_pickup",
  "in_progress",
  "returning",
  "completed",
  "cancelled_before_start",
  "cancelled_during_trip",
  "aborted",
]);

const DashboardBookingSchema = z.object({
  id: z.string(),
  booking_number: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  total_price: z.number(),
  created_at: z.string(),
  status: BookingStatusSchema,
  statuses: z.array(BookingStatusRecordSchema),
  trip_id: z.string().optional(),
  trip_operational_status: TripOperationalStatusSchema.optional(),
  start_km: z.number().nullable().optional(),
  end_km: z.number().nullable().optional(),
  total_km: z.number().nullable().optional(),
  camper: DashboardBookingCamperSchema,
  traveler: DashboardBookingTravelerSchema,
  advertising: DashboardBookingAdvertisingSchema,
  owner_review: OwnerReviewSchema.nullable(),
  traveler_review: TravelerReviewSchema.nullable(),
  can_review: z.boolean(),
  inspection: InspectionSummarySchema.nullable().optional(),
});

const DashboardBookingsDataSchema = z.object({
  bookings: z.array(DashboardBookingSchema),
  count: z.number(),
});

const UpdateBookingStatusResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  booking: DashboardBookingSchema.optional(),
});

export function validateDashboardBookingsDataHandled(
  data: unknown
): DashboardBookingsData {
  try {
    return DashboardBookingsDataSchema.parse(data) as DashboardBookingsData;
  } catch (error) {
    handleZodValidationError(error, "dashboard_bookings");
  }
}

export function validateUpdateBookingStatusResponseHandled(
  data: unknown
): UpdateBookingStatusResponse {
  try {
    return UpdateBookingStatusResponseSchema.parse(
      data
    ) as UpdateBookingStatusResponse;
  } catch (error) {
    handleZodValidationError(error, "booking_status_update");
  }
}

// ============================================================================
// Pending Confirmations Schemas (Bookings awaiting owner confirmation)
// ============================================================================

const PendingConfirmationSchema = z.object({
  booking_id: z.string(),
  traveler_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  total_price: z.number(),
  created_at: z.string(),
  camper_id: z.string(),
  camper_name: z.string(),
  advertising_name: z.string(),
  default_security_deposit: z.number(),
  status_timestamp: z.string(),
  // Traveler profile info
  traveler_full_name: z.string(),
  traveler_nationality: z.string(),
  traveler_languages: z.array(z.string()).nullable().default([]),
  // Location info
  location_name: z.string(),
  location_city: z.string(),
  location_state: z.string(),
  location_country: z.string(),
});

const PendingConfirmationsDataSchema = z.object({
  confirmations: z.array(PendingConfirmationSchema),
});

export function validatePendingConfirmationsDataHandled(
  data: unknown
): PendingConfirmationsData {
  try {
    return PendingConfirmationsDataSchema.parse(data) as PendingConfirmationsData;
  } catch (error) {
    handleZodValidationError(error, "pending_confirmations");
  }
}

// ============================================================================
// Booking Status Update Result Schema (Confirm/Reject)
// ============================================================================

const BookingStatusUpdateResultSchema = z.object({
  booking_id: z.string(),
  from_status: z.string(),
  new_status: z.string(),
  message: z.string(),
});

export function validateBookingStatusUpdateResultHandled(
  data: unknown
): BookingStatusUpdateResult {
  try {
    return BookingStatusUpdateResultSchema.parse(data) as BookingStatusUpdateResult;
  } catch (error) {
    handleZodValidationError(error, "booking_status_update_result");
  }
}
