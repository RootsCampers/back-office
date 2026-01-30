import {
  BookingRequest,
  BookingResponse,
  BookingStatusUpdateResult,
  DashboardBookingsData,
  PendingConfirmationsData,
  QuoteRequest,
  QuoteResponse,
  RejectBookingRequest,
  UpdateBookingStatusRequest,
  UpdateBookingStatusResponse,
  UserBookingDetails,
  UserBookingParams,
  UserBookingsData,
} from "../domain";

export interface IBookingServices {
  /**
   * Creates a new booking
   *
   * @param data - The data to create the booking
   * @returns Promise<BookingResponse> - The created booking
   * @throws ApiError with appropriate error codes
   */
  createBooking(token: string, data: BookingRequest): Promise<BookingResponse>;

  /**
   * Fetches all bookings
   *
   * @param token - The token to authenticate the request
   * @returns Promise<BookingsData> - The fetched bookings
   * @throws ApiError with appropriate error codes
   */
  fetchUserBookings(
    token: string,
    params: UserBookingParams,
  ): Promise<UserBookingsData>;

  /**
   * Fetches a booking detail
   *
   * @param token - The token to authenticate the request
   * @param id - The id of the booking
   * @returns Promise<BookingDetail> - The fetched booking detail
   * @throws ApiError with appropriate error codes
   */
  fetchBookingDetail(token: string, id: string): Promise<UserBookingDetails>;

  /**
   * Calculates a quote for a booking/ no auth needed
   *
   * @param data - The data to calculate the quote
   * @returns Promise<QuoteResponse> - The calculated quote
   * @throws ApiError with appropriate error codes
   */
  calculateQuote(data: QuoteRequest): Promise<QuoteResponse>;

  // ============================================================================
  // Dashboard Methods (for owner/admin)
  // ============================================================================

  /**
   * Fetches enriched bookings for owner/admin dashboard
   * Returns bookings with camper, traveler, statuses, reviews, etc.
   *
   * @param token - JWT access token for authentication
   * @param params - Optional query params (status filter, pagination)
   * @returns Promise<DashboardBookingsData> - Enriched bookings data
   * @throws ApiError with appropriate error codes
   */
  fetchDashboardBookings(
    token: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<DashboardBookingsData>;

  /**
   * Updates booking status (with optional km reading)
   * Used for: confirm booking, start trip, complete trip, cancel
   *
   * @param token - JWT access token for authentication
   * @param bookingId - The booking ID to update
   * @param data - Status update data { status, km_reading? }
   * @returns Promise<UpdateBookingStatusResponse> - Update result
   * @throws ApiError with appropriate error codes
   */
  updateBookingStatus(
    token: string,
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<UpdateBookingStatusResponse>;

  /**
   * Fetches bookings awaiting owner confirmation (status = 'paid')
   *
   * @param token - JWT access token for authentication
   * @returns Promise<PendingConfirmationsData> - Pending confirmations data
   * @throws ApiError with appropriate error codes
   */
  fetchPendingConfirmations(token: string): Promise<PendingConfirmationsData>;

  // ============================================================================
  // Owner Actions (Confirm/Reject Bookings)
  // ============================================================================

  /**
   * Owner confirms a paid booking
   * Transitions booking from 'paid' to 'confirmed' status
   *
   * @param token - JWT access token for authentication
   * @param bookingId - The booking ID to confirm
   * @returns Promise<BookingStatusUpdateResult> - Result of the status update
   * @throws ApiError with appropriate error codes
   */
  confirmBooking(
    token: string,
    bookingId: string
  ): Promise<BookingStatusUpdateResult>;

  /**
   * Owner rejects a paid booking
   * Transitions booking from 'paid' to 'cancelled_by_owner' status
   *
   * @param token - JWT access token for authentication
   * @param bookingId - The booking ID to reject
   * @param data - Optional rejection reason
   * @returns Promise<BookingStatusUpdateResult> - Result of the status update
   * @throws ApiError with appropriate error codes
   */
  rejectBooking(
    token: string,
    bookingId: string,
    data?: RejectBookingRequest
  ): Promise<BookingStatusUpdateResult>;
}
