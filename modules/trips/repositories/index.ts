import type { ITripsRepository } from "./ITripsRepository";
import { MockTripsRepository } from "./MockTripsRepository";
// import { TripsRepository } from "./TripsRepository";

export type { ITripsRepository } from "./ITripsRepository";
export { TripsRepository } from "./TripsRepository";
export { MockTripsRepository, getCurrentStatus } from "./MockTripsRepository";

// Swap implementation when rootend endpoints are ready
export function createTripsRepository(): ITripsRepository {
  return new MockTripsRepository();
  // return new TripsRepository();
}
