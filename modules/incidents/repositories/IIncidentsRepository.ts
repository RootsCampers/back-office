import type { IncidentStatus, IncidentSeverity } from "../domain";

export interface IIncidentsRepository {
  fetchIncidents(
    token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
      limit?: number;
      offset?: number;
    }
  ): Promise<unknown>;
}
