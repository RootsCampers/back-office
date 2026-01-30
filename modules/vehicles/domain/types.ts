import { ActiveOffer, Extra, PricingRule } from "@/modules/pricing/domain";
import {
  FuelType,
  LatamCountry,
  RVType,
  TransmissionType,
} from "@/modules/shared/domain/types";

// this types is from search vehicles endpoint
export type Vehicle = {
  advertising_id: number;
  available_amenities: string[];
  description: string;
  financials: {
    base_price_per_day: number;
    currency: string;
    security_deposit: number;
  };
  headquarter_location_id: string;
  id: string;
  images: string[];
  location: {
    address: string;
    city: string;
    country: string;
    state: string;
  };
  manufacturer: string;
  minimum_days: number;
  model: string;
  name: string;
  passengers: number;
  type: RVType;
  vehicle_length: number;
};

export type VehiclesData = {
  vehicles: Vehicle[];
  count: number;
};

export type VehiclesSearchParams = {
  country: string;
  end_date: string;
  start_date: string;
  passengers?: number;
  state?: string;
};

export type VehicleListingDetails = {
  acquisition_value: number;
  advertising: {
    active_offers: Array<ActiveOffer>;
    cancellation_policy: {
      cancellation_rules: unknown;
      id: string;
      name: string;
      policy_type: string;
    };
    description: string;
    extras: Array<Extra>;
    id: number;
    max_daily_km: number;
    minimum_days: number;
    name: string;
    pricing_rules: Array<PricingRule>;
    security_deposit_amount: number;
  };
  available_amenities: string[];
  description: string;
  fuel: FuelType;
  id: string;
  images: string[];
  license_plate: string;
  location: {
    city: string;
    city_id: string;
    country: string;
    country_code: string;
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    region_id: string;
    state: string;
  };
  manufacturer: string;
  mileage: number;
  model: string;
  name: string;
  owner_id: string;
  passengers: number;
  preparation_days: number;
  registration_country: string;
  transmission: TransmissionType;
  type: RVType;
  vehicle_length: number;
  vehicle_weight: number;
  year_of_registration: number;
};

// type for fleet page
export type VehicleCompleteListing = {
  advertising: {
    base_price_per_day: number;
    id: number;
    is_active: boolean;
    max_daily_km: number | null;
    minimum_days: number;
    price_range: {
      max_price: number;
      min_price: number;
    };
    pricing_rules: Array<PricingRule>;
    security_deposit_amount: number;
  };
  available_amenities: string[];
  description: string;
  id: string;
  images: string[];
  location: {
    city: string;
    country: string;
    country_code: string;
    id: string;
    latitude: number | null;
    longitude: number | null;
    name: string;
    state: string;
  };
  manufacturer: string;
  model: string;
  name: string;
  passengers: number;
  type: RVType;
  vehicle_length: number;
  year_of_registration: number;
};

export type VehiclesCompleteListingData = {
  fleet: VehicleCompleteListing[];
  total_count: number;
};

// ============================================================================
// Owner Dashboard Types
// From GET /api/vehicles/owner-dashboard
// ============================================================================

/**
 * Owner's organization info
 */
export type OwnerInfo = {
  business_name?: string;
  business_type: string;
  contact_email?: string;
  created_at: string;
  id: string;
  locations: OwnerLocation[] | null;
  tax_id?: string;
  updated_at: string;
};

/**
 * Owner pickup/dropoff location
 */
export type OwnerLocation = {
  city?: string;
  country?: string;
  formatted_address?: string;
  id: string;
  is_active: boolean;
  latitude?: number;
  location_type: string;
  longitude?: number;
  name: string;
  state?: string;
};

/**
 * Camper/vehicle in the owner dashboard
 */
export type DashboardCamper = {
  active_advertising?: DashboardAdvertising;
  all_advertisings: DashboardAdvertisingSummary[] | null;
  description?: string;
  id: string;
  images: string[] | null;
  license_plate: string;
  location?: CamperLocation;
  manufacturer: string;
  model: string;
  name: string;
  passengers: number;
  type: string;
  vehicle_length?: number;
};

/**
 * Active advertising with full pricing details
 */
export type DashboardAdvertising = {
  created_at: string;
  id: number;
  is_active: boolean;
  minimum_days: number;
  price_per_day?: number;
  seasonal_pricing: SeasonalPricingRule[] | null;
  security_deposit?: number;
  updated_at: string;
};

/**
 * Lightweight advertising summary for all_advertisings list
 */
export type DashboardAdvertisingSummary = {
  created_at: string;
  id: number;
  is_active: boolean;
  minimum_days: number;
  price_per_day?: number;
  updated_at: string;
};

/**
 * Location info embedded in a camper
 */
export type CamperLocation = {
  city?: string;
  city_id?: string;
  country?: string;
  country_code?: string;
  id: string;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
  name: string;
  region_id?: string;
  state?: string;
};

/**
 * Seasonal pricing rule for an advertising
 */
export type SeasonalPricingRule = {
  end_day?: number;
  end_month: number;
  id: string;
  price_per_day: number;
  start_day?: number;
  start_month: number;
  tier_pricing?: unknown;
};

/**
 * Full response from GET /api/vehicles/owner-dashboard
 */
export type OwnerDashboardData = {
  campers: DashboardCamper[] | null;
  owner: OwnerInfo;
};

// ============================================================================
// Vehicle Detail Types
// From GET /api/vehicles/{id}
// ============================================================================

/**
 * Full vehicle detail from GET /api/vehicles/{id}
 */
export interface VehicleDetail {
  id: string;
  owner_id: string | null;
  name: string | null;
  description: string | null;
  type: string;
  manufacturer: string | null;
  model: string | null;
  year_of_registration: number | null;
  license_plate: string | null;
  registration_country: string | null;
  transmission: string | null;
  mileage: number | null;
  fuel: string | null;
  vehicle_weight: number | null;
  vehicle_length: number | null;
  acquisition_value: number | null;
  passengers: number | null;
  images: string[];
  available_amenities: string[];
  preparation_days: number | null;
  headquarter_location_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Request to create or update a vehicle
 */
export interface VehicleRequest {
  acquisition_value?: number;
  available_amenities?: string[] | null;
  description?: string;
  fuel?: FuelType;
  headquarter_location_id?: string;
  images?: string[] | null;
  license_plate?: string;
  manufacturer?: string;
  mileage?: number;
  model?: string;
  name?: string;
  owner_id?: string;
  passengers?: number;
  preparation_days?: number;
  registration_country?: LatamCountry;
  transmission?: TransmissionType;
  type?: RVType;
  vehicle_weight?: number;
  vehicle_length?: number;
  year_of_registration?: number;
}

// ============================================================================
// Vehicle Document Types
// From GET /api/vehicles/documents/vehicle/{id}
// ============================================================================

/**
 * Vehicle document
 */
export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  document_type: string;
  document_url: string;
  document_name: string | null;
  expiration_date: string | null;
  is_valid: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Response from GET /api/vehicles/documents/vehicle/{id}
 */
export interface VehicleDocumentsData {
  documents: VehicleDocument[];
}

/**
 * Request body for POST /api/vehicles/documents/vehicle/{id}
 */
export interface CreateDocumentRequest {
  document_type: string;
  document_url: string;
  document_name?: string | null;
  expiration_date?: string | null;
  is_valid?: boolean;
}

/**
 * Request body for PUT /api/vehicles/documents/{id}
 */
export interface UpdateDocumentRequest {
  document_type?: string;
  document_url?: string;
  document_name?: string | null;
  expiration_date?: string | null;
  is_valid?: boolean;
}

// ============================================================================
// Vehicle Instructional Video Types
// From GET /api/vehicles/videos/vehicle/{id}
// ============================================================================

/**
 * Vehicle instructional video
 */
export interface VehicleInstructionalVideo {
  id: string;
  vehicle_id: string;
  title: string;
  youtube_url: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Response from GET /api/vehicles/videos/vehicle/{id}
 */
export interface VehicleVideosData {
  videos: VehicleInstructionalVideo[];
}

/**
 * Request body for POST /api/vehicles/videos/vehicle/{id}
 */
export interface CreateVideoRequest {
  title: string;
  youtube_url: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
}

/**
 * Request body for PUT /api/vehicles/videos/{id}
 */
export interface UpdateVideoRequest {
  title?: string;
  youtube_url?: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
}
