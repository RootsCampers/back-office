import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import type { IncidentsData } from "../domain";

const DashboardIncidentSchema = z
  .object({
    id: z.string(),
    trip_id: z.string(),
    booking_number: z.string(),
    incident_type: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    status: z.enum(["open", "in_progress", "resolved", "closed"]),
    title: z.string(),
    description: z.string().nullable().optional(),
    reported_at: z.string().nullable().optional(),
    resolved_at: z.string().nullable().optional(),
    resolution_notes: z.string().nullable().optional(),
    photos: z.array(z.string()).nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
    camper: z.object({
      id: z.string(),
      name: z.string(),
      license_plate: z.string().nullable().optional(),
    }),
    traveler: z.object({
      id: z.string(),
      email: z.string(),
    }),
  })
  .transform(({ incident_type, ...rest }) => ({
    ...rest,
    // Map backend field name to frontend field name
    type: incident_type,
    description: rest.description ?? undefined,
    reported_at: rest.reported_at ?? undefined,
    resolved_at: rest.resolved_at ?? undefined,
    resolution_notes: rest.resolution_notes ?? undefined,
    photos: rest.photos ?? undefined,
    created_at: rest.created_at ?? undefined,
    updated_at: rest.updated_at ?? undefined,
    camper: {
      ...rest.camper,
      license_plate: rest.camper.license_plate ?? undefined,
    },
  }));

const DashboardIncidentsDataSchema = z.object({
  incidents: z.array(DashboardIncidentSchema),
  count: z.number().int().nonnegative(),
});

export function validateIncidentsDataHandled(data: unknown): IncidentsData {
  try {
    return DashboardIncidentsDataSchema.parse(data) as unknown as IncidentsData;
  } catch (error) {
    handleZodValidationError(error, "incidents");
  }
}
