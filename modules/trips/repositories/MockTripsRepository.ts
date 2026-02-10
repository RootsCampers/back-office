/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ITripsRepository } from "./ITripsRepository";
import type {
  Trip,
  TripsData,
  TripStatus,
  UpdateTripStatusRequest,
  UpdateTripStatusResponse,
  StartTripRequest,
  CompleteTripRequest,
  TripOperationResponse,
  ReviewOwnerTripRequest,
  ReviewOwnerTripResponse,
  ReviewTravelerTripRequest,
  ReviewTravelerTripResponse,
} from "../domain";

import { getCurrentStatus } from "../domain";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function daysFromNow(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
}

function makeStatuses(entries: [string, number][]): TripStatus[] {
  return entries.map(([status, daysAgo], i) => ({
    id: `ts-${i}`,
    status,
    timestamp: daysFromNow(daysAgo),
  }));
}

// ============================================================================
// Mock trip data — cross-referenced with MockBookingsRepository
//
// Trip IDs trip-001..trip-013 map to bookings b-007..b-019
// Additional trips (trip-014..trip-019) are historical with no matching
// booking in the current dashboard view.
// ============================================================================

const MOCK_TRIPS: Trip[] = [
  // ── Scheduled (upcoming, not started) ──────────────────────────────────

  // trip-001: linked to booking b-007 (confirmed)
  {
    id: "trip-001",
    booking_id: "b-007",
    booking_number: "RC-2025-0007",
    start_date: daysFromNow(14),
    end_date: daysFromNow(21),
    total_price: 510000,
    created_at: daysFromNow(-8),
    price_per_day: 72857,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -8]]),
    camper: { id: "c1", name: "Patagonia Explorer", images: [], type: "camper", license_plate: "ABCD-12" },
    traveler: { id: "t5", email: "pedro.diaz@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-002: linked to booking b-008 (confirmed)
  {
    id: "trip-002",
    booking_id: "b-008",
    booking_number: "RC-2025-0008",
    start_date: daysFromNow(8),
    end_date: daysFromNow(15),
    total_price: 455000,
    created_at: daysFromNow(-6),
    price_per_day: 65000,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -6]]),
    camper: { id: "c6", name: "Valle Central", images: [], type: "alcove", license_plate: "UVWX-12" },
    traveler: { id: "t6", email: "lucia.fernandez@outlook.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Ready for pickup ───────────────────────────────────────────────────

  // trip-003: linked to booking b-009 (deposit_pending)
  {
    id: "trip-003",
    booking_id: "b-009",
    booking_number: "RC-2025-0009",
    start_date: daysFromNow(3),
    end_date: daysFromNow(10),
    total_price: 480000,
    created_at: daysFromNow(-12),
    price_per_day: 68571,
    minimum_days: 5,
    statuses: makeStatuses([["scheduled", -12], ["ready_for_pickup", -1]]),
    camper: { id: "c2", name: "Atacama Cruiser", images: [], type: "box_van", license_plate: "EFGH-34" },
    traveler: { id: "t7", email: "marco.vargas@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-004: linked to booking b-010 (deposit_paid)
  {
    id: "trip-004",
    booking_id: "b-010",
    booking_number: "RC-2025-0010",
    start_date: daysFromNow(2),
    end_date: daysFromNow(9),
    total_price: 392000,
    created_at: daysFromNow(-14),
    price_per_day: 56000,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -14], ["ready_for_pickup", -2]]),
    camper: { id: "c3", name: "Lagos Nomad", images: [], type: "semi_integrated", license_plate: "IJKL-56" },
    traveler: { id: "t8", email: "valentina.herrera@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── In progress ────────────────────────────────────────────────────────

  // trip-005: linked to booking b-011 (active, on time)
  {
    id: "trip-005",
    booking_id: "b-011",
    booking_number: "RC-2025-0011",
    start_date: daysFromNow(-3),
    end_date: daysFromNow(4),
    total_price: 525000,
    created_at: daysFromNow(-18),
    start_km: 45200,
    price_per_day: 75000,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -18], ["in_progress", -3]]),
    camper: { id: "c5", name: "Carretera Libre", images: [], type: "camper", license_plate: "QRST-90" },
    traveler: { id: "t9", email: "felipe.castro@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-006: linked to booking b-012 (active, OVERDUE)
  {
    id: "trip-006",
    booking_id: "b-012",
    booking_number: "RC-2025-0012",
    start_date: daysFromNow(-8),
    end_date: daysFromNow(-1),
    total_price: 588000,
    created_at: daysFromNow(-23),
    start_km: 32100,
    price_per_day: 84000,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -23], ["in_progress", -8]]),
    camper: { id: "c7", name: "Ruta del Vino", images: [], type: "with_rooftop_tent", license_plate: "YZAB-34" },
    traveler: { id: "t10", email: "camila.reyes@hotmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-007: linked to booking b-013 (active, OVERDUE)
  {
    id: "trip-007",
    booking_id: "b-013",
    booking_number: "RC-2025-0013",
    start_date: daysFromNow(-10),
    end_date: daysFromNow(-3),
    total_price: 440000,
    created_at: daysFromNow(-26),
    start_km: 67800,
    price_per_day: 62857,
    minimum_days: 5,
    statuses: makeStatuses([["scheduled", -26], ["in_progress", -10]]),
    camper: { id: "c4", name: "Sur Adventurer", images: [], type: "integrated", license_plate: "MNOP-78" },
    traveler: { id: "t11", email: "diego.morales@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Returning ──────────────────────────────────────────────────────────

  // trip-008: linked to booking b-014 (active, returning)
  {
    id: "trip-008",
    booking_id: "b-014",
    booking_number: "RC-2025-0014",
    start_date: daysFromNow(-7),
    end_date: daysFromNow(0),
    total_price: 350000,
    created_at: daysFromNow(-20),
    start_km: 51000,
    price_per_day: 50000,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -20], ["in_progress", -7], ["returning", -1]]),
    camper: { id: "c6", name: "Valle Central", images: [], type: "alcove", license_plate: "UVWX-12" },
    traveler: { id: "t12", email: "sofia.paredes@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Completed ──────────────────────────────────────────────────────────

  // trip-009: linked to booking b-015 (completed, with reviews)
  {
    id: "trip-009",
    booking_id: "b-015",
    booking_number: "RC-2025-0015",
    start_date: daysFromNow(-14),
    end_date: daysFromNow(-7),
    total_price: 420000,
    created_at: daysFromNow(-28),
    start_km: 15000,
    end_km: 17350,
    total_km: 2350,
    price_per_day: 60000,
    minimum_days: 5,
    statuses: makeStatuses([["scheduled", -28], ["in_progress", -14], ["completed", -7]]),
    camper: { id: "c2", name: "Atacama Cruiser", images: [], type: "box_van", license_plate: "EFGH-34" },
    traveler: { id: "t13", email: "jorge.soto@gmail.com" },
    owner_review: { id: "r1", rating: 5, comment: "Excelente viajero, dejó todo impecable", created_at: daysFromNow(-6) },
    traveler_review: { id: "r2", owner_rating: 5, owner_comment: "Gran servicio y comunicación", camper_rating: 4, camper_comment: "Muy bien equipada", created_at: daysFromNow(-6) },
    can_review: false,
  },

  // trip-010: linked to booking b-016 (completed, with owner review)
  {
    id: "trip-010",
    booking_id: "b-016",
    booking_number: "RC-2025-0016",
    start_date: daysFromNow(-21),
    end_date: daysFromNow(-14),
    total_price: 385000,
    created_at: daysFromNow(-38),
    start_km: 22000,
    end_km: 24800,
    total_km: 2800,
    price_per_day: 55000,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -38], ["in_progress", -21], ["completed", -14]]),
    camper: { id: "c1", name: "Patagonia Explorer", images: [], type: "camper", license_plate: "ABCD-12" },
    traveler: { id: "t14", email: "carmen.rojas@outlook.com" },
    owner_review: { id: "r3", rating: 4, comment: "Buen viajero, puntual", created_at: daysFromNow(-13) },
    traveler_review: null,
    can_review: false,
  },

  // trip-011: linked to booking b-017 (completed, can review)
  {
    id: "trip-011",
    booking_id: "b-017",
    booking_number: "RC-2025-0017",
    start_date: daysFromNow(-28),
    end_date: daysFromNow(-21),
    total_price: 475000,
    created_at: daysFromNow(-43),
    start_km: 8000,
    end_km: 10200,
    total_km: 2200,
    price_per_day: 67857,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -43], ["in_progress", -28], ["completed", -21]]),
    camper: { id: "c5", name: "Carretera Libre", images: [], type: "camper", license_plate: "QRST-90" },
    traveler: { id: "t16", email: "marta.nunez@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: true,
  },

  // trip-012: linked to booking b-018 (completed)
  {
    id: "trip-012",
    booking_id: "b-018",
    booking_number: "RC-2025-0018",
    start_date: daysFromNow(-35),
    end_date: daysFromNow(-28),
    total_price: 510000,
    created_at: daysFromNow(-48),
    start_km: 3000,
    end_km: 5400,
    total_km: 2400,
    price_per_day: 72857,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -48], ["in_progress", -35], ["completed", -28]]),
    camper: { id: "c3", name: "Lagos Nomad", images: [], type: "semi_integrated", license_plate: "IJKL-56" },
    traveler: { id: "t17", email: "andres.perez@yahoo.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Cancelled ──────────────────────────────────────────────────────────

  // trip-013: linked to booking b-019 (cancelled_by_traveler)
  {
    id: "trip-013",
    booking_id: "b-019",
    booking_number: "RC-2025-0019",
    start_date: daysFromNow(7),
    end_date: daysFromNow(14),
    total_price: 410000,
    created_at: daysFromNow(-10),
    price_per_day: 58571,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -10], ["cancelled_before_start", -3]]),
    camper: { id: "c3", name: "Lagos Nomad", images: [], type: "semi_integrated", license_plate: "IJKL-56" },
    traveler: { id: "t18", email: "isabel.flores@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Historical trips (not linked to current dashboard bookings) ────────

  // trip-014: completed older trip
  {
    id: "trip-014",
    booking_id: "b-old-001",
    booking_number: "RC-2024-0042",
    start_date: daysFromNow(-42),
    end_date: daysFromNow(-35),
    total_price: 380000,
    created_at: daysFromNow(-55),
    start_km: 19000,
    end_km: 21300,
    total_km: 2300,
    price_per_day: 54286,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -55], ["in_progress", -42], ["completed", -35]]),
    camper: { id: "c7", name: "Ruta del Vino", images: [], type: "with_rooftop_tent", license_plate: "YZAB-34" },
    traveler: { id: "t15", email: "roberto.vega@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-015: completed older trip
  {
    id: "trip-015",
    booking_id: "b-old-002",
    booking_number: "RC-2024-0043",
    start_date: daysFromNow(-49),
    end_date: daysFromNow(-42),
    total_price: 595000,
    created_at: daysFromNow(-60),
    start_km: 25000,
    end_km: 27800,
    total_km: 2800,
    price_per_day: 85000,
    minimum_days: 5,
    statuses: makeStatuses([["scheduled", -60], ["in_progress", -49], ["completed", -42]]),
    camper: { id: "c4", name: "Sur Adventurer", images: [], type: "integrated", license_plate: "MNOP-78" },
    traveler: { id: "t19", email: "gabriel.lopez@hotmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-016: completed older trip
  {
    id: "trip-016",
    booking_id: "b-old-003",
    booking_number: "RC-2024-0044",
    start_date: daysFromNow(-56),
    end_date: daysFromNow(-49),
    total_price: 465000,
    created_at: daysFromNow(-65),
    start_km: 11000,
    end_km: 13500,
    total_km: 2500,
    price_per_day: 66429,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -65], ["in_progress", -56], ["completed", -49]]),
    camper: { id: "c2", name: "Atacama Cruiser", images: [], type: "box_van", license_plate: "EFGH-34" },
    traveler: { id: "t21", email: "ricardo.mendoza@gmail.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // trip-017: cancelled during trip (historical)
  {
    id: "trip-017",
    booking_id: "b-old-004",
    booking_number: "RC-2024-0045",
    start_date: daysFromNow(-20),
    end_date: daysFromNow(-13),
    total_price: 480000,
    created_at: daysFromNow(-30),
    start_km: 40000,
    price_per_day: 68571,
    minimum_days: 3,
    statuses: makeStatuses([["scheduled", -30], ["in_progress", -20], ["cancelled_during_trip", -17]]),
    camper: { id: "c5", name: "Carretera Libre", images: [], type: "camper", license_plate: "QRST-90" },
    traveler: { id: "t22", email: "paulina.cortes@outlook.com" },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },
];

export class MockTripsRepository implements ITripsRepository {
  private trips: Trip[] = [...MOCK_TRIPS];

  async fetchTrips(
    _token: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<TripsData> {
    await delay(100);

    let filtered = [...this.trips];

    // Apply status filter
    if (params?.status) {
      filtered = filtered.filter(
        (t) => getCurrentStatus(t) === params.status
      );
    }

    const count = filtered.length;

    // Apply pagination
    const limit = params?.limit ?? filtered.length;
    const page = params?.page ?? 1;
    const offset = (page - 1) * limit;
    filtered = filtered.slice(offset, offset + limit);

    return { trips: filtered, count };
  }

  async fetchTripById(id: string, _token: string): Promise<unknown> {
    await delay(100);
    return this.trips.find((t) => t.id === id) ?? null;
  }

  async updateTripStatus(
    id: string,
    data: UpdateTripStatusRequest,
    _token: string
  ): Promise<UpdateTripStatusResponse> {
    await delay(100);
    const trip = this.trips.find((t) => t.id === id);
    if (trip) {
      trip.statuses.push({
        id: `ts-${Date.now()}`,
        status: data.status,
        timestamp: new Date().toISOString(),
      });
    }
    return { success: true, message: "Status updated", km_reading: data.km_reading };
  }

  async fetchPendingConfirmations(_token: string): Promise<unknown> {
    await delay(100);
    return { confirmations: [], count: 0 };
  }

  async confirmBooking(
    _bookingId: string,
    _token: string
  ): Promise<{ success: boolean; message: string }> {
    await delay(100);
    return { success: true, message: "Confirmed" };
  }

  async rejectBooking(
    _bookingId: string,
    _token: string,
    _reason?: string
  ): Promise<{ success: boolean; message: string }> {
    await delay(100);
    return { success: true, message: "Rejected" };
  }

  async startTrip(
    tripId: string,
    data: StartTripRequest,
    _token: string
  ): Promise<TripOperationResponse> {
    await delay(100);
    const trip = this.trips.find((t) => t.id === tripId);
    if (trip) {
      trip.start_km = data.km;
      trip.statuses.push({
        id: `ts-${Date.now()}`,
        status: "in_progress",
        timestamp: new Date().toISOString(),
      });
    }
    return {
      id: tripId,
      booking_id: trip?.booking_id ?? tripId,
      start_km: data.km,
      operational_status: "in_progress",
    };
  }

  async completeTrip(
    tripId: string,
    data: CompleteTripRequest,
    _token: string
  ): Promise<TripOperationResponse> {
    await delay(100);
    const trip = this.trips.find((t) => t.id === tripId);
    if (trip) {
      trip.end_km = data.km;
      trip.total_km = trip.start_km ? data.km - trip.start_km : undefined;
      trip.statuses.push({
        id: `ts-${Date.now()}`,
        status: "completed",
        timestamp: new Date().toISOString(),
      });
    }
    return {
      id: tripId,
      booking_id: trip?.booking_id ?? tripId,
      end_km: data.km,
      operational_status: "completed",
    };
  }

  async reviewOwnerTrip(
    data: ReviewOwnerTripRequest,
    _token: string
  ): Promise<ReviewOwnerTripResponse> {
    await delay(100);
    return { id: `review-${Date.now()}`, ...data };
  }

  async reviewTravelerTrip(
    data: ReviewTravelerTripRequest,
    _token: string
  ): Promise<ReviewTravelerTripResponse> {
    await delay(100);
    return { id: `review-${Date.now()}`, ...data };
  }
}

export function createMockTripsRepository(): ITripsRepository {
  return new MockTripsRepository();
}
