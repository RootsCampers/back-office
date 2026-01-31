import type { Lead, LeadStage, CreateLeadData, UpdateLeadData } from "../domain/types";

/**
 * Service interface for Lead business operations.
 */
export interface ILeadService {
  /**
   * Get all leads
   */
  getLeads(): Promise<Lead[]>;

  /**
   * Get leads grouped by stage (for Kanban view)
   */
  getLeadsGroupedByStage(): Promise<Record<LeadStage, Lead[]>>;

  /**
   * Get a lead by ID
   */
  getLeadById(id: string): Promise<Lead | null>;

  /**
   * Create a new lead
   */
  createLead(data: CreateLeadData): Promise<Lead>;

  /**
   * Update an existing lead
   */
  updateLead(id: string, data: UpdateLeadData): Promise<Lead>;

  /**
   * Move lead to a different stage (for drag-and-drop)
   */
  moveLeadToStage(id: string, stage: LeadStage): Promise<Lead>;

  /**
   * Delete a lead
   */
  deleteLead(id: string): Promise<void>;
}
