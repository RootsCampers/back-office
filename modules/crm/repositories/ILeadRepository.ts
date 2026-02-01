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

/**
 * List leads query parameters
 */
export interface ListLeadsParams {
  stage?: LeadStage;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * Repository interface for Lead operations.
 * Implementations can be mock (development) or API-based (production).
 * Matches backend API: /api/crm/leads
 */
export interface ILeadRepository {
  /**
   * List leads with optional filtering
   * GET /api/crm/leads
   */
  list(params?: ListLeadsParams): Promise<LeadListResponse>;

  /**
   * Get a lead by ID
   * GET /api/crm/leads/{id}
   */
  getById(id: string): Promise<Lead | null>;

  /**
   * Create a new lead
   * POST /api/crm/leads
   */
  create(data: CreateLeadData): Promise<Lead>;

  /**
   * Update an existing lead
   * PUT /api/crm/leads/{id}
   */
  update(id: string, data: UpdateLeadData): Promise<Lead>;

  /**
   * Update lead stage (for drag-and-drop)
   * POST /api/crm/leads/{id}/stage
   */
  updateStage(id: string, data: LeadStageUpdateData): Promise<Lead>;

  /**
   * Convert lead to booking
   * POST /api/crm/leads/{id}/convert
   */
  convert(id: string, data: LeadConvertData): Promise<Lead>;

  /**
   * Delete a lead
   * DELETE /api/crm/leads/{id}
   */
  delete(id: string): Promise<void>;

  /**
   * Get lead statistics
   * GET /api/crm/leads/stats
   */
  getStats(): Promise<LeadStats>;

  /**
   * Get lead status history
   * GET /api/crm/leads/{id}/history
   */
  getHistory(id: string): Promise<LeadStatusHistory[]>;
}
