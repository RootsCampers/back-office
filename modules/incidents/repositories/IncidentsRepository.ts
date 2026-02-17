import type { IIncidentsRepository } from "./IIncidentsRepository";
import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type { IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

/**
 * Incidents Repository
 *
 * Responsible for:
 * - Direct HTTP communication with Go backend via Caddy
 * - Endpoint configuration for incidents-related operations
 * - Request/response handling at HTTP level
 *
 * Does NOT handle:
 * - Data transformation
 * - Business logic
 * - Validation
 */
export class IncidentsRepository implements IIncidentsRepository {
  private readonly baseEndpoint = "/api/trips/trip-incidents";

  /**
   * Fetches incidents for authenticated user (admin or owner)
   * Admin sees all incidents, owner sees only their organization's incidents
   *
   * @param token - JWT access token for authentication
   * @param params - Optional filters: status, severity
   * @returns Promise<IncidentsData> - Incidents data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchIncidents(
    token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
    }
  ): Promise<IncidentsData> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.severity) queryParams.severity = params.severity;

    return apiFetchData<IncidentsData>(`${this.baseEndpoint}/dashboard`, {
      method: "GET",
      token,
      params: queryParams,
      cache: "no-store",
      retries: 1,
      defaultValue: { incidents: [], count: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }
}
