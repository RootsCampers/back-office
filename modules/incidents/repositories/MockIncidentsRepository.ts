import type { IIncidentsRepository } from "./IIncidentsRepository";
import type { Incident, IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function daysFromNow(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString();
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-001",
    trip_id: "trip-105",
    booking_number: "RC-2025-0009",
    type: "breakdown",
    severity: "high",
    status: "open",
    title: "Engine warning light on highway",
    description: "Traveler reports engine warning light turned on while driving on Ruta 5 near Temuco. Vehicle still running but losing power.",
    reported_at: daysFromNow(-1),
    camper: { id: "c5", name: "Carretera Libre", license_plate: "QRST-90" },
    traveler: { id: "t5", email: "pedro.diaz@gmail.com" },
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1),
  },
  {
    id: "inc-002",
    trip_id: "trip-106",
    booking_number: "RC-2025-0010",
    type: "damage",
    severity: "medium",
    status: "open",
    title: "Side mirror damaged at campsite",
    description: "Left side mirror was damaged when maneuvering at a narrow campsite entrance. Mirror housing cracked, mirror glass intact.",
    reported_at: daysFromNow(-2),
    camper: { id: "c6", name: "Valle Central", license_plate: "UVWX-12" },
    traveler: { id: "t6", email: "lucia.fernandez@outlook.com" },
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-2),
  },
  {
    id: "inc-003",
    trip_id: "trip-107",
    booking_number: "RC-2025-0011",
    type: "complaint",
    severity: "low",
    status: "in_progress",
    title: "Refrigerator not cooling properly",
    description: "Traveler reports the fridge is not maintaining temperature. Food going bad. Checking if it's a gas supply or thermostat issue.",
    reported_at: daysFromNow(-3),
    camper: { id: "c7", name: "Ruta del Vino", license_plate: "YZAB-34" },
    traveler: { id: "t7", email: "marco.vargas@gmail.com" },
    created_at: daysFromNow(-3),
    updated_at: daysFromNow(-1),
  },
  {
    id: "inc-004",
    trip_id: "trip-110",
    booking_number: "RC-2025-0012",
    type: "accident",
    severity: "critical",
    status: "in_progress",
    title: "Minor collision in parking lot",
    description: "Low-speed collision with a parked car in a supermarket parking lot. Bumper dented, other driver's car scratched. Police report filed. No injuries.",
    reported_at: daysFromNow(-5),
    camper: { id: "c2", name: "Atacama Cruiser", license_plate: "EFGH-34" },
    traveler: { id: "t10", email: "camila.reyes@hotmail.com" },
    created_at: daysFromNow(-5),
    updated_at: daysFromNow(-2),
  },
  {
    id: "inc-005",
    trip_id: "trip-111",
    booking_number: "RC-2025-0013",
    type: "breakdown",
    severity: "high",
    status: "resolved",
    title: "Flat tire on gravel road",
    description: "Front right tire punctured on gravel road near Puerto Montt. Replaced with spare. Original tire unrepairable.",
    reported_at: daysFromNow(-10),
    resolved_at: daysFromNow(-8),
    camper: { id: "c4", name: "Sur Adventurer", license_plate: "MNOP-78" },
    traveler: { id: "t11", email: "diego.morales@gmail.com" },
    created_at: daysFromNow(-10),
    updated_at: daysFromNow(-8),
  },
  {
    id: "inc-006",
    trip_id: "trip-112",
    booking_number: "RC-2025-0014",
    type: "theft",
    severity: "high",
    status: "resolved",
    title: "Camping chairs stolen from outside camper",
    description: "Two folding chairs left outside overnight were stolen at a free camping spot near Lago Llanquihue. Carabineros report filed.",
    reported_at: daysFromNow(-15),
    resolved_at: daysFromNow(-12),
    camper: { id: "c5", name: "Carretera Libre", license_plate: "QRST-90" },
    traveler: { id: "t12", email: "sofia.paredes@gmail.com" },
    created_at: daysFromNow(-15),
    updated_at: daysFromNow(-12),
  },
  {
    id: "inc-007",
    trip_id: "trip-113",
    booking_number: "RC-2025-0015",
    type: "damage",
    severity: "medium",
    status: "closed",
    title: "Awning fabric torn by wind",
    description: "Strong wind at coastal campsite tore awning fabric. Awning motor still works. Fabric needs replacement.",
    reported_at: daysFromNow(-20),
    resolved_at: daysFromNow(-16),
    camper: { id: "c6", name: "Valle Central", license_plate: "UVWX-12" },
    traveler: { id: "t13", email: "jorge.soto@gmail.com" },
    created_at: daysFromNow(-20),
    updated_at: daysFromNow(-16),
  },
  {
    id: "inc-008",
    trip_id: "trip-114",
    booking_number: "RC-2025-0016",
    type: "complaint",
    severity: "low",
    status: "closed",
    title: "Water heater takes too long",
    description: "Traveler complained about water heater taking 30+ minutes to heat. Normal behavior for this model but traveler expected faster.",
    reported_at: daysFromNow(-25),
    resolved_at: daysFromNow(-24),
    camper: { id: "c1", name: "Patagonia Explorer", license_plate: "ABCD-12" },
    traveler: { id: "t14", email: "carmen.rojas@outlook.com" },
    created_at: daysFromNow(-25),
    updated_at: daysFromNow(-24),
  },
  {
    id: "inc-009",
    trip_id: "trip-105",
    booking_number: "RC-2025-0009",
    type: "other",
    severity: "low",
    status: "open",
    title: "GPS not finding satellite signal",
    description: "Built-in GPS is not connecting to satellites. Traveler using phone navigation as workaround.",
    reported_at: daysFromNow(0),
    camper: { id: "c5", name: "Carretera Libre", license_plate: "QRST-90" },
    traveler: { id: "t5", email: "pedro.diaz@gmail.com" },
    created_at: daysFromNow(0),
    updated_at: daysFromNow(0),
  },
  {
    id: "inc-010",
    trip_id: "trip-108",
    booking_number: "RC-2025-0021",
    type: "damage",
    severity: "medium",
    status: "in_progress",
    title: "Scratch on rear bumper",
    description: "Traveler noticed a scratch on the rear bumper, possibly from backing into a post. Needs paint touch-up.",
    reported_at: daysFromNow(-4),
    camper: { id: "c1", name: "Patagonia Explorer", license_plate: "ABCD-12" },
    traveler: { id: "t8", email: "valentina.herrera@gmail.com" },
    created_at: daysFromNow(-4),
    updated_at: daysFromNow(-2),
  },
  {
    id: "inc-011",
    trip_id: "trip-115",
    booking_number: "RC-2025-0019",
    type: "breakdown",
    severity: "medium",
    status: "closed",
    title: "Battery died overnight",
    description: "Vehicle battery was dead in the morning. Jump-started by a fellow camper. Likely left lights on. Battery tested OK afterward.",
    reported_at: daysFromNow(-30),
    resolved_at: daysFromNow(-30),
    camper: { id: "c7", name: "Ruta del Vino", license_plate: "YZAB-34" },
    traveler: { id: "t15", email: "roberto.vega@gmail.com" },
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-30),
  },
  {
    id: "inc-012",
    trip_id: "trip-116",
    booking_number: "RC-2025-0020",
    type: "complaint",
    severity: "medium",
    status: "closed",
    title: "Cleanliness issues at pickup",
    description: "Traveler reported the vehicle was not adequately cleaned before pickup. Sand and dirt in sleeping area. Discount offered.",
    reported_at: daysFromNow(-35),
    resolved_at: daysFromNow(-34),
    camper: { id: "c4", name: "Sur Adventurer", license_plate: "MNOP-78" },
    traveler: { id: "t16", email: "marta.nunez@gmail.com" },
    created_at: daysFromNow(-35),
    updated_at: daysFromNow(-34),
  },
  {
    id: "inc-013",
    trip_id: "trip-106",
    booking_number: "RC-2025-0010",
    type: "accident",
    severity: "critical",
    status: "open",
    title: "Windshield cracked by rock",
    description: "A rock thrown up by a truck on Ruta 5 cracked the windshield. Crack is spreading. Needs immediate replacement for safety.",
    reported_at: daysFromNow(0),
    camper: { id: "c6", name: "Valle Central", license_plate: "UVWX-12" },
    traveler: { id: "t6", email: "lucia.fernandez@outlook.com" },
    created_at: daysFromNow(0),
    updated_at: daysFromNow(0),
  },
  {
    id: "inc-014",
    trip_id: "trip-117",
    booking_number: "RC-2025-0017",
    type: "damage",
    severity: "low",
    status: "resolved",
    title: "Kitchen cabinet hinge loose",
    description: "Upper kitchen cabinet hinge came loose. Cabinet door still closes but hangs slightly. Quick fix needed.",
    reported_at: daysFromNow(-8),
    resolved_at: daysFromNow(-7),
    camper: { id: "c3", name: "Lagos Nomad", license_plate: "IJKL-56" },
    traveler: { id: "t17", email: "andres.perez@yahoo.com" },
    created_at: daysFromNow(-8),
    updated_at: daysFromNow(-7),
  },
  {
    id: "inc-015",
    trip_id: "trip-109",
    booking_number: "RC-2025-0022",
    type: "other",
    severity: "medium",
    status: "in_progress",
    title: "Unusual noise from rear axle",
    description: "Traveler reports a rhythmic clicking noise from the rear axle area when turning. Vehicle drives normally otherwise. Mechanic inspection scheduled.",
    reported_at: daysFromNow(-1),
    camper: { id: "c3", name: "Lagos Nomad", license_plate: "IJKL-56" },
    traveler: { id: "t9", email: "felipe.castro@gmail.com" },
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(0),
  },
];

export class MockIncidentsRepository implements IIncidentsRepository {
  private incidents: Incident[] = [...MOCK_INCIDENTS];

  async fetchIncidents(
    _token: string,
    params?: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
    }
  ): Promise<IncidentsData> {
    await delay(100);

    let filtered = [...this.incidents];

    if (params?.status) {
      filtered = filtered.filter((i) => i.status === params.status);
    }
    if (params?.severity) {
      filtered = filtered.filter((i) => i.severity === params.severity);
    }

    // Sort by reported_at descending (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
    );

    return { incidents: filtered, count: filtered.length };
  }
}

export function createIncidentsRepository(): IIncidentsRepository {
  return new MockIncidentsRepository();
}
