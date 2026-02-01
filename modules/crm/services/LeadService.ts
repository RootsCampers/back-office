// Type imports from own module
import type { ILeadService } from "./ILeadService";
import type { ILeadRepository, ListLeadsParams } from "../repositories/ILeadRepository";
import type {
  Lead,
  LeadStage,
  CreateLeadData,
  UpdateLeadData,
  LeadStageUpdateData,
  LeadConvertData,
  LeadStatusHistory,
  LeadStats,
  LeadListResponse,
} from "../domain/types";

// Implementation imports from own module
import { LEAD_STAGES } from "../domain/types";
import { createLeadRepository } from "../repositories";

/**
 * Lead service implementation.
 * Handles business logic and coordinates repository operations.
 */
export class LeadService implements ILeadService {
  constructor(private readonly repository: ILeadRepository) {}

  async listLeads(params?: ListLeadsParams): Promise<LeadListResponse> {
    return this.repository.list(params);
  }

  async getLeadsGroupedByStage(): Promise<Record<LeadStage, Lead[]>> {
    const { leads } = await this.repository.list({ limit: 1000 });

    // Initialize all stages with empty arrays
    const grouped: Record<LeadStage, Lead[]> = LEAD_STAGES.reduce(
      (acc, stage) => {
        acc[stage] = [];
        return acc;
      },
      {} as Record<LeadStage, Lead[]>
    );

    // Group leads by stage
    for (const lead of leads) {
      grouped[lead.stage].push(lead);
    }

    // Sort leads within each stage by updatedAt (most recent first)
    for (const stage of LEAD_STAGES) {
      grouped[stage].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return grouped;
  }

  async getLeadById(id: string): Promise<Lead | null> {
    return this.repository.getById(id);
  }

  async createLead(data: CreateLeadData): Promise<Lead> {
    return this.repository.create(data);
  }

  async updateLead(id: string, data: UpdateLeadData): Promise<Lead> {
    return this.repository.update(id, data);
  }

  async moveLeadToStage(id: string, data: LeadStageUpdateData): Promise<Lead> {
    return this.repository.updateStage(id, data);
  }

  async convertLead(id: string, data: LeadConvertData): Promise<Lead> {
    return this.repository.convert(id, data);
  }

  async deleteLead(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async getLeadStats(): Promise<LeadStats> {
    return this.repository.getStats();
  }

  async getLeadHistory(id: string): Promise<LeadStatusHistory[]> {
    return this.repository.getHistory(id);
  }
}

/**
 * Factory function to create a lead service.
 * Requires authentication token for API calls.
 */
export function createLeadService(token: string): ILeadService {
  const repository = createLeadRepository(token);
  return new LeadService(repository);
}
