import type {
  Lead,
  LeadStage,
  CreateLeadData,
  UpdateLeadData,
  LeadStageUpdateData,
  LeadConvertData,
  LeadStatusHistory,
  LeadStats,
  LeadListResponse,
} from "../domain/types";
import type { ListLeadsParams } from "../repositories/ILeadRepository";

/**
 * Service interface for Lead business operations.
 * Matches backend API capabilities.
 */
export interface ILeadService {
  /**
   * List leads with optional filtering
   */
  listLeads(params?: ListLeadsParams): Promise<LeadListResponse>;

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
  moveLeadToStage(id: string, data: LeadStageUpdateData): Promise<Lead>;

  /**
   * Convert lead to a booking
   */
  convertLead(id: string, data: LeadConvertData): Promise<Lead>;

  /**
   * Delete a lead
   */
  deleteLead(id: string): Promise<void>;

  /**
   * Get lead statistics
   */
  getLeadStats(): Promise<LeadStats>;

  /**
   * Get lead status history
   */
  getLeadHistory(id: string): Promise<LeadStatusHistory[]>;
}
