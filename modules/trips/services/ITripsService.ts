import type {
  TripsData,
  Trip,
  UpdateTripStatusRequest,
  UpdateTripStatusResponse,
  PendingConfirmationsData,
  TripOperationResponse,
  ReviewOwnerTripRequest,
  ReviewOwnerTripResponse,
  ReviewTravelerTripRequest,
  ReviewTravelerTripResponse,
} from "../domain";

/**
 * Interface for Trips Service
 *
 * Defines the contract for trips-related business operations.
 */
export interface ITripsService {
  /**
   * Get all trips for the authenticated user
   * @param token - JWT access token
   * @returns Validated trips data
   */
  getTrips(token: string): Promise<TripsData>;

  /**
   * Get a single trip by ID
   * @param id - Trip ID
   * @param token - JWT access token
   * @returns Validated trip data
   */
  getTripById(id: string, token: string): Promise<Trip>;

  /**
   * Update trip status (with optional km reading)
   * @param id - Trip ID
   * @param data - Status update data
   * @param token - JWT access token
   * @returns Update result
   */
  updateTripStatus(
    id: string,
    data: UpdateTripStatusRequest,
    token: string
  ): Promise<UpdateTripStatusResponse>;

  /**
   * Get pending booking confirmations
   * @param token - JWT access token
   * @returns Pending confirmations data
   */
  getPendingConfirmations(token: string): Promise<PendingConfirmationsData>;

  /**
   * Confirm a booking
   * @param bookingId - Booking ID
   * @param token - JWT access token
   * @returns Confirmation result
   */
  confirmBooking(
    bookingId: string,
    token: string
  ): Promise<{ success: boolean; message: string }>;

  /**
   * Reject a booking
   * @param bookingId - Booking ID
   * @param token - JWT access token
   * @param reason - Optional rejection reason
   * @returns Rejection result
   */
  rejectBooking(
    bookingId: string,
    token: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }>;

  /**
   * Start a trip (records start km and sets status to in_progress)
   * @param tripId - Trip ID
   * @param km - Start km reading
   * @param token - JWT access token
   * @returns Updated trip data
   */
  startTrip(
    tripId: string,
    km: number,
    token: string
  ): Promise<TripOperationResponse>;

  /**
   * Complete a trip (records end km and sets status to completed)
   * @param tripId - Trip ID
   * @param km - End km reading
   * @param token - JWT access token
   * @returns Updated trip data
   */
  completeTrip(
    tripId: string,
    km: number,
    token: string
  ): Promise<TripOperationResponse>;

  /**
   * Review a trip
   * @param tripId - Trip ID
   * @param data - Review data
   * @param token - JWT access token
   * @returns Review result
   */
  reviewOwnerTrip(
    data: ReviewOwnerTripRequest,
    token: string
  ): Promise<ReviewOwnerTripResponse>;

  /**
   * Review a trip
   * @param tripId - Trip ID
   * @param data - Review data
   * @param token - JWT access token
   * @returns Review result
   */
  reviewTravelerTrip(
    data: ReviewTravelerTripRequest,
    token: string
  ): Promise<ReviewTravelerTripResponse>;
}
