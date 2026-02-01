import type {
  Lead,
  CreateLeadData,
  UpdateLeadData,
  LeadStageUpdateData,
  LeadConvertData,
  LeadStatusHistory,
  LeadStats,
  LeadListResponse,
} from "../domain/types";
import type { ILeadRepository, ListLeadsParams } from "./ILeadRepository";

// Mock organization ID for development
const MOCK_ORG_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Mock data for development
 */
const MOCK_LEADS: Lead[] = [
  {
    id: "11111111-1111-1111-1111-111111111001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 555-0101",
    stage: "new_inquiry",
    stageChangedAt: "2026-01-28T10:00:00Z",
    source: "website",
    notes: "Interested in a 2-week trip to Patagonia",
    destination: "Patagonia",
    tripStartDate: "2026-03-15",
    tripEndDate: "2026-03-29",
    travelersCount: 2,
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-28T10:00:00Z",
    updatedAt: "2026-01-28T10:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 555-0102",
    stage: "new_inquiry",
    stageChangedAt: "2026-01-29T14:30:00Z",
    source: "social_media",
    sourceDetail: "Instagram",
    notes: "Family trip with 2 kids",
    travelersCount: 4,
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-29T14:30:00Z",
    updatedAt: "2026-01-29T14:30:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111003",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    stage: "contacted",
    stageChangedAt: "2026-01-30T11:00:00Z",
    source: "referral",
    notes: "Called back, very interested. Budget around $3000",
    destination: "Lake District",
    tripStartDate: "2026-04-01",
    tripEndDate: "2026-04-10",
    assignedTo: "22222222-2222-2222-2222-222222222001",
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-25T09:00:00Z",
    updatedAt: "2026-01-30T11:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111004",
    name: "Emma Davis",
    email: "emma.d@example.com",
    phone: "+44 20 7946 0958",
    stage: "quote_sent",
    stageChangedAt: "2026-01-29T09:00:00Z",
    source: "marketplace",
    sourceDetail: "Google Ads",
    notes: "UK tourist, honeymoon trip",
    destination: "South Island",
    tripStartDate: "2026-05-10",
    tripEndDate: "2026-05-25",
    travelersCount: 2,
    assignedTo: "22222222-2222-2222-2222-222222222002",
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-20T16:00:00Z",
    updatedAt: "2026-01-29T09:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111005",
    name: "Carlos Rodriguez",
    email: "carlos.r@example.com",
    phone: "+56 9 8765 4321",
    stage: "negotiating",
    stageChangedAt: "2026-01-30T15:00:00Z",
    source: "website",
    notes: "Asking for 10% discount for 3-week rental",
    destination: "Atacama Desert",
    tripStartDate: "2026-02-15",
    tripEndDate: "2026-03-08",
    travelersCount: 3,
    assignedTo: "22222222-2222-2222-2222-222222222001",
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-15T12:00:00Z",
    updatedAt: "2026-01-30T15:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111006",
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    stage: "booked",
    stageChangedAt: "2026-01-28T14:00:00Z",
    source: "marketplace",
    sourceDetail: "TripAdvisor",
    destination: "Coastal Route",
    tripStartDate: "2026-02-01",
    tripEndDate: "2026-02-14",
    travelersCount: 2,
    bookingId: "33333333-3333-3333-3333-333333333001",
    convertedAt: "2026-01-28T14:00:00Z",
    assignedTo: "22222222-2222-2222-2222-222222222002",
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111007",
    name: "Tom Brown",
    email: "tom.b@example.com",
    stage: "lost",
    stageChangedAt: "2026-01-25T10:00:00Z",
    source: "website",
    notes: "Found a cheaper option elsewhere",
    lostReason: "Price",
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "11111111-1111-1111-1111-111111111008",
    name: "Anna Martinez",
    email: "anna.m@example.com",
    phone: "+34 612 345 678",
    stage: "contacted",
    stageChangedAt: "2026-01-30T09:00:00Z",
    source: "social_media",
    sourceDetail: "Facebook",
    notes: "Spanish tourist, speaks some English",
    organizationId: MOCK_ORG_ID,
    createdAt: "2026-01-29T11:00:00Z",
    updatedAt: "2026-01-30T09:00:00Z",
  },
];

/**
 * Mock status history
 */
const MOCK_HISTORY: LeadStatusHistory[] = [
  {
    id: "44444444-4444-4444-4444-444444444001",
    leadId: "11111111-1111-1111-1111-111111111006",
    fromStage: "negotiating",
    toStage: "booked",
    changedBy: "22222222-2222-2222-2222-222222222002",
    notes: "Payment received",
    createdAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444002",
    leadId: "11111111-1111-1111-1111-111111111006",
    fromStage: "quote_sent",
    toStage: "negotiating",
    changedBy: "22222222-2222-2222-2222-222222222002",
    createdAt: "2026-01-26T10:00:00Z",
  },
];

/**
 * Mock implementation of ILeadRepository for development.
 * Uses in-memory storage with simulated async operations.
 */
export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[] = [...MOCK_LEADS];
  private history: LeadStatusHistory[] = [...MOCK_HISTORY];

  async list(params?: ListLeadsParams): Promise<LeadListResponse> {
    await this.delay(100);

    let filtered = [...this.leads];

    if (params?.stage) {
      filtered = filtered.filter((lead) => lead.stage === params.stage);
    }

    if (params?.assignedTo) {
      filtered = filtered.filter((lead) => lead.assignedTo === params.assignedTo);
    }

    const total = filtered.length;

    // Apply pagination
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    filtered = filtered.slice(offset, offset + limit);

    return { leads: filtered, total };
  }

  async getById(id: string): Promise<Lead | null> {
    await this.delay(50);
    return this.leads.find((lead) => lead.id === id) || null;
  }

  async create(data: CreateLeadData): Promise<Lead> {
    await this.delay(100);
    const now = new Date().toISOString();
    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      stage: data.stage ?? "new_inquiry",
      stageChangedAt: now,
      assignedTo: data.assignedTo,
      source: data.source,
      sourceDetail: data.sourceDetail,
      tripStartDate: data.tripStartDate,
      tripEndDate: data.tripEndDate,
      destination: data.destination,
      travelersCount: data.travelersCount,
      advertisingId: data.advertisingId,
      notes: data.notes,
      nextFollowUpAt: data.nextFollowUpAt,
      organizationId: MOCK_ORG_ID,
      createdAt: now,
      updatedAt: now,
    };
    this.leads.push(newLead);
    return newLead;
  }

  async update(id: string, data: UpdateLeadData): Promise<Lead> {
    await this.delay(100);
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error(`Lead not found: ${id}`);
    }

    const updated: Lead = {
      ...this.leads[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.leads[index] = updated;
    return updated;
  }

  async updateStage(id: string, data: LeadStageUpdateData): Promise<Lead> {
    await this.delay(100);
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error(`Lead not found: ${id}`);
    }

    const lead = this.leads[index];
    const now = new Date().toISOString();

    // Record history
    this.history.push({
      id: crypto.randomUUID(),
      leadId: id,
      fromStage: lead.stage,
      toStage: data.stage,
      notes: data.notes,
      createdAt: now,
    });

    // Update lead
    const updated: Lead = {
      ...lead,
      stage: data.stage,
      stageChangedAt: now,
      lostReason: data.stage === "lost" ? data.lostReason : lead.lostReason,
      updatedAt: now,
    };
    this.leads[index] = updated;
    return updated;
  }

  async convert(id: string, data: LeadConvertData): Promise<Lead> {
    await this.delay(100);
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error(`Lead not found: ${id}`);
    }

    const now = new Date().toISOString();
    const lead = this.leads[index];

    // Record history
    this.history.push({
      id: crypto.randomUUID(),
      leadId: id,
      fromStage: lead.stage,
      toStage: "booked",
      notes: `Converted to booking ${data.bookingId}`,
      createdAt: now,
    });

    // Update lead
    const updated: Lead = {
      ...lead,
      stage: "booked",
      stageChangedAt: now,
      bookingId: data.bookingId,
      convertedAt: now,
      updatedAt: now,
    };
    this.leads[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.delay(100);
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error(`Lead not found: ${id}`);
    }
    this.leads.splice(index, 1);
  }

  async getStats(): Promise<LeadStats> {
    await this.delay(50);
    return {
      newInquiryCount: this.leads.filter((l) => l.stage === "new_inquiry").length,
      contactedCount: this.leads.filter((l) => l.stage === "contacted").length,
      quoteSentCount: this.leads.filter((l) => l.stage === "quote_sent").length,
      negotiatingCount: this.leads.filter((l) => l.stage === "negotiating").length,
      bookedCount: this.leads.filter((l) => l.stage === "booked").length,
      lostCount: this.leads.filter((l) => l.stage === "lost").length,
      totalCount: this.leads.length,
    };
  }

  async getHistory(id: string): Promise<LeadStatusHistory[]> {
    await this.delay(50);
    return this.history
      .filter((h) => h.leadId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
