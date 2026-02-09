import type { IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

export interface IIncidentsRepository {
  fetchIncidents(params?: {
    status?: IncidentStatus;
    severity?: IncidentSeverity;
  }): Promise<IncidentsData>;
}
