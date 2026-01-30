export type Location = {
  can_be_dropoff: boolean;
  can_be_pickup: boolean;
  category: string;
  city_id?: string;
  contact_name?: string;
  contact_phone?: string;
  country_code: string;
  description?: string;
  dropoff_fee: number;
  formatted_address: string;
  google_place_id?: string;
  id: string;
  instructions?: string;
  is_active: boolean;
  latitude: number;
  longitude: number;
  name: string;
  operating_hours?: string;
  owner_id: string;
  pickup_fee: number;
  region_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type LocationsData = {
  locations: Location[];
  total: number;
};

export type LocationParams = {
  limit: number;
  offset: number;
};

/**
 * Request body for creating a new location
 */
export type CreateLocationRequest = {
  name: string;
  description?: string;
  category: string;
  google_place_id?: string;
  formatted_address: string;
  country_code: string;
  region_id?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  contact_phone?: string;
  contact_name?: string;
  operating_hours?: string;
  can_be_pickup?: boolean;
  can_be_dropoff?: boolean;
  pickup_fee?: number;
  dropoff_fee?: number;
  is_active?: boolean;
};

/**
 * Request body for updating a location
 */
export type UpdateLocationRequest = {
  name?: string;
  description?: string;
  category?: string;
  google_place_id?: string;
  formatted_address?: string;
  country_code?: string;
  region_id?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  contact_phone?: string;
  contact_name?: string;
  operating_hours?: string;
  can_be_pickup?: boolean;
  can_be_dropoff?: boolean;
  pickup_fee?: number;
  dropoff_fee?: number;
  is_active?: boolean;
};
