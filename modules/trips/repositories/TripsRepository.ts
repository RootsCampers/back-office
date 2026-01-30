import { apiFetch, apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type {
  UpdateTripStatusRequest,
  UpdateTripStatusResponse,
  StartTripRequest,
  CompleteTripRequest,
  TripOperationResponse,
  ReviewTravelerTripRequest,
  ReviewOwnerTripResponse,
  ReviewOwnerTripRequest,
  ReviewTravelerTripResponse,
} from "../domain";

/**
 * Trips Repository
 *
 * Responsible for:
 * - Direct HTTP communication with Go backend via Caddy
 * - Endpoint configuration for trips-related operations
 * - Request/response handling at HTTP level
 *
 * Does NOT handle:
 * - Data transformation
 * - Business logic
 * - Validation (handled by Validator layer)
 */
export class TripsRepository {
  private readonly tripsBaseEndpoint = "/api/trips";
  private readonly bookingsBaseEndpoint = "/api/bookings";

  /**
   * Fetches trips for authenticated user (admin or owner)
   * Admin sees all trips, owner sees only their organization's trips
   *
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw trips data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchTrips(token: string): Promise<unknown> {
    return apiFetchData<unknown>(this.tripsBaseEndpoint, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      defaultValue: { trips: [], count: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Fetches a single trip by ID
   *
   * @param id - Trip ID
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw trip data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchTripById(id: string, token: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.tripsBaseEndpoint}/${id}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Updates trip status (with optional km reading)
   *
   * @param id - Trip ID
   * @param data - Status update data { status, km_reading? }
   * @param token - JWT access token for authentication
   * @returns Promise<UpdateTripStatusResponse>
   * @throws ApiError with appropriate error codes
   */
  async updateTripStatus(
    id: string,
    data: UpdateTripStatusRequest,
    token: string
  ): Promise<UpdateTripStatusResponse> {
    return apiFetch<UpdateTripStatusResponse>(
      `${this.tripsBaseEndpoint}/${id}`,
      {
        method: "PATCH",
        data,
        token,
      }
    );
  }

  /**
   * Fetches pending booking confirmations for owner
   *
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw pending confirmations data
   * @throws ApiError with appropriate error codes
   */
  async fetchPendingConfirmations(token: string): Promise<unknown> {
    return apiFetchData<unknown>(this.bookingsBaseEndpoint, {
      method: "GET",
      params: { status: "pending_confirmation" },
      token,
      cache: "no-store",
      retries: 1,
      defaultValue: { confirmations: [], count: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Confirms a booking
   *
   * @param bookingId - Booking ID to confirm
   * @param token - JWT access token for authentication
   * @returns Promise<{ success: boolean; message: string }>
   * @throws ApiError with appropriate error codes
   */
  async confirmBooking(
    bookingId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(
      `${this.bookingsBaseEndpoint}/${bookingId}`,
      {
        method: "PATCH",
        data: { status: "confirmed" },
        token,
      }
    );
  }

  /**
   * Rejects a booking
   *
   * @param bookingId - Booking ID to reject
   * @param reason - Optional rejection reason
   * @param token - JWT access token for authentication
   * @returns Promise<{ success: boolean; message: string }>
   * @throws ApiError with appropriate error codes
   */
  async rejectBooking(
    bookingId: string,
    token: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(
      `${this.bookingsBaseEndpoint}/${bookingId}`,
      {
        method: "PATCH",
        data: { status: "rejected", rejection_reason: reason },
        token,
      }
    );
  }

  /**
   * Starts a trip (records start km and sets status to in_progress)
   *
   * @param tripId - Trip ID to start
   * @param data - Start trip data { km }
   * @param token - JWT access token for authentication
   * @returns Promise<TripOperationResponse> - Updated trip data
   * @throws ApiError with appropriate error codes
   */
  async startTrip(
    tripId: string,
    data: StartTripRequest,
    token: string
  ): Promise<TripOperationResponse> {
    return apiFetch<TripOperationResponse>(
      `${this.tripsBaseEndpoint}/${tripId}/start`,
      {
        method: "POST",
        data,
        token,
      }
    );
  }

  /**
   * Completes a trip (records end km and sets status to completed)
   *
   * @param tripId - Trip ID to complete
   * @param data - Complete trip data { km }
   * @param token - JWT access token for authentication
   * @returns Promise<TripOperationResponse> - Updated trip data
   * @throws ApiError with appropriate error codes
   */
  async completeTrip(
    tripId: string,
    data: CompleteTripRequest,
    token: string
  ): Promise<TripOperationResponse> {
    return apiFetch<TripOperationResponse>(
      `${this.tripsBaseEndpoint}/${tripId}/complete`,
      {
        method: "POST",
        data,
        token,
      }
    );
  }

  /**
   * Reviews a trip
   * @param tripId - Trip ID
   * @param data - Review data
   * @param token - JWT access token for authentication
   * @returns Review result
   */
  async reviewOwnerTrip(
    data: ReviewOwnerTripRequest,
    token: string
  ): Promise<ReviewOwnerTripResponse> {
    return apiFetch<ReviewOwnerTripResponse>(
      `${this.tripsBaseEndpoint}/reviews/owner`,
      {
        method: "POST",
        data,
        token,
      }
    );
  }

  /**
   * Reviews a trip
   * @param tripId - Trip ID
   * @param data - Review data
   * @param token - JWT access token for authentication
   * @returns Review result
   */
  async reviewTravelerTrip(
    data: ReviewTravelerTripRequest,
    token: string
  ): Promise<ReviewTravelerTripResponse> {
    return apiFetch<ReviewTravelerTripResponse>(
      `${this.tripsBaseEndpoint}/reviews/traveler`,
      {
        method: "POST",
        data,
        token,
      }
    );
  }
}

/**
 * Factory function to create TripsRepository instance
 */
export function createTripsRepository(): TripsRepository {
  return new TripsRepository();
}
