// Type imports from own module (alphabetical)
import type { ILeadService } from "./ILeadService";
import type { ILeadRepository } from "../repositories/ILeadRepository";
import type { CreateLeadData, Lead, LeadStage, UpdateLeadData } from "../domain/types";

// Implementation imports from own module
import { createLeadRepository } from "../repositories";

/**
 * Lead service implementation.
 * Handles business logic and coordinates repository operations.
 */
export class LeadService implements ILeadService {
  constructor(private readonly repository: ILeadRepository) {}

  async getLeads(): Promise<Lead[]> {
    return this.repository.getAll();
  }

  async getLeadsGroupedByStage(): Promise<Record<LeadStage, Lead[]>> {
    const leads = await this.repository.getAll();

    // Initialize all stages with empty arrays
    const grouped: Record<LeadStage, Lead[]> = {
      new_inquiry: [],
      contacted: [],
      quote_sent: [],
      negotiating: [],
      booked: [],
      lost: [],
    };

    // Group leads by stage
    for (const lead of leads) {
      grouped[lead.stage].push(lead);
    }

    // Sort leads within each stage by updatedAt (most recent first)
    for (const stage of Object.keys(grouped) as LeadStage[]) {
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

  async moveLeadToStage(id: string, stage: LeadStage): Promise<Lead> {
    return this.repository.updateStage(id, stage);
  }

  async deleteLead(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

/**
 * Factory function to create a lead service.
 */
export function createLeadService(): ILeadService {
  const repository = createLeadRepository();
  return new LeadService(repository);
}
