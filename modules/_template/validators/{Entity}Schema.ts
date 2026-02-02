// Type imports from own module
import type { {Entity}, {Entity}Stage } from "../domain/types";

// External library imports
import { z } from "zod";

// Shared library imports
import { ApiError } from "@/lib/api/errors";

/**
 * Schema for {Entity} stage validation
 */
export const {Entity}StageSchema = z.enum([
  "stage_one",
  "stage_two",
  "stage_three",
]) satisfies z.ZodType<{Entity}Stage>;

/**
 * Schema for full {Entity} validation
 */
export const {Entity}Schema = z.object({
  id: z.string(),
  name: z.string(),
  stage: {Entity}StageSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
}) satisfies z.ZodType<{Entity}>;

/**
 * Schema for creating a new {Entity}
 */
export const Create{Entity}DataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  stage: {Entity}StageSchema.optional(),
});

/**
 * Schema for updating an existing {Entity}
 */
export const Update{Entity}DataSchema = z.object({
  name: z.string().min(1).optional(),
  stage: {Entity}StageSchema.optional(),
});

/**
 * Validate {Entity} data and return result
 */
export function validate{Entity}Data(data: unknown) {
  return {Entity}Schema.safeParse(data);
}

/**
 * Validate {Entity} data and throw ApiError on failure
 */
export function validate{Entity}DataHandled(data: unknown) {
  const result = {Entity}Schema.safeParse(data);
  if (!result.success) {
    throw new ApiError("validation_error", "Invalid {entity} data");
  }
  return result.data;
}
