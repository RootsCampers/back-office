/**
 * Trip Domain Types
 *
 * Types for trip data returned from rootend API.
 * These match the response structure from GET /api/trips
 */

export interface TripStatus {
  id: string;
  status: string;
  timestamp: string;
}

export interface TripCamper {
  id: string;
  name: string;
  images: string[];
  type: string;
  license_plate?: string;
}

export interface TripTraveler {
  id: string;
  email: string;
}

export interface OwnerReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface TravelerReview {
  id: string;
  owner_rating: number;
  owner_comment: string;
  camper_rating: number;
  camper_comment: string;
  created_at: string;
}

export interface InspectionPhoto {
  id: string;
  photo_position: string;
  storage_url: string;
  uploaded_at: string;
}

export interface InspectionSummary {
  id: string;
  inspection_type: "check_out" | "check_in";
  completed_at: string | null;
  photo_count: number;
  photos: InspectionPhoto[];
}

export interface Trip {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string;
  start_km?: number | null;
  end_km?: number | null;
  total_km?: number | null;
  price_per_day: number;
  minimum_days: number;
  statuses: TripStatus[];
  camper: TripCamper;
  traveler: TripTraveler;
  owner_review: OwnerReview | null;
  traveler_review: TravelerReview | null;
  can_review: boolean;
  inspection?: InspectionSummary | null;
}

/**
 * Response from GET /api/trips
 */
export interface TripsData {
  trips: Trip[];
  count: number;
}

/**
 * Request body for PATCH /api/trips/{id}
 */
export interface UpdateTripStatusRequest {
  status: string;
  km_reading?: number;
}

/**
 * Response from PATCH /api/trips/{id}
 */
export interface UpdateTripStatusResponse {
  success: boolean;
  message: string;
  km_reading?: number;
  total_km?: number;
}

/**
 * Request body for POST /api/trips/{id}/start
 */
export interface StartTripRequest {
  km: number;
}

/**
 * Request body for POST /api/trips/{id}/complete
 */
export interface CompleteTripRequest {
  km: number;
}

/**
 * Response from POST /api/trips/{id}/start and POST /api/trips/{id}/complete
 * Returns the updated trip
 */
export interface TripOperationResponse {
  id: string;
  booking_id: string;
  actual_pickup_at?: string | null;
  actual_dropoff_at?: string | null;
  actual_pickup_location_id?: string | null;
  actual_dropoff_location_id?: string | null;
  start_km?: number | null;
  end_km?: number | null;
  start_fuel_level?: number | null;
  end_fuel_level?: number | null;
  operational_status: string;
  pickup_notes?: string | null;
  dropoff_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Pending confirmation from GET /api/bookings?status=pending_confirmation
 */
export interface PendingConfirmation {
  trip_id: string;
  end_date: string;
  camper_id: string;
  created_at: string;
  start_date: string;
  camper_name: string;
  total_price: number;
  traveler_id: string;
  advertising_name: string;
  status_timestamp: string;
  default_security_deposit: number;
}

export interface PendingConfirmationsData {
  confirmations: PendingConfirmation[];
  count: number;
}

export interface ReviewOwnerTripRequest {
  comment?: string;
  rating: number;
  trip_id: string;
}

export interface ReviewOwnerTripResponse {
  comment?: string;
  created_at?: string;
  id: string;
  rating: number;
  trip_id: string;
  updated_at?: string
}

export interface ReviewTravelerTripRequest {
  camper_comment?: string;
  camper_rating: number;
  owner_comment?: string;
  owner_rating?: number;
  trip_id: string;
}

export interface ReviewTravelerTripResponse {
  camper_comment?: string;
  camper_rating: number;
  created_at?: string;
  id: string;
  owner_comment?: string;
  owner_rating?: number;
  trip_id: string;
  updated_at?: string;
}