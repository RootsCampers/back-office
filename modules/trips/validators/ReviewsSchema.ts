import z from "zod";
import { ReviewOwnerTripRequest, ReviewOwnerTripResponse, ReviewTravelerTripRequest, ReviewTravelerTripResponse } from "../domain";
import { handleZodValidationError } from "@/lib/validation/errorHandler";

const ReviewOwnerTripRequestSchema = z.object({
  comment: z.string().optional(),
  rating: z.number().max(5).min(1),
  trip_id: z.string(),
});

const ReviewOwnerTripResponseSchema = z.object({
  comment: z.string().optional(),
  created_at: z.string(),
  id: z.string(),
  rating: z.number(),
  trip_id: z.string(),
  updated_at: z.string().optional(),
});

const ReviewTravelerTripRequestSchema = z.object({
  camper_comment: z.string().optional(),
  camper_rating: z.number().max(5).min(1).optional(),
  owner_comment: z.string().optional(),
  owner_rating: z.number().max(5).min(1).optional(),
  trip_id: z.string(),
});

const ReviewTravelerTripResponseSchema = z.object({
  camper_comment: z.string().optional(),
  camper_rating: z.number().optional(),
  created_at: z.string().optional(),
  id: z.string(),
  owner_comment: z.string().optional(),
  owner_rating: z.number().optional(),
  trip_id: z.string(),
  updated_at: z.string().optional(),
});

export function validateReviewOwnerTripRequestHandled(data: unknown): ReviewOwnerTripRequest {
    try {
      return ReviewOwnerTripRequestSchema.parse(data) as ReviewOwnerTripRequest;
    } catch (error) {
      handleZodValidationError(error, "review owner trip request");
    }
  }

export function validateReviewOwnerTripResponseHandled(data: unknown): ReviewOwnerTripResponse {
    try {
      return ReviewOwnerTripResponseSchema.parse(data) as ReviewOwnerTripResponse;
    } catch (error) {
      handleZodValidationError(error, "review owner trip response");
    }
  }

export function validateReviewTravelerTripRequestHandled(data: unknown): ReviewTravelerTripRequest {
    try {
      return ReviewTravelerTripRequestSchema.parse(data) as ReviewTravelerTripRequest;
    } catch (error) {
      handleZodValidationError(error, "review traveler trip request");
    }
  }

export function validateReviewTravelerTripResponseHandled(data: unknown): ReviewTravelerTripResponse {
    try {
      return ReviewTravelerTripResponseSchema.parse(data) as ReviewTravelerTripResponse;
    } catch (error) {
      handleZodValidationError(error, "review traveler trip response");
    }
  }