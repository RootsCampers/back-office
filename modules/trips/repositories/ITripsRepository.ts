import type {
  UpdateTripStatusRequest,
  UpdateTripStatusResponse,
  StartTripRequest,
  CompleteTripRequest,
  TripOperationResponse,
  ReviewOwnerTripRequest,
  ReviewOwnerTripResponse,
  ReviewTravelerTripRequest,
  ReviewTravelerTripResponse,
} from "../domain";

export interface ITripsRepository {
  fetchTrips(
    token: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<unknown>;
  fetchTripById(id: string, token: string): Promise<unknown>;
  updateTripStatus(
    id: string,
    data: UpdateTripStatusRequest,
    token: string
  ): Promise<UpdateTripStatusResponse>;
  fetchPendingConfirmations(token: string): Promise<unknown>;
  confirmBooking(
    bookingId: string,
    token: string
  ): Promise<{ success: boolean; message: string }>;
  rejectBooking(
    bookingId: string,
    token: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }>;
  startTrip(
    tripId: string,
    data: StartTripRequest,
    token: string
  ): Promise<TripOperationResponse>;
  completeTrip(
    tripId: string,
    data: CompleteTripRequest,
    token: string
  ): Promise<TripOperationResponse>;
  reviewOwnerTrip(
    data: ReviewOwnerTripRequest,
    token: string
  ): Promise<ReviewOwnerTripResponse>;
  reviewTravelerTrip(
    data: ReviewTravelerTripRequest,
    token: string
  ): Promise<ReviewTravelerTripResponse>;
}
