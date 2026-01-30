import { apiFetch, apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import decodeJWT from "@/modules/auth/utils/decode-jwt";
import type { RejectBookingRequest, UpdateBookingStatusRequest, UserBookingParams } from "../domain";

export class BookingsRepository {
  private readonly bookingsBaseEndpoint = "/api/bookings";
  private readonly dashboardEndpoint = "/api/bookings/dashboard";
  private readonly pendingConfirmationsEndpoint =
    "/api/bookings/pending-confirmations";
  private readonly userBookingsBaseEndpoint = "/api/bookings/my-bookings";
  private readonly quotesBaseEndpoint = "/api/quotes";

  /**
   * Creates a new booking
   *
   * @param data - The data to create the booking
   * @returns Promise<unknown> - The created booking
   * @throws ApiError with appropriate error codes
   */
  async createBooking(token: string, data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(this.bookingsBaseEndpoint, {
      method: "POST",
      data,
      token,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Fetches all bookings for a user
   *
   * @param token - The token to authenticate the request
   * @param params - Pagination parameters (limit, offset)
   * @returns Promise<unknown> - The fetched bookings
   * @throws ApiError with appropriate error codes
   */
  async fetchUserBookings(
    token: string,
    params: UserBookingParams,
  ): Promise<unknown> {
    const payload = decodeJWT(token);
    if (!payload?.sub) {
      throw new Error("Unable to extract user id from token");
    }
    const userId = payload.sub;
    const endpoint = `${this.userBookingsBaseEndpoint}/${userId}`;

    return apiFetchData<unknown>(endpoint, {
      method: "GET",
      token,
      params,
      cache: "no-store",
      retries: 2,
      defaultValue: { bookings: [], total: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  // ============================================================================
  // Dashboard Endpoints (for owner/admin)
  // ============================================================================

  /**
   * Fetches enriched bookings for owner/admin dashboard
   * Returns bookings with camper, traveler, statuses, reviews, etc.
   *
   * @param token - JWT access token for authentication
   * @param params - Optional query params (status filter, pagination)
   * @returns Promise<unknown> - Raw dashboard bookings data
   * @throws ApiError with appropriate error codes
   */
  async fetchDashboardBookings(
    token: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<unknown> {
    return apiFetchData<unknown>(this.dashboardEndpoint, {
      method: "GET",
      token,
      params,
      cache: "no-store",
      retries: 1,
      defaultValue: { bookings: [], count: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Updates booking status (with optional km reading)
   * Used for: confirm booking, start trip, complete trip, cancel
   *
   * @param token - JWT access token for authentication
   * @param bookingId - The booking ID to update
   * @param data - Status update data { status, km_reading? }
   * @returns Promise<unknown> - Update result
   * @throws ApiError with appropriate error codes
   */
  async updateBookingStatus(
    token: string,
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<unknown> {
    return apiFetch<unknown>(`${this.bookingsBaseEndpoint}/${bookingId}`, {
      method: "PATCH",
      token,
      data,
    });
  }

  /**
   * Fetches bookings awaiting owner confirmation (status = 'paid')
   *
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw pending confirmations data
   * @throws ApiError with appropriate error codes
   */
  async fetchPendingConfirmations(token: string): Promise<unknown> {
    return apiFetchData<unknown>(this.pendingConfirmationsEndpoint, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      defaultValue: { confirmations: [] },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  // ============================================================================
  // Quote Endpoints
  // ============================================================================

  /**
   * Fetches a booking detail
   *
   * @param token - The token to authenticate the request
   * @param id - The id of the booking
   * @returns Promise<unknown> - The fetched booking detail
   * @throws ApiError with appropriate error codes
   */
  private readonly bookingDetailBaseEndpoint =
    "/api/bookings/my-bookings/detail";

  async fetchBookingDetail(token: string, id: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.bookingDetailBaseEndpoint}/${id}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 2,
      defaultValue: {},
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }
  /**
   *  Calculates a quote for a booking/ no auth needed
   *
   * @param data - The data to calculate the quote
   * @returns Promise<unknown> - The calculated quote
   * @throws ApiError with appropriate error codes
   */
  async calculateQuote(data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(this.quotesBaseEndpoint, {
      method: "POST",
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  // ============================================================================
  // Owner Action Endpoints (Confirm/Reject Bookings)
  // ============================================================================

  /**
   * Owner confirms a paid booking
   *
   * @param token - JWT access token for authentication
   * @param bookingId - The booking ID to confirm
   * @returns Promise<unknown> - Raw confirm result
   * @throws ApiError with appropriate error codes
   */
  async confirmBooking(token: string, bookingId: string): Promise<unknown> {
    return apiFetch<unknown>(`${this.bookingsBaseEndpoint}/${bookingId}/confirm`, {
      method: "POST",
      token,
      data: {},
    });
  }

  /**
   * Owner rejects a paid booking
   *
   * @param token - JWT access token for authentication
   * @param bookingId - The booking ID to reject
   * @param data - Optional rejection reason
   * @returns Promise<unknown> - Raw reject result
   * @throws ApiError with appropriate error codes
   */
  async rejectBooking(
    token: string,
    bookingId: string,
    data?: RejectBookingRequest
  ): Promise<unknown> {
    return apiFetch<unknown>(`${this.bookingsBaseEndpoint}/${bookingId}/reject`, {
      method: "POST",
      token,
      data: data || {},
    });
  }
}

export function createBookingRepository(): BookingsRepository {
  return new BookingsRepository();
}
