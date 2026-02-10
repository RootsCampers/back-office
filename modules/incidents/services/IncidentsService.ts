import type { IIncidentsService } from "./IIncidentsService";
import type { IIncidentsRepository } from "../repositories";
import type { IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

import { createIncidentsRepository } from "../repositories";

export class IncidentsService implements IIncidentsService {
  private readonly repository: IIncidentsRepository;

  constructor(repository?: IIncidentsRepository) {
    this.repository = repository ?? createIncidentsRepository();
  }

  async fetchIncidents(
    _token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
    }
  ): Promise<IncidentsData> {
    return this.repository.fetchIncidents(params);
  }
}

export function createIncidentsService(): IIncidentsService {
  return new IncidentsService();
}
