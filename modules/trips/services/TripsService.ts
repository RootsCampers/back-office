import type { ITripsService } from "./ITripsService";
import { createTripsRepository, TripsRepository } from "../repositories";
import {
  validateTripsDataHandled,
  validateTrip,
  validatePendingConfirmationsDataHandled,
  validateReviewOwnerTripRequestHandled,
  validateReviewOwnerTripResponseHandled,
  validateReviewTravelerTripRequestHandled,
  validateReviewTravelerTripResponseHandled,
} from "../validators";
import type {
  TripsData,
  Trip,
  UpdateTripStatusRequest,
  UpdateTripStatusResponse,
  PendingConfirmationsData,
  TripOperationResponse,
  ReviewTravelerTripRequest,
  ReviewTravelerTripResponse,
  ReviewOwnerTripResponse,
  ReviewOwnerTripRequest,
} from "../domain";

/**
 * Trips Service Implementation
 *
 * Orchestrates repository calls and applies validation.
 * Contains business logic for trips-related operations.
 */
export class TripsService implements ITripsService {
  private readonly repository: TripsRepository;

  constructor(repository?: TripsRepository) {
    this.repository = repository ?? createTripsRepository();
  }

  async getTrips(token: string): Promise<TripsData> {
    const rawData = await this.repository.fetchTrips(token);
    return validateTripsDataHandled(rawData);
  }

  async getTripById(id: string, token: string): Promise<Trip> {
    const rawData = await this.repository.fetchTripById(id, token);
    return validateTrip(rawData);
  }

  async updateTripStatus(
    id: string,
    data: UpdateTripStatusRequest,
    token: string
  ): Promise<UpdateTripStatusResponse> {
    return this.repository.updateTripStatus(id, data, token);
  }

  async getPendingConfirmations(token: string): Promise<PendingConfirmationsData> {
    const rawData = await this.repository.fetchPendingConfirmations(token);
    return validatePendingConfirmationsDataHandled(rawData);
  }

  async confirmBooking(
    bookingId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return this.repository.confirmBooking(bookingId, token);
  }

  async rejectBooking(
    bookingId: string,
    token: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return this.repository.rejectBooking(bookingId, token, reason);
  }

  async startTrip(
    tripId: string,
    km: number,
    token: string
  ): Promise<TripOperationResponse> {
    return this.repository.startTrip(tripId, { km }, token);
  }

  async completeTrip(
    tripId: string,
    km: number,
    token: string
  ): Promise<TripOperationResponse> {
    return this.repository.completeTrip(tripId, { km }, token);
  }

  async reviewOwnerTrip(
    data: ReviewOwnerTripRequest,
    token: string
  ): Promise<ReviewOwnerTripResponse> {
    const validatedData = validateReviewOwnerTripRequestHandled(data);
    const rawData = await this.repository.reviewOwnerTrip(validatedData, token);
    return validateReviewOwnerTripResponseHandled(rawData);
  }

  async reviewTravelerTrip(
    data: ReviewTravelerTripRequest,
    token: string
  ): Promise<ReviewTravelerTripResponse> {
    const validatedData = validateReviewTravelerTripRequestHandled(data);
    const rawData = await this.repository.reviewTravelerTrip(validatedData, token);
    return validateReviewTravelerTripResponseHandled(rawData);
  }
}

/**
 * Factory function to create TripsService instance
 */
export function createTripsService(): ITripsService {
  return new TripsService();
}
