// Type imports from own module
import type {
  {Entity},
  {Entity}Stage,
  Create{Entity}Data,
  Update{Entity}Data,
} from "../domain/types";

/**
 * Service interface for {Entity} business logic.
 */
export interface I{Domain}Service {
  /**
   * Get all {entities}
   */
  getAll(): Promise<{Entity}[]>;

  /**
   * Get {entity} by ID
   */
  getById(id: string): Promise<{Entity} | null>;

  /**
   * Create a new {entity}
   */
  create(data: Create{Entity}Data): Promise<{Entity}>;

  /**
   * Update an existing {entity}
   */
  update(id: string, data: Update{Entity}Data): Promise<{Entity}>;

  /**
   * Move {entity} to a new stage
   */
  move{Entity}ToStage(id: string, stage: {Entity}Stage): Promise<{Entity}>;

  /**
   * Delete an {entity}
   */
  delete(id: string): Promise<void>;

  /**
   * Get {entities} grouped by stage (for Kanban views)
   */
  get{Entities}GroupedByStage(): Promise<Record<{Entity}Stage, {Entity}[]>>;
}
