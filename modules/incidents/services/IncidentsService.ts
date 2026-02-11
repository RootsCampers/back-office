import type { IIncidentsService } from "./IIncidentsService";
import type { IIncidentsRepository } from "../repositories";
import type { IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

import { createIncidentsRepository } from "../repositories";
import { validateIncidentsDataHandled } from "../validators";

export class IncidentsService implements IIncidentsService {
  private readonly repository: IIncidentsRepository;

  constructor(repository?: IIncidentsRepository) {
    this.repository = repository ?? createIncidentsRepository();
  }

  async fetchIncidents(
    token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
    }
  ): Promise<IncidentsData> {
    const rawData = await this.repository.fetchIncidents(token, params);
    return validateIncidentsDataHandled(rawData);
  }
}

export function createIncidentsService(): IIncidentsService {
  return new IncidentsService();
}
