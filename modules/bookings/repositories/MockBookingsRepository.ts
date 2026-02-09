/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IBookingsRepository } from "./IBookingsRepository";
import type {
  DashboardBooking,
  DashboardBookingCamper,
  DashboardBookingTraveler,
  DashboardBookingsData,
  BookingStatus,
} from "../domain";

import { TripOperationalStatus } from "@/modules/shared/domain/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function daysFromNow(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
}

// ============================================================================
// Shared camper & traveler data (consistent with MockTripsRepository)
// ============================================================================

const CAMPERS: Record<string, DashboardBookingCamper> = {
  c1: { id: "c1", name: "Patagonia Explorer", images: [], type: "camper", license_plate: "ABCD-12" },
  c2: { id: "c2", name: "Atacama Cruiser", images: [], type: "box_van", license_plate: "EFGH-34" },
  c3: { id: "c3", name: "Lagos Nomad", images: [], type: "semi_integrated", license_plate: "IJKL-56" },
  c4: { id: "c4", name: "Sur Adventurer", images: [], type: "integrated", license_plate: "MNOP-78" },
  c5: { id: "c5", name: "Carretera Libre", images: [], type: "camper", license_plate: "QRST-90" },
  c6: { id: "c6", name: "Valle Central", images: [], type: "alcove", license_plate: "UVWX-12" },
  c7: { id: "c7", name: "Ruta del Vino", images: [], type: "with_rooftop_tent", license_plate: "YZAB-34" },
};

const TRAVELERS: Record<string, DashboardBookingTraveler> = {
  t1: { id: "t1", email: "carlos.munoz@gmail.com" },
  t2: { id: "t2", email: "maria.silva@hotmail.com" },
  t3: { id: "t3", email: "jose.gonzalez@gmail.com" },
  t4: { id: "t4", email: "ana.rodriguez@yahoo.com" },
  t5: { id: "t5", email: "pedro.diaz@gmail.com" },
  t6: { id: "t6", email: "lucia.fernandez@outlook.com" },
  t7: { id: "t7", email: "marco.vargas@gmail.com" },
  t8: { id: "t8", email: "valentina.herrera@gmail.com" },
  t9: { id: "t9", email: "felipe.castro@gmail.com" },
  t10: { id: "t10", email: "camila.reyes@hotmail.com" },
  t11: { id: "t11", email: "diego.morales@gmail.com" },
  t12: { id: "t12", email: "sofia.paredes@gmail.com" },
  t13: { id: "t13", email: "jorge.soto@gmail.com" },
  t14: { id: "t14", email: "carmen.rojas@outlook.com" },
  t15: { id: "t15", email: "roberto.vega@gmail.com" },
  t16: { id: "t16", email: "marta.nunez@gmail.com" },
  t17: { id: "t17", email: "andres.perez@yahoo.com" },
  t18: { id: "t18", email: "isabel.flores@gmail.com" },
  t19: { id: "t19", email: "gabriel.lopez@hotmail.com" },
  t20: { id: "t20", email: "natalia.torres@gmail.com" },
  t21: { id: "t21", email: "ricardo.mendoza@gmail.com" },
  t22: { id: "t22", email: "paulina.cortes@outlook.com" },
};

// ============================================================================
// Mock booking data — cross-referenced with MockTripsRepository
//
// Status flow: pending_payment → paid → confirmed → deposit_pending →
//              deposit_paid → active → completed
// Payment flow: pending → processing → approved
// Trip created when booking reaches "confirmed"
// ============================================================================

const MOCK_BOOKINGS: DashboardBooking[] = [
  // ── Payment flow (no trip yet) ──────────────────────────────────────────

  // 1. Brand new booking, payment not started
  {
    id: "b-001",
    booking_number: "RC-2025-0001",
    start_date: daysFromNow(14),
    end_date: daysFromNow(21),
    total_price: 490000,
    created_at: daysFromNow(-1),
    status: "pending_payment",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-1) },
    ],
    payment: { id: "pay-001", status: "pending", provider: "mercado_pago", type: "booking_payment", amount: 490000, created_at: daysFromNow(-1) },
    camper: CAMPERS.c1,
    traveler: TRAVELERS.t1,
    advertising: { id: 1, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 2. Another pending payment
  {
    id: "b-002",
    booking_number: "RC-2025-0002",
    start_date: daysFromNow(20),
    end_date: daysFromNow(27),
    total_price: 595000,
    created_at: daysFromNow(0),
    status: "pending_payment",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(0) },
    ],
    payment: { id: "pay-002", status: "pending", provider: "stripe", type: "booking_payment", amount: 595000, created_at: daysFromNow(0) },
    camper: CAMPERS.c4,
    traveler: TRAVELERS.t20,
    advertising: { id: 4, minimum_days: 5 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 3. Payment in process (async provider confirmation)
  {
    id: "b-003",
    booking_number: "RC-2025-0003",
    start_date: daysFromNow(10),
    end_date: daysFromNow(17),
    total_price: 560000,
    created_at: daysFromNow(-3),
    status: "payment_processing",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-3) },
      { id: "s2", status: "payment_processing", timestamp: daysFromNow(-1) },
    ],
    payment: { id: "pay-003", status: "in_process", provider: "mercado_pago", type: "booking_payment", amount: 560000, created_at: daysFromNow(-3) },
    camper: CAMPERS.c2,
    traveler: TRAVELERS.t2,
    advertising: { id: 2, minimum_days: 5 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 4. Payment failed (rejected by provider)
  {
    id: "b-004",
    booking_number: "RC-2025-0004",
    start_date: daysFromNow(12),
    end_date: daysFromNow(19),
    total_price: 450000,
    created_at: daysFromNow(-2),
    status: "payment_failed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-2) },
      { id: "s2", status: "payment_processing", timestamp: daysFromNow(-1) },
      { id: "s3", status: "payment_failed", timestamp: daysFromNow(0) },
    ],
    payment: { id: "pay-004", status: "rejected", provider: "mercado_pago", type: "booking_payment", amount: 450000, created_at: daysFromNow(-2) },
    camper: CAMPERS.c5,
    traveler: TRAVELERS.t15,
    advertising: { id: 5, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Paid, awaiting owner confirmation ───────────────────────────────────

  // 5. Paid, waiting for owner to confirm
  {
    id: "b-005",
    booking_number: "RC-2025-0005",
    start_date: daysFromNow(8),
    end_date: daysFromNow(15),
    total_price: 420000,
    created_at: daysFromNow(-5),
    status: "paid",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-5) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-4) },
    ],
    payment: { id: "pay-005", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 420000, created_at: daysFromNow(-5) },
    camper: CAMPERS.c3,
    traveler: TRAVELERS.t3,
    advertising: { id: 3, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 6. Paid, waiting for owner to confirm
  {
    id: "b-006",
    booking_number: "RC-2025-0006",
    start_date: daysFromNow(5),
    end_date: daysFromNow(12),
    total_price: 630000,
    created_at: daysFromNow(-7),
    status: "paid",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-7) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-6) },
    ],
    payment: { id: "pay-006", status: "approved", provider: "stripe", type: "booking_payment", amount: 630000, created_at: daysFromNow(-7) },
    camper: CAMPERS.c4,
    traveler: TRAVELERS.t4,
    advertising: { id: 4, minimum_days: 5 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Confirmed (trip created, not started yet) ──────────────────────────

  // 7. Confirmed → trip-001 scheduled
  {
    id: "b-007",
    booking_number: "RC-2025-0007",
    start_date: daysFromNow(14),
    end_date: daysFromNow(21),
    total_price: 510000,
    created_at: daysFromNow(-10),
    status: "confirmed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-10) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-9) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-8) },
    ],
    trip_id: "trip-001",
    trip_operational_status: TripOperationalStatus.SCHEDULED,
    payment: { id: "pay-007", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 510000, created_at: daysFromNow(-10) },
    camper: CAMPERS.c1,
    traveler: TRAVELERS.t5,
    advertising: { id: 1, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 8. Confirmed → trip-002 scheduled
  {
    id: "b-008",
    booking_number: "RC-2025-0008",
    start_date: daysFromNow(8),
    end_date: daysFromNow(15),
    total_price: 455000,
    created_at: daysFromNow(-8),
    status: "confirmed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-8) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-7) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-6) },
    ],
    trip_id: "trip-002",
    trip_operational_status: TripOperationalStatus.SCHEDULED,
    payment: { id: "pay-008", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 455000, created_at: daysFromNow(-8) },
    camper: CAMPERS.c6,
    traveler: TRAVELERS.t6,
    advertising: { id: 6, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Deposit flow ───────────────────────────────────────────────────────

  // 9. Deposit pending → trip-003 ready for pickup
  {
    id: "b-009",
    booking_number: "RC-2025-0009",
    start_date: daysFromNow(3),
    end_date: daysFromNow(10),
    total_price: 480000,
    created_at: daysFromNow(-14),
    status: "deposit_pending",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-14) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-13) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-12) },
      { id: "s4", status: "deposit_pending", timestamp: daysFromNow(-3) },
    ],
    trip_id: "trip-003",
    trip_operational_status: TripOperationalStatus.READY_FOR_PICKUP,
    payment: { id: "pay-009", status: "approved", provider: "bank_transfer", type: "booking_payment", amount: 480000, created_at: daysFromNow(-14) },
    camper: CAMPERS.c2,
    traveler: TRAVELERS.t7,
    advertising: { id: 2, minimum_days: 5 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 10. Deposit paid → trip-004 ready for pickup
  {
    id: "b-010",
    booking_number: "RC-2025-0010",
    start_date: daysFromNow(2),
    end_date: daysFromNow(9),
    total_price: 392000,
    created_at: daysFromNow(-16),
    status: "deposit_paid",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-16) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-15) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-14) },
      { id: "s4", status: "deposit_pending", timestamp: daysFromNow(-5) },
      { id: "s5", status: "deposit_paid", timestamp: daysFromNow(-2) },
    ],
    trip_id: "trip-004",
    trip_operational_status: TripOperationalStatus.READY_FOR_PICKUP,
    payment: { id: "pay-010", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 392000, created_at: daysFromNow(-16) },
    camper: CAMPERS.c3,
    traveler: TRAVELERS.t8,
    advertising: { id: 3, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Active (trip in progress) ──────────────────────────────────────────

  // 11. Active → trip-005 in progress (on time)
  {
    id: "b-011",
    booking_number: "RC-2025-0011",
    start_date: daysFromNow(-3),
    end_date: daysFromNow(4),
    total_price: 525000,
    created_at: daysFromNow(-20),
    status: "active",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-20) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-19) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-18) },
      { id: "s4", status: "active", timestamp: daysFromNow(-3) },
    ],
    trip_id: "trip-005",
    trip_operational_status: TripOperationalStatus.IN_PROGRESS,
    start_km: 45200,
    payment: { id: "pay-011", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 525000, created_at: daysFromNow(-20) },
    camper: CAMPERS.c5,
    traveler: TRAVELERS.t9,
    advertising: { id: 5, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 12. Active → trip-006 in progress (OVERDUE — end_date in the past)
  {
    id: "b-012",
    booking_number: "RC-2025-0012",
    start_date: daysFromNow(-8),
    end_date: daysFromNow(-1),
    total_price: 588000,
    created_at: daysFromNow(-25),
    status: "active",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-25) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-24) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-23) },
      { id: "s4", status: "active", timestamp: daysFromNow(-8) },
    ],
    trip_id: "trip-006",
    trip_operational_status: TripOperationalStatus.IN_PROGRESS,
    start_km: 32100,
    payment: { id: "pay-012", status: "approved", provider: "stripe", type: "booking_payment", amount: 588000, created_at: daysFromNow(-25) },
    camper: CAMPERS.c7,
    traveler: TRAVELERS.t10,
    advertising: { id: 7, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 13. Active → trip-007 in progress (OVERDUE)
  {
    id: "b-013",
    booking_number: "RC-2025-0013",
    start_date: daysFromNow(-10),
    end_date: daysFromNow(-3),
    total_price: 440000,
    created_at: daysFromNow(-28),
    status: "active",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-28) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-27) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-26) },
      { id: "s4", status: "active", timestamp: daysFromNow(-10) },
    ],
    trip_id: "trip-007",
    trip_operational_status: TripOperationalStatus.IN_PROGRESS,
    start_km: 67800,
    payment: { id: "pay-013", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 440000, created_at: daysFromNow(-28) },
    camper: CAMPERS.c4,
    traveler: TRAVELERS.t11,
    advertising: { id: 4, minimum_days: 5 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 14. Active → trip-008 returning
  {
    id: "b-014",
    booking_number: "RC-2025-0014",
    start_date: daysFromNow(-7),
    end_date: daysFromNow(0),
    total_price: 350000,
    created_at: daysFromNow(-22),
    status: "active",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-22) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-21) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-20) },
      { id: "s4", status: "active", timestamp: daysFromNow(-7) },
    ],
    trip_id: "trip-008",
    trip_operational_status: TripOperationalStatus.RETURNING,
    start_km: 51000,
    payment: { id: "pay-014", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 350000, created_at: daysFromNow(-22) },
    camper: CAMPERS.c6,
    traveler: TRAVELERS.t12,
    advertising: { id: 6, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Completed ──────────────────────────────────────────────────────────

  // 15. Completed → trip-009 completed (with reviews)
  {
    id: "b-015",
    booking_number: "RC-2025-0015",
    start_date: daysFromNow(-14),
    end_date: daysFromNow(-7),
    total_price: 420000,
    created_at: daysFromNow(-30),
    status: "completed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-30) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-29) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-28) },
      { id: "s4", status: "active", timestamp: daysFromNow(-14) },
      { id: "s5", status: "completed", timestamp: daysFromNow(-7) },
    ],
    trip_id: "trip-009",
    trip_operational_status: TripOperationalStatus.COMPLETED,
    start_km: 15000,
    end_km: 17350,
    total_km: 2350,
    payment: { id: "pay-015", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 420000, created_at: daysFromNow(-30) },
    camper: CAMPERS.c2,
    traveler: TRAVELERS.t13,
    advertising: { id: 2, minimum_days: 5 },
    owner_review: { id: "r1", rating: 5, comment: "Excelente viajero, dejó todo impecable", created_at: daysFromNow(-6) },
    traveler_review: { id: "r2", owner_rating: 5, owner_comment: "Gran servicio y comunicación", camper_rating: 4, camper_comment: "Muy bien equipada", created_at: daysFromNow(-6) },
    can_review: false,
  },

  // 16. Completed → trip-010 completed (with owner review)
  {
    id: "b-016",
    booking_number: "RC-2025-0016",
    start_date: daysFromNow(-21),
    end_date: daysFromNow(-14),
    total_price: 385000,
    created_at: daysFromNow(-40),
    status: "completed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-40) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-39) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-38) },
      { id: "s4", status: "active", timestamp: daysFromNow(-21) },
      { id: "s5", status: "completed", timestamp: daysFromNow(-14) },
    ],
    trip_id: "trip-010",
    trip_operational_status: TripOperationalStatus.COMPLETED,
    start_km: 22000,
    end_km: 24800,
    total_km: 2800,
    payment: { id: "pay-016", status: "approved", provider: "stripe", type: "booking_payment", amount: 385000, created_at: daysFromNow(-40) },
    camper: CAMPERS.c1,
    traveler: TRAVELERS.t14,
    advertising: { id: 1, minimum_days: 3 },
    owner_review: { id: "r3", rating: 4, comment: "Buen viajero, puntual", created_at: daysFromNow(-13) },
    traveler_review: null,
    can_review: false,
  },

  // 17. Completed → trip-011 completed (can review)
  {
    id: "b-017",
    booking_number: "RC-2025-0017",
    start_date: daysFromNow(-28),
    end_date: daysFromNow(-21),
    total_price: 475000,
    created_at: daysFromNow(-45),
    status: "completed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-45) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-44) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-43) },
      { id: "s4", status: "active", timestamp: daysFromNow(-28) },
      { id: "s5", status: "completed", timestamp: daysFromNow(-21) },
    ],
    trip_id: "trip-011",
    trip_operational_status: TripOperationalStatus.COMPLETED,
    start_km: 8000,
    end_km: 10200,
    total_km: 2200,
    payment: { id: "pay-017", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 475000, created_at: daysFromNow(-45) },
    camper: CAMPERS.c5,
    traveler: TRAVELERS.t16,
    advertising: { id: 5, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: true,
  },

  // 18. Completed → trip-012 completed
  {
    id: "b-018",
    booking_number: "RC-2025-0018",
    start_date: daysFromNow(-35),
    end_date: daysFromNow(-28),
    total_price: 510000,
    created_at: daysFromNow(-50),
    status: "completed",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-50) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-49) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-48) },
      { id: "s4", status: "active", timestamp: daysFromNow(-35) },
      { id: "s5", status: "completed", timestamp: daysFromNow(-28) },
    ],
    trip_id: "trip-012",
    trip_operational_status: TripOperationalStatus.COMPLETED,
    start_km: 3000,
    end_km: 5400,
    total_km: 2400,
    payment: { id: "pay-018", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 510000, created_at: daysFromNow(-50) },
    camper: CAMPERS.c3,
    traveler: TRAVELERS.t17,
    advertising: { id: 3, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Cancellation flow ──────────────────────────────────────────────────

  // 19. Cancelled by traveler (was confirmed, trip cancelled before start)
  {
    id: "b-019",
    booking_number: "RC-2025-0019",
    start_date: daysFromNow(7),
    end_date: daysFromNow(14),
    total_price: 410000,
    created_at: daysFromNow(-12),
    status: "cancelled_by_traveler",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-12) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-11) },
      { id: "s3", status: "confirmed", timestamp: daysFromNow(-10) },
      { id: "s4", status: "cancelled_by_traveler", timestamp: daysFromNow(-3) },
    ],
    trip_id: "trip-013",
    trip_operational_status: TripOperationalStatus.CANCELLED_BEFORE_START,
    payment: { id: "pay-019", status: "approved", provider: "mercado_pago", type: "booking_payment", amount: 410000, created_at: daysFromNow(-12) },
    camper: CAMPERS.c3,
    traveler: TRAVELERS.t18,
    advertising: { id: 3, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 20. Cancelled by owner (before trip was created)
  {
    id: "b-020",
    booking_number: "RC-2025-0020",
    start_date: daysFromNow(15),
    end_date: daysFromNow(22),
    total_price: 530000,
    created_at: daysFromNow(-6),
    status: "cancelled_by_owner",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-6) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-5) },
      { id: "s3", status: "cancelled_by_owner", timestamp: daysFromNow(-2) },
    ],
    payment: { id: "pay-020", status: "approved", provider: "stripe", type: "booking_payment", amount: 530000, created_at: daysFromNow(-6) },
    camper: CAMPERS.c4,
    traveler: TRAVELERS.t19,
    advertising: { id: 4, minimum_days: 5 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // ── Refund flow ────────────────────────────────────────────────────────

  // 21. Refund pending
  {
    id: "b-021",
    booking_number: "RC-2025-0021",
    start_date: daysFromNow(9),
    end_date: daysFromNow(16),
    total_price: 465000,
    created_at: daysFromNow(-9),
    status: "refund_pending",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-9) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-8) },
      { id: "s3", status: "cancelled_by_traveler", timestamp: daysFromNow(-4) },
      { id: "s4", status: "refund_pending", timestamp: daysFromNow(-3) },
    ],
    payment: { id: "pay-021", status: "refund_pending", provider: "mercado_pago", type: "booking_payment", amount: 465000, created_at: daysFromNow(-9) },
    camper: CAMPERS.c5,
    traveler: TRAVELERS.t21,
    advertising: { id: 5, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },

  // 22. Fully refunded
  {
    id: "b-022",
    booking_number: "RC-2025-0022",
    start_date: daysFromNow(-10),
    end_date: daysFromNow(-3),
    total_price: 380000,
    created_at: daysFromNow(-25),
    status: "refunded",
    statuses: [
      { id: "s1", status: "pending_payment", timestamp: daysFromNow(-25) },
      { id: "s2", status: "paid", timestamp: daysFromNow(-24) },
      { id: "s3", status: "cancelled_by_system", timestamp: daysFromNow(-12) },
      { id: "s4", status: "refund_pending", timestamp: daysFromNow(-11) },
      { id: "s5", status: "refunded", timestamp: daysFromNow(-5) },
    ],
    payment: { id: "pay-022", status: "refunded", provider: "mercado_pago", type: "booking_payment", amount: 380000, created_at: daysFromNow(-25) },
    camper: CAMPERS.c7,
    traveler: TRAVELERS.t22,
    advertising: { id: 7, minimum_days: 3 },
    owner_review: null,
    traveler_review: null,
    can_review: false,
  },
];

export class MockBookingsRepository implements IBookingsRepository {
  private bookings: DashboardBooking[] = [...MOCK_BOOKINGS];

  async fetchDashboardBookings(
    _token: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<DashboardBookingsData> {
    await delay(100);

    let filtered = [...this.bookings];

    if (params?.status) {
      filtered = filtered.filter((b) => b.status === params.status);
    }

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 25;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return { bookings: paginated, count: filtered.length };
  }

  async fetchPendingConfirmations(_token: string): Promise<unknown> {
    await delay(100);
    const confirmations = this.bookings
      .filter((b) => b.status === "paid")
      .map((b) => ({
        booking_id: b.id,
        traveler_id: b.traveler.id,
        start_date: b.start_date,
        end_date: b.end_date,
        total_price: b.total_price,
        created_at: b.created_at,
        camper_id: b.camper.id,
        camper_name: b.camper.name,
        advertising_name: b.camper.name,
        default_security_deposit: 200000,
        status_timestamp: b.statuses[b.statuses.length - 1].timestamp,
        traveler_full_name: b.traveler.email.split("@")[0].replace(".", " "),
        traveler_nationality: "Chilean",
        traveler_languages: ["Spanish", "English"],
        location_name: "Santiago Centro",
        location_city: "Santiago",
        location_state: "RM",
        location_country: "Chile",
      }));
    return { confirmations };
  }

  async confirmBooking(_token: string, bookingId: string): Promise<unknown> {
    await delay(100);
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = "confirmed" as BookingStatus;
      booking.statuses.push({
        id: `s-${Date.now()}`,
        status: "confirmed",
        timestamp: new Date().toISOString(),
      });
    }
    return {
      booking_id: bookingId,
      from_status: "paid",
      new_status: "confirmed",
      message: "Booking confirmed",
    };
  }

  async rejectBooking(
    _token: string,
    bookingId: string,
    _data?: { reason?: string }
  ): Promise<unknown> {
    await delay(100);
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = "cancelled_by_owner" as BookingStatus;
      booking.statuses.push({
        id: `s-${Date.now()}`,
        status: "cancelled_by_owner",
        timestamp: new Date().toISOString(),
      });
    }
    return {
      booking_id: bookingId,
      from_status: "paid",
      new_status: "cancelled_by_owner",
      message: "Booking rejected",
    };
  }

  async createBooking(_token: string, _data: unknown): Promise<unknown> {
    await delay(100);
    return {};
  }

  async fetchUserBookings(_token: string, _params: unknown): Promise<unknown> {
    await delay(100);
    return { bookings: [], total: 0 };
  }

  async updateBookingStatus(
    _token: string,
    _bookingId: string,
    _data: unknown
  ): Promise<unknown> {
    await delay(100);
    return { success: true, message: "Status updated" };
  }

  async fetchBookingDetail(_token: string, _id: string): Promise<unknown> {
    await delay(100);
    return {};
  }

  async calculateQuote(_data: unknown): Promise<unknown> {
    await delay(100);
    return {};
  }
}

export function createMockBookingsRepository(): IBookingsRepository {
  return new MockBookingsRepository();
}
