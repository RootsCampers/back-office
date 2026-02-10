import type { ITripsRepository } from "./ITripsRepository";
import { TripsRepository } from "./TripsRepository";

export type { ITripsRepository } from "./ITripsRepository";
export { TripsRepository } from "./TripsRepository";
export { MockTripsRepository } from "./MockTripsRepository";

// Swap implementation when rootend endpoints are ready
export function createTripsRepository(): ITripsRepository {
  return new TripsRepository();
}
