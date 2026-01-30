export interface BlockedDay {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedDayListResponse {
  blocked_days: BlockedDay[];
  count: number;
}

export interface CreateBlockedDayRequest {
  start_date: string;
  end_date: string;
  reason?: string;
}
