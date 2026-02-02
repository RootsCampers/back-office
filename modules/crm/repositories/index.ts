import type { ILeadRepository } from "./ILeadRepository";
import { LeadRepository } from "./LeadRepository";

export type { ILeadRepository } from "./ILeadRepository";
export type { ListLeadsParams } from "./ILeadRepository";

/**
 * Factory function to create a lead repository.
 * Requires authentication token for API calls.
 */
export function createLeadRepository(token: string): ILeadRepository {
  return new LeadRepository(token);
}
