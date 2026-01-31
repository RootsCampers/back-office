import type { Lead, LeadStage, CreateLeadData, UpdateLeadData } from "../domain/types";

/**
 * Repository interface for Lead operations.
 * Implementations can be mock (development) or API-based (production).
 */
export interface ILeadRepository {
  /**
   * Get all leads
   */
  getAll(): Promise<Lead[]>;

  /**
   * Get a lead by ID
   */
  getById(id: string): Promise<Lead | null>;

  /**
   * Get leads by stage
   */
  getByStage(stage: LeadStage): Promise<Lead[]>;

  /**
   * Create a new lead
   */
  create(data: CreateLeadData): Promise<Lead>;

  /**
   * Update an existing lead
   */
  update(id: string, data: UpdateLeadData): Promise<Lead>;

  /**
   * Update lead stage (for drag-and-drop)
   */
  updateStage(id: string, stage: LeadStage): Promise<Lead>;

  /**
   * Delete a lead
   */
  delete(id: string): Promise<void>;
}
