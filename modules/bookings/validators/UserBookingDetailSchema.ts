import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { UserBookingDetails } from "../domain";
import { RVType, UserBookingStatus } from "@/modules/shared/domain/types";

const UserBookingDetailsSchema = z.object({
  advertising: z.object({
    cancellation_policy: z
      .object({
        cancellation_rules: z.unknown(),
        id: z.string(),
        name: z.string(),
        policy_type: z.string(),
      })
      .optional(),
    id: z.number().int().positive(),
    max_daily_km: z.number().int().positive().optional(),
    minimum_days: z.number().int().positive(),
    pricing_rules: z.array(
      z.object({
        advertising_id: z.number().int().positive(),
        end_day: z.number().int().positive().nullable().optional(),
        end_month: z.number().int().positive(),
        id: z.string(),
        price_per_day: z.number().positive(),
        start_day: z.number().int().positive().nullable().optional(),
        start_month: z.number().int().positive(),
        tier_pricing: z.unknown().nullable().optional(),
      }),
    ),
    security_deposit_amount: z.number().nonnegative().optional(),
  }),
  booking_number: z.string(),
  can_review: z.boolean(),
  cancellation: z
    .object({
      cancellation_deadline: z.string().optional(),
      eligible: z.boolean(),
      eligible_until: z.string().optional(),
      reason: z.string(),
      refund_amount: z.number().nonnegative().optional(),
      refund_percentage: z.number().nonnegative().optional(),
    })
    .optional(),
  created_at: z.string(),
  current_status: z.string(),
  discount_amount: z.number().nonnegative().optional(),
  discount_code: z.string().optional(),
  dropoff_fee: z.number().nonnegative(),
  dropoff_location: z.object({
    contact_name: z.string().optional(),
    contact_phone: z.string().optional(),
    formatted_address: z.string(),
    id: z.string(),
    instructions: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    name: z.string(),
  }),
  end_date: z.string(),
  extras: z.array(
    z.object({
      id: z.string(),
      booking_id: z.string(),
      advertising_extra_id: z.string().optional(),
      quantity: z.number().int().positive(),
      total_price: z.number().nonnegative(),
      extra_name: z.string(),
      extra_description: z.string().nullable().optional(),
      extra_price_per_day: z.number().nonnegative().optional(),
    }),
  ),
  id: z.string(),
  instructional_videos: z.array(
    z.object({
      id: z.string(),
      vehicle_id: z.string(),
      title: z.string(),
      youtube_url: z.string(),
      description: z.string().nullable(),
      display_order: z.number().int().nonnegative(),
      is_active: z.boolean(),
      created_at: z.string(),
      updated_at: z.string().optional(),
      created_by: z.string().optional(),
    }),
  ),
  owner: z.object({
    admin_user_id: z.string().optional(),
    organization_email: z.string().email().optional(),
    organization_id: z.string(),
    organization_name: z.string(),
  }),
  owner_review: z
    .object({
      comment: z.string().optional(),
      created_at: z.string(),
      id: z.string(),
      rating: z.number().nonnegative(),
    })
    .optional(),
  pickup_fee: z.number().nonnegative(),
  pickup_location: z.object({
    contact_name: z.string().optional(),
    contact_phone: z.string().optional(),
    description: z.string().optional(),
    formatted_address: z.string(),
    id: z.string(),
    instructions: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    name: z.string(),
  }),
  special_requests: z.string().optional(),
  start_date: z.string(),
  status_history: z.array(
    z.object({
      booking_id: z.string(),
      changed_by: z.string().nullable(),
      created_at: z.string(),
      from_status: z.nativeEnum(UserBookingStatus).nullable(),
      id: z.string(),
      reason: z.string().nullable(),
      to_status: z.nativeEnum(UserBookingStatus),
    }),
  ),
  subtotal: z.number().nonnegative(),
  tax_amount: z.number().nonnegative(),
  total_days: z.number().int().positive(),
  total_price: z.number().nonnegative(),
  traveler_review: z
    .object({
      camper_comment: z.string().optional(),
      camper_rating: z.number().nonnegative(),
      created_at: z.string(),
      id: z.string(),
      owner_comment: z.string().optional(),
      owner_rating: z.number().nonnegative(),
    })
    .nullable()
    .optional(),
  trip: z
    .object({
      actual_dropoff_at: z.string().optional(),
      actual_pickup_at: z.string().optional(),
      dropoff_notes: z.string().optional(),
      end_fuel_level: z.number().nonnegative().optional(),
      end_km: z.number().int().nonnegative().optional(),
      operational_status: z.string(),
      pickup_notes: z.string().optional(),
      start_fuel_level: z.number().nonnegative().optional(),
      start_km: z.number().int().nonnegative().optional(),
      trip_id: z.string(),
    })
    .optional(),
  vehicle: z.object({
    amenities: z.array(z.string()).nullable(),
    description: z.string().optional(),
    id: z.string(),
    images: z.array(z.string()).nullable(),
    length: z.number().nonnegative().optional(),
    license_plate: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    name: z.string(),
    passengers: z.number().int().nonnegative(),
    preparation_days: z.number().int().nonnegative(),
    type: z.nativeEnum(RVType),
    year: z.number().int().positive().optional(),
  }),
});

export function validateUserBookingDetailsHandled(
  data: unknown,
): UserBookingDetails {
  try {
    return UserBookingDetailsSchema.parse(data) as UserBookingDetails;
  } catch (error) {
    handleZodValidationError(error, "user booking details");
  }
}
