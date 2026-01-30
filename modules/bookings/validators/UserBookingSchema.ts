import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import { UserBooking, UserBookingsData } from "../domain";
import { UserBookingStatus } from "@/modules/shared/domain/types";

const UserBookingSchema = z.object({
  booking_number: z.string(),
  can_review: z.boolean(),
  created_at: z.string(),
  current_status: z.nativeEnum(UserBookingStatus),
  end_date: z.string(),
  id: z.string(),
  owner: z.object({
    id: z.string(),
    name: z.string(),
  }),
  owner_review: z
    .object({
      comment: z.string().optional(),
      created_at: z.string(),
      id: z.string(),
      rating: z.number().nonnegative(),
    })
    .optional(),
  start_date: z.string(),
  statuses: z.array(
    z.object({
      changed_by: z.string().optional(),
      from_status: z.nativeEnum(UserBookingStatus).optional(),
      id: z.string(),
      reason: z.string().optional(),
      timestamp: z.string(),
      to_status: z.nativeEnum(UserBookingStatus),
    }),
  ),
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
  vehicle: z.object({
    id: z.string(),
    images: z.array(z.string()).nullable(),
    name: z.string(),
    type: z.string(),
  }),
});

const UserBookingsDataSchema = z.object({
  bookings: z.array(UserBookingSchema),
  total: z.number().int().nonnegative(),
});

export function validateUserBookingHandled(data: unknown): UserBooking {
  try {
    return UserBookingSchema.parse(data) as UserBooking;
  } catch (error) {
    handleZodValidationError(error, "user booking");
  }
}

export function validateUserBookingsDataHandled(
  data: unknown,
): UserBookingsData {
  try {
    return UserBookingsDataSchema.parse(data) as UserBookingsData;
  } catch (error) {
    handleZodValidationError(error, "user booking data");
  }
}
