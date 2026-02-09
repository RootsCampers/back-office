import type {
  RejectBookingRequest,
  UpdateBookingStatusRequest,
  UserBookingParams,
} from "../domain";

export interface IBookingsRepository {
  createBooking(token: string, data: unknown): Promise<unknown>;
  fetchUserBookings(token: string, params: UserBookingParams): Promise<unknown>;
  fetchDashboardBookings(
    token: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<unknown>;
  updateBookingStatus(
    token: string,
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<unknown>;
  fetchPendingConfirmations(token: string): Promise<unknown>;
  fetchBookingDetail(token: string, id: string): Promise<unknown>;
  calculateQuote(data: unknown): Promise<unknown>;
  confirmBooking(token: string, bookingId: string): Promise<unknown>;
  rejectBooking(
    token: string,
    bookingId: string,
    data?: RejectBookingRequest
  ): Promise<unknown>;
}
