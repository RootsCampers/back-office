import type { IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

export interface IIncidentsService {
  fetchIncidents(
    token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
    }
  ): Promise<IncidentsData>;
}
