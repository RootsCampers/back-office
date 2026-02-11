import type { IIncidentsRepository } from "./IIncidentsRepository";
import { IncidentsRepository } from "./IncidentsRepository";

export type { IIncidentsRepository } from "./IIncidentsRepository";
export { MockIncidentsRepository } from "./MockIncidentsRepository";
export { IncidentsRepository } from "./IncidentsRepository";

export function createIncidentsRepository(): IIncidentsRepository {
  return new IncidentsRepository();
}
