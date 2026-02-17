import type { IIncidentsRepository } from "./IIncidentsRepository";
import { IncidentsRepository } from "./IncidentsRepository";

export type { IIncidentsRepository } from "./IIncidentsRepository";
export { IncidentsRepository } from "./IncidentsRepository";
export { MockIncidentsRepository } from "./MockIncidentsRepository";

export function createIncidentsRepository(): IIncidentsRepository {
  return new IncidentsRepository();
}
