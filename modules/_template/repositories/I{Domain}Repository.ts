// Type imports from own module
import type {
  {Entity},
  {Entity}Stage,
  Create{Entity}Data,
  Update{Entity}Data,
} from "../domain/types";

/**
 * Repository interface for {Entity} data access.
 * Implementations: Mock{Domain}Repository (dev), {Domain}Repository (API)
 */
export interface I{Domain}Repository {
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
   * Update {entity} stage
   */
  updateStage(id: string, stage: {Entity}Stage): Promise<{Entity}>;

  /**
   * Delete an {entity}
   */
  delete(id: string): Promise<void>;

  /**
   * Get {entities} grouped by stage
   */
  getGroupedByStage(): Promise<Record<{Entity}Stage, {Entity}[]>>;
}
