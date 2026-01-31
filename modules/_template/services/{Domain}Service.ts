// Type imports from own module (alphabetical)
import type { I{Domain}Service } from "./I{Domain}Service";
import type { I{Domain}Repository } from "../repositories/I{Domain}Repository";
import type {
  {Entity},
  {Entity}Stage,
  Create{Entity}Data,
  Update{Entity}Data,
} from "../domain/types";

// Implementation imports from own module
import { create{Domain}Repository } from "../repositories";

/**
 * Service implementation for {Entity} business logic.
 */
export class {Domain}Service implements I{Domain}Service {
  constructor(private readonly repository: I{Domain}Repository) {}

  async getAll(): Promise<{Entity}[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<{Entity} | null> {
    return this.repository.getById(id);
  }

  async create(data: Create{Entity}Data): Promise<{Entity}> {
    // Add business logic / validation here
    return this.repository.create(data);
  }

  async update(id: string, data: Update{Entity}Data): Promise<{Entity}> {
    // Add business logic / validation here
    return this.repository.update(id, data);
  }

  async move{Entity}ToStage(id: string, stage: {Entity}Stage): Promise<{Entity}> {
    // Add stage transition validation here if needed
    return this.repository.updateStage(id, stage);
  }

  async delete(id: string): Promise<void> {
    // Add business logic / validation here
    return this.repository.delete(id);
  }

  async get{Entities}GroupedByStage(): Promise<Record<{Entity}Stage, {Entity}[]>> {
    return this.repository.getGroupedByStage();
  }
}

/**
 * Factory function to create a {Domain}Service with default repository.
 */
export function create{Domain}Service(): I{Domain}Service {
  const repository = create{Domain}Repository();
  return new {Domain}Service(repository);
}
