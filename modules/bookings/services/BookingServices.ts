import { BookingRequest, DashboardBooking, DashboardBookingsData, QuoteRequest, RejectBookingRequest, UpdateBookingStatusRequest, UserBookingParams } from "../domain";
import { createBookingRepository } from "../repositories";
import { IBookingServices } from "./IBookingServices";
import {
  validateBookingRequestHandled,
  validateBookingResponseHandled,
  validateBookingStatusUpdateResultHandled,
  validateDashboardBookingsDataHandled,
  validatePendingConfirmationsDataHandled,
  validateQuoteRequestHandled,
  validateQuoteResponseHandled,
  validateUpdateBookingStatusResponseHandled,
} from "../validators/BookingSchema";
import { validateUserBookingsDataHandled } from "../validators/UserBookingSchema";
import { validateUserBookingDetailsHandled } from "../validators";

/**
 * Normalize camper images to ensure consistent array format.
 * Handles cases where images may be a JSON string, single string, or malformed array.
 */
function normalizeImages(images: unknown): string[] {
  if (!images) {
    return [];
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter((img): img is string => typeof img === "string") : [images];
    } catch {
      return [images];
    }
  }

  if (Array.isArray(images)) {
    return images.filter((img): img is string => img && typeof img === "string");
  }

  return [];
}

/**
 * Normalize all camper images in dashboard bookings data.
 */
function normalizeDashboardBookings(data: DashboardBookingsData): DashboardBookingsData {
  return {
    ...data,
    bookings: data.bookings.map((booking): DashboardBooking => ({
      ...booking,
      camper: {
        ...booking.camper,
        images: normalizeImages(booking.camper.images),
      },
    })),
  };
}

export function createBookingService(): IBookingServices {
  const repository = createBookingRepository();

  return {
    createBooking: async (token: string, data: BookingRequest) => {
      const validatedRequest = validateBookingRequestHandled(data);
      const rawData = await repository.createBooking(token, validatedRequest);
      const validatedData = validateBookingResponseHandled(rawData);
      return validatedData;
    },

    fetchUserBookings: async (token: string, params: UserBookingParams) => {
      const rawData = await repository.fetchUserBookings(token, params);
      const validatedData = validateUserBookingsDataHandled(rawData);
      return validatedData;
    },

    fetchBookingDetail: async (token: string, id: string) => {
      const rawData = await repository.fetchBookingDetail(token, id);
      const validatedData = validateUserBookingDetailsHandled(rawData);
      return validatedData;
    },

    calculateQuote: async (data: QuoteRequest) => {
      const validatedRequest = validateQuoteRequestHandled(data);
      const rawData = await repository.calculateQuote(validatedRequest);
      const validatedData = validateQuoteResponseHandled(rawData);
      return validatedData;
    },

    // Dashboard methods
    fetchDashboardBookings: async (
      token: string,
      params?: { status?: string; page?: number; limit?: number }
    ) => {
      const rawData = await repository.fetchDashboardBookings(token, params);
      const validatedData = validateDashboardBookingsDataHandled(rawData);
      // Normalize camper images to ensure consistent array format
      return normalizeDashboardBookings(validatedData);
    },

    updateBookingStatus: async (
      token: string,
      bookingId: string,
      data: UpdateBookingStatusRequest
    ) => {
      const rawData = await repository.updateBookingStatus(token, bookingId, data);
      const validatedData = validateUpdateBookingStatusResponseHandled(rawData);
      return validatedData;
    },

    fetchPendingConfirmations: async (token: string) => {
      const rawData = await repository.fetchPendingConfirmations(token);
      const validatedData = validatePendingConfirmationsDataHandled(rawData);
      return validatedData;
    },

    // Owner action methods
    confirmBooking: async (token: string, bookingId: string) => {
      const rawData = await repository.confirmBooking(token, bookingId);
      const validatedData = validateBookingStatusUpdateResultHandled(rawData);
      return validatedData;
    },

    rejectBooking: async (
      token: string,
      bookingId: string,
      data?: RejectBookingRequest
    ) => {
      const rawData = await repository.rejectBooking(token, bookingId, data);
      const validatedData = validateBookingStatusUpdateResultHandled(rawData);
      return validatedData;
    },
  };
}
