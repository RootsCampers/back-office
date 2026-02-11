export type IncidentStatus = "open" | "in_progress" | "resolved" | "closed";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentType =
  | "accident"
  | "breakdown"
  | "damage"
  | "theft"
  | "complaint"
  | "other";

export interface Incident {
  id: string;
  trip_id: string;
  booking_number: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description?: string;
  reported_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
  photos?: string[];
  camper: {
    id: string;
    name: string;
    license_plate?: string;
  };
  traveler: {
    id: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface IncidentsData {
  incidents: Incident[];
  count: number;
}

export const IncidentStatusLabels: Record<IncidentStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const IncidentStatusColors: Record<IncidentStatus, string> = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-amber-100 text-amber-800 border-amber-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-slate-100 text-slate-800 border-slate-200",
};

export const IncidentSeverityLabels: Record<IncidentSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const IncidentSeverityColors: Record<IncidentSeverity, string> = {
  low: "bg-slate-100 text-slate-800 border-slate-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

export const IncidentTypeLabels: Record<IncidentType, string> = {
  accident: "Accident",
  breakdown: "Breakdown",
  damage: "Damage",
  theft: "Theft",
  complaint: "Complaint",
  other: "Other",
};
