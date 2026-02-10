import type { IIncidentsRepository } from "./IIncidentsRepository";
import { MockIncidentsRepository } from "./MockIncidentsRepository";

export type { IIncidentsRepository } from "./IIncidentsRepository";
export { MockIncidentsRepository } from "./MockIncidentsRepository";

// Swap implementation when rootend endpoints are ready
export function createIncidentsRepository(): IIncidentsRepository {
  return new MockIncidentsRepository();
}
