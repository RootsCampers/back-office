import type { IIncidentsRepository } from "./IIncidentsRepository";
import type { IncidentStatus, IncidentSeverity } from "../domain";

import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class IncidentsRepository implements IIncidentsRepository {
  private readonly endpoint = "/api/trips/trip-incidents/dashboard";

  async fetchIncidents(
    token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
      limit?: number;
      offset?: number;
    }
  ): Promise<unknown> {
    const queryParams: Record<string, string | number> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.severity) queryParams.severity = params.severity;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.offset !== undefined) queryParams.offset = params.offset;

    return apiFetchData<unknown>(this.endpoint, {
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
