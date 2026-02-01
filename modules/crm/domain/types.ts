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
 * Lead source enum - must match backend crm.lead_source enum
 */
export type LeadSource =
  | "website"
  | "referral"
  | "social_media"
  | "marketplace"
  | "phone"
  | "email"
  | "walk_in"
  | "other";

export const LEAD_SOURCES: LeadSource[] = [
  "website",
  "referral",
  "social_media",
  "marketplace",
  "phone",
  "email",
  "walk_in",
  "other",
];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  social_media: "Social Media",
  marketplace: "Marketplace",
  phone: "Phone",
  email: "Email",
  walk_in: "Walk-in",
  other: "Other",
};

/**
 * Lead represents a potential traveler booking
 * Matches backend API: rootend/api/crm/dto/lead.go LeadResponse
 */
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  stage: LeadStage;
  stageChangedAt: string;
  assignedTo?: string;
  source?: LeadSource;
  sourceDetail?: string;
  tripStartDate?: string;
  tripEndDate?: string;
  destination?: string;
  travelersCount?: number;
  advertisingId?: number;
  notes?: string;
  nextFollowUpAt?: string;
  lostReason?: string;
  bookingId?: string;
  convertedAt?: string;
  organizationId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * CreateLeadData matches backend LeadCreateRequest
 */
export interface CreateLeadData {
  name: string;
  email?: string;
  phone?: string;
  stage?: LeadStage;
  assignedTo?: string;
  source?: LeadSource;
  sourceDetail?: string;
  tripStartDate?: string;
  tripEndDate?: string;
  destination?: string;
  travelersCount?: number;
  advertisingId?: number;
  notes?: string;
  nextFollowUpAt?: string;
}

/**
 * UpdateLeadData matches backend LeadUpdateRequest
 */
export interface UpdateLeadData {
  name?: string;
  email?: string;
  phone?: string;
  assignedTo?: string;
  source?: LeadSource;
  sourceDetail?: string;
  tripStartDate?: string;
  tripEndDate?: string;
  destination?: string;
  travelersCount?: number;
  advertisingId?: number;
  notes?: string;
  nextFollowUpAt?: string;
}

/**
 * LeadStageUpdateData matches backend LeadStageUpdateRequest
 */
export interface LeadStageUpdateData {
  stage: LeadStage;
  lostReason?: string;
  notes?: string;
}

/**
 * LeadConvertData matches backend LeadConvertRequest
 */
export interface LeadConvertData {
  bookingId: string;
}

/**
 * LeadStatusHistory matches backend LeadStatusHistoryResponse
 */
export interface LeadStatusHistory {
  id: string;
  leadId: string;
  fromStage?: LeadStage;
  toStage: LeadStage;
  changedBy?: string;
  notes?: string;
  createdAt: string;
}

/**
 * LeadStats matches backend LeadStatsResponse
 */
export interface LeadStats {
  newInquiryCount: number;
  contactedCount: number;
  quoteSentCount: number;
  negotiatingCount: number;
  bookedCount: number;
  lostCount: number;
  totalCount: number;
}

/**
 * LeadListResponse matches backend LeadListResponse
 */
export interface LeadListResponse {
  leads: Lead[];
  total: number;
}
