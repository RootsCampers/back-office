// Type imports from own module
import type { I{Domain}Repository } from "./I{Domain}Repository";
import type {
  {Entity},
  {Entity}Stage,
  Create{Entity}Data,
  Update{Entity}Data,
} from "../domain/types";

/**
 * Mock data for development
 */
const MOCK_{ENTITIES}: {Entity}[] = [
  {
    id: "1",
    name: "Sample Item 1",
    stage: "stage_one",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sample Item 2",
    stage: "stage_two",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Mock repository implementation for development.
 * Data persists only for the session (in-memory).
 */
export class Mock{Domain}Repository implements I{Domain}Repository {
  private {entities}: {Entity}[] = [...MOCK_{ENTITIES}];

  async getAll(): Promise<{Entity}[]> {
    // Simulate network delay
    await this.delay(100);
    return [...this.{entities}];
  }

  async getById(id: string): Promise<{Entity} | null> {
    await this.delay(50);
    return this.{entities}.find((item) => item.id === id) || null;
  }

  async create(data: Create{Entity}Data): Promise<{Entity}> {
    await this.delay(100);
    const new{Entity}: {Entity} = {
      id: crypto.randomUUID(),
      name: data.name,
      stage: data.stage || "stage_one",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.{entities}.push(new{Entity});
    return new{Entity};
  }

  async update(id: string, data: Update{Entity}Data): Promise<{Entity}> {
    await this.delay(100);
    const index = this.{entities}.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("{Entity} not found");
    }
    this.{entities}[index] = {
      ...this.{entities}[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.{entities}[index];
  }

  async updateStage(id: string, stage: {Entity}Stage): Promise<{Entity}> {
    return this.update(id, { stage });
  }

  async delete(id: string): Promise<void> {
    await this.delay(100);
    const index = this.{entities}.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("{Entity} not found");
    }
    this.{entities}.splice(index, 1);
  }

  async getGroupedByStage(): Promise<Record<{Entity}Stage, {Entity}[]>> {
    await this.delay(100);
    const stages: {Entity}Stage[] = ["stage_one", "stage_two", "stage_three"];
    const grouped = {} as Record<{Entity}Stage, {Entity}[]>;

    for (const stage of stages) {
      grouped[stage] = this.{entities}.filter((item) => item.stage === stage);
    }

    return grouped;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
