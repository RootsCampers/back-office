export interface AdvertisingExtra {
  id: string;
  advertising_id: number;
  name: string;
  description: string | null;
  price_per_day: number;
  max_quantity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdvertisingExtraListResponse {
  extras: AdvertisingExtra[];
  page_size: number;
  total_count: number;
}

export interface CreateExtraRequest {
  advertising_id: number;
  name: string;
  description?: string;
  price_per_day: number;
  max_quantity?: number;
  is_active?: boolean;
}

export interface UpdateExtraRequest {
  name?: string;
  description?: string;
  price_per_day?: number;
  max_quantity?: number;
  is_active?: boolean;
}
