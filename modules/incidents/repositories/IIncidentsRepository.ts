import type { IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

export interface IIncidentsRepository {
  fetchIncidents(
    token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
    }
  ): Promise<IncidentsData>;
}
