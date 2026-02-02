// Type imports from own module
import type { ILeadRepository, ListLeadsParams } from "./ILeadRepository";
import type {
  Lead,
  CreateLeadData,
  UpdateLeadData,
  LeadStageUpdateData,
  LeadConvertData,
  LeadStatusHistory,
  LeadStats,
  LeadListResponse,
} from "../domain/types";

// Shared library imports
import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

// =============================================================================
// API Response Types (snake_case from backend)
// =============================================================================

interface ApiLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  stage: string;
  stage_changed_at: string;
  assigned_to?: string;
  source?: string;
  source_detail?: string;
  trip_start_date?: string;
  trip_end_date?: string;
  destination?: string;
  travelers_count?: number;
  advertising_id?: number;
  notes?: string;
  next_follow_up_at?: string;
  lost_reason?: string;
  booking_id?: string;
  converted_at?: string;
  organization_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface ApiLeadListResponse {
  leads: ApiLead[];
  total: number;
}

interface ApiLeadStatusHistory {
  id: string;
  lead_id: string;
  from_stage?: string;
  to_stage: string;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

interface ApiLeadStats {
  new_inquiry_count: number;
  contacted_count: number;
  quote_sent_count: number;
  negotiating_count: number;
  booked_count: number;
  lost_count: number;
  total_count: number;
}

// =============================================================================
// Mappers: API (snake_case) -> Frontend (camelCase)
// =============================================================================

function mapLeadFromApi(apiLead: ApiLead): Lead {
  return {
    id: apiLead.id,
    name: apiLead.name,
    email: apiLead.email,
    phone: apiLead.phone,
    stage: apiLead.stage as Lead["stage"],
    stageChangedAt: apiLead.stage_changed_at,
    assignedTo: apiLead.assigned_to,
    source: apiLead.source as Lead["source"],
    sourceDetail: apiLead.source_detail,
    tripStartDate: apiLead.trip_start_date,
    tripEndDate: apiLead.trip_end_date,
    destination: apiLead.destination,
    travelersCount: apiLead.travelers_count,
    advertisingId: apiLead.advertising_id,
    notes: apiLead.notes,
    nextFollowUpAt: apiLead.next_follow_up_at,
    lostReason: apiLead.lost_reason,
    bookingId: apiLead.booking_id,
    convertedAt: apiLead.converted_at,
    organizationId: apiLead.organization_id,
    createdBy: apiLead.created_by,
    createdAt: apiLead.created_at,
    updatedAt: apiLead.updated_at,
  };
}

function mapLeadStatusHistoryFromApi(
  apiHistory: ApiLeadStatusHistory
): LeadStatusHistory {
  return {
    id: apiHistory.id,
    leadId: apiHistory.lead_id,
    fromStage: apiHistory.from_stage as LeadStatusHistory["fromStage"],
    toStage: apiHistory.to_stage as LeadStatusHistory["toStage"],
    changedBy: apiHistory.changed_by,
    notes: apiHistory.notes,
    createdAt: apiHistory.created_at,
  };
}

function mapLeadStatsFromApi(apiStats: ApiLeadStats): LeadStats {
  return {
    newInquiryCount: apiStats.new_inquiry_count,
    contactedCount: apiStats.contacted_count,
    quoteSentCount: apiStats.quote_sent_count,
    negotiatingCount: apiStats.negotiating_count,
    bookedCount: apiStats.booked_count,
    lostCount: apiStats.lost_count,
    totalCount: apiStats.total_count,
  };
}

// =============================================================================
// Mappers: Frontend (camelCase) -> API (snake_case)
// =============================================================================

function mapCreateLeadToApi(
  data: CreateLeadData
): Record<string, unknown> {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    stage: data.stage,
    assigned_to: data.assignedTo,
    source: data.source,
    source_detail: data.sourceDetail,
    trip_start_date: data.tripStartDate,
    trip_end_date: data.tripEndDate,
    destination: data.destination,
    travelers_count: data.travelersCount,
    advertising_id: data.advertisingId,
    notes: data.notes,
    next_follow_up_at: data.nextFollowUpAt,
  };
}

function mapUpdateLeadToApi(
  data: UpdateLeadData
): Record<string, unknown> {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    assigned_to: data.assignedTo,
    source: data.source,
    source_detail: data.sourceDetail,
    trip_start_date: data.tripStartDate,
    trip_end_date: data.tripEndDate,
    destination: data.destination,
    travelers_count: data.travelersCount,
    advertising_id: data.advertisingId,
    notes: data.notes,
    next_follow_up_at: data.nextFollowUpAt,
  };
}

function mapStageUpdateToApi(
  data: LeadStageUpdateData
): Record<string, unknown> {
  return {
    stage: data.stage,
    lost_reason: data.lostReason,
    notes: data.notes,
  };
}

function mapConvertToApi(data: LeadConvertData): Record<string, unknown> {
  return {
    booking_id: data.bookingId,
  };
}

// =============================================================================
// Repository Implementation
// =============================================================================

/**
 * Lead repository implementation that calls the rootend API.
 */
export class LeadRepository implements ILeadRepository {
  private readonly baseEndpoint = "/api/crm/leads";

  constructor(private readonly token: string) {}

  async list(params?: ListLeadsParams): Promise<LeadListResponse> {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params?.stage) {
      queryParams.stage = params.stage;
    }
    if (params?.assignedTo) {
      queryParams.assigned_to = params.assignedTo;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }
    if (params?.offset) {
      queryParams.offset = params.offset;
    }

    const response = await apiFetchData<ApiLeadListResponse>(this.baseEndpoint, {
      method: "GET",
      params: queryParams,
      token: this.token,
      cache: "no-store",
      errorCode: ERROR_CODES.FETCH_FAILED,
    });

    return {
      leads: response.leads.map(mapLeadFromApi),
      total: response.total,
    };
  }

  async getById(id: string): Promise<Lead | null> {
    try {
      const response = await apiFetchData<ApiLead>(`${this.baseEndpoint}/${id}`, {
        method: "GET",
        token: this.token,
        cache: "no-store",
        errorCode: ERROR_CODES.FETCH_FAILED,
      });
      return mapLeadFromApi(response);
    } catch (error) {
      // Return null for 404 errors
      if (error instanceof Error && error.message.includes("not_found")) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreateLeadData): Promise<Lead> {
    const response = await apiFetchData<ApiLead>(this.baseEndpoint, {
      method: "POST",
      data: mapCreateLeadToApi(data),
      token: this.token,
      cache: "no-store",
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
    return mapLeadFromApi(response);
  }

  async update(id: string, data: UpdateLeadData): Promise<Lead> {
    const response = await apiFetchData<ApiLead>(`${this.baseEndpoint}/${id}`, {
      method: "PUT",
      data: mapUpdateLeadToApi(data),
      token: this.token,
      cache: "no-store",
      errorCode: ERROR_CODES.UPDATE_FAILED,
    });
    return mapLeadFromApi(response);
  }

  async updateStage(id: string, data: LeadStageUpdateData): Promise<Lead> {
    const response = await apiFetchData<ApiLead>(
      `${this.baseEndpoint}/${id}/stage`,
      {
        method: "POST",
        data: mapStageUpdateToApi(data),
        token: this.token,
        cache: "no-store",
        errorCode: ERROR_CODES.UPDATE_FAILED,
      }
    );
    return mapLeadFromApi(response);
  }

  async convert(id: string, data: LeadConvertData): Promise<Lead> {
    const response = await apiFetchData<ApiLead>(
      `${this.baseEndpoint}/${id}/convert`,
      {
        method: "POST",
        data: mapConvertToApi(data),
        token: this.token,
        cache: "no-store",
        errorCode: ERROR_CODES.UPDATE_FAILED,
      }
    );
    return mapLeadFromApi(response);
  }

  async delete(id: string): Promise<void> {
    await apiFetchData<void>(`${this.baseEndpoint}/${id}`, {
      method: "DELETE",
      token: this.token,
      cache: "no-store",
      errorCode: ERROR_CODES.DELETION_FAILED,
    });
  }

  async getStats(): Promise<LeadStats> {
    const response = await apiFetchData<ApiLeadStats>(
      `${this.baseEndpoint}/stats`,
      {
        method: "GET",
        token: this.token,
        cache: "no-store",
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
    return mapLeadStatsFromApi(response);
  }

  async getHistory(id: string): Promise<LeadStatusHistory[]> {
    const response = await apiFetchData<ApiLeadStatusHistory[]>(
      `${this.baseEndpoint}/${id}/history`,
      {
        method: "GET",
        token: this.token,
        cache: "no-store",
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
    return response.map(mapLeadStatusHistoryFromApi);
  }
}
