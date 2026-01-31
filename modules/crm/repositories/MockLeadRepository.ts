import type { Lead, LeadStage, CreateLeadData, UpdateLeadData } from "../domain/types";
import type { ILeadRepository } from "./ILeadRepository";

/**
 * Mock data for development
 */
const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 555-0101",
    stage: "new_inquiry",
    source: "Website",
    notes: "Interested in a 2-week trip to Patagonia",
    vehicleInterest: "Mercedes Sprinter 4x4",
    tripDates: { start: "2026-03-15", end: "2026-03-29" },
    createdAt: "2026-01-28T10:00:00Z",
    updatedAt: "2026-01-28T10:00:00Z",
  },
  {
    id: "lead-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 555-0102",
    stage: "new_inquiry",
    source: "Instagram",
    notes: "Family trip with 2 kids",
    vehicleInterest: "Family Camper",
    createdAt: "2026-01-29T14:30:00Z",
    updatedAt: "2026-01-29T14:30:00Z",
  },
  {
    id: "lead-3",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    stage: "contacted",
    source: "Referral",
    notes: "Called back, very interested. Budget around $3000",
    vehicleInterest: "VW California",
    tripDates: { start: "2026-04-01", end: "2026-04-10" },
    assignedTo: "Ana",
    createdAt: "2026-01-25T09:00:00Z",
    updatedAt: "2026-01-30T11:00:00Z",
  },
  {
    id: "lead-4",
    name: "Emma Davis",
    email: "emma.d@example.com",
    phone: "+44 20 7946 0958",
    stage: "quote_sent",
    source: "Google Ads",
    notes: "UK tourist, honeymoon trip",
    vehicleInterest: "Luxury Motorhome",
    tripDates: { start: "2026-05-10", end: "2026-05-25" },
    quotedPrice: 4500,
    assignedTo: "Carlos",
    createdAt: "2026-01-20T16:00:00Z",
    updatedAt: "2026-01-29T09:00:00Z",
  },
  {
    id: "lead-5",
    name: "Carlos Rodriguez",
    email: "carlos.r@example.com",
    phone: "+56 9 8765 4321",
    stage: "negotiating",
    source: "Website",
    notes: "Asking for 10% discount for 3-week rental",
    vehicleInterest: "Mercedes Sprinter",
    tripDates: { start: "2026-02-15", end: "2026-03-08" },
    quotedPrice: 3800,
    assignedTo: "Ana",
    createdAt: "2026-01-15T12:00:00Z",
    updatedAt: "2026-01-30T15:00:00Z",
  },
  {
    id: "lead-6",
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    stage: "booked",
    source: "TripAdvisor",
    vehicleInterest: "Compact Camper",
    tripDates: { start: "2026-02-01", end: "2026-02-14" },
    quotedPrice: 2100,
    assignedTo: "Carlos",
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "lead-7",
    name: "Tom Brown",
    email: "tom.b@example.com",
    stage: "lost",
    source: "Website",
    notes: "Found a cheaper option elsewhere",
    lostReason: "Price",
    vehicleInterest: "Budget Van",
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "lead-8",
    name: "Anna Martinez",
    email: "anna.m@example.com",
    phone: "+34 612 345 678",
    stage: "contacted",
    source: "Facebook",
    notes: "Spanish tourist, speaks some English",
    vehicleInterest: "Any available",
    createdAt: "2026-01-29T11:00:00Z",
    updatedAt: "2026-01-30T09:00:00Z",
  },
];

/**
 * Mock implementation of ILeadRepository for development.
 * Uses in-memory storage with simulated async operations.
 */
export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[] = [...MOCK_LEADS];

  async getAll(): Promise<Lead[]> {
    // Simulate network delay
    await this.delay(100);
    return [...this.leads];
  }

  async getById(id: string): Promise<Lead | null> {
    await this.delay(50);
    return this.leads.find((lead) => lead.id === id) || null;
  }

  async getByStage(stage: LeadStage): Promise<Lead[]> {
    await this.delay(50);
    return this.leads.filter((lead) => lead.stage === stage);
  }

  async create(data: CreateLeadData): Promise<Lead> {
    await this.delay(100);
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...data,
      stage: "new_inquiry",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    this.leads[index] = {
      ...this.leads[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.leads[index];
  }

  async updateStage(id: string, stage: LeadStage): Promise<Lead> {
    return this.update(id, { stage });
  }

  async delete(id: string): Promise<void> {
    await this.delay(100);
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error(`Lead not found: ${id}`);
    }
    this.leads.splice(index, 1);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
