import type { IBookingsRepository } from "./IBookingsRepository";
import { MockBookingsRepository } from "./MockBookingsRepository";
// import { BookingsRepository } from "./BookingsRepository";

export type { IBookingsRepository } from "./IBookingsRepository";
export { BookingsRepository } from "./BookingsRepository";
export { MockBookingsRepository } from "./MockBookingsRepository";

// Swap implementation when rootend endpoints are ready
export function createBookingRepository(): IBookingsRepository {
  return new MockBookingsRepository();
  // return new BookingsRepository();
}
