/**
 * CRM Lead Stages for Traveler Booking Funnel
 */
export type LeadStage =
  | "new_inquiry"
  | "contacted"
  | "quote_sent"
  | "negotiating"
  | "booked"
  | "lost";

export const LEAD_STAGES: LeadStage[] = [
  "new_inquiry",
  "contacted",
  "quote_sent",
  "negotiating",
  "booked",
  "lost",
];

export const LEAD_STAGE_CONFIG: Record<
  LeadStage,
  { label: string; color: string; bgColor: string }
> = {
  new_inquiry: {
    label: "New Inquiry",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  contacted: {
    label: "Contacted",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  quote_sent: {
    label: "Quote Sent",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  negotiating: {
    label: "Negotiating",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
  },
  booked: {
    label: "Booked",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
  },
  lost: {
    label: "Lost",
    color: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200",
  },
};

/**
 * Lead represents a potential traveler booking
 */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: LeadStage;
  source: string;
  notes?: string;
  vehicleInterest?: string;
  tripDates?: {
    start: string;
    end: string;
  };
  quotedPrice?: number;
  lostReason?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  source: string;
  notes?: string;
  vehicleInterest?: string;
  tripDates?: {
    start: string;
    end: string;
  };
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  phone?: string;
  stage?: LeadStage;
  source?: string;
  notes?: string;
  vehicleInterest?: string;
  tripDates?: {
    start: string;
    end: string;
  };
  quotedPrice?: number;
  lostReason?: string;
  assignedTo?: string;
}
