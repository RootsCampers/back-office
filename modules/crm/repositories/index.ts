import { MockLeadRepository } from "./MockLeadRepository";
// import { LeadRepository } from "./LeadRepository"; // Future: API implementation

export type { ILeadRepository } from "./ILeadRepository";

/**
 * Factory function to create a lead repository.
 * Swap implementation here when rootend endpoints are ready.
 */
export function createLeadRepository() {
  // TODO: When rootend endpoints are ready, swap to:
  // return new LeadRepository();
  return new MockLeadRepository();
}
