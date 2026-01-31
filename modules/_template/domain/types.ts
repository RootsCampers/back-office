/**
 * {Entity} stage type - union of all possible stages
 */
export type {Entity}Stage = "stage_one" | "stage_two" | "stage_three";

/**
 * Stage configuration with display labels and colors
 */
export const {ENTITY}_STAGE_CONFIG: Record<
  {Entity}Stage,
  { label: string; color: string; bgColor: string }
> = {
  stage_one: {
    label: "Stage One",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  stage_two: {
    label: "Stage Two",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  stage_three: {
    label: "Stage Three",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
};

/**
 * Main {Entity} interface
 */
export interface {Entity} {
  id: string;
  name: string;
  stage: {Entity}Stage;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new {Entity}
 */
export interface Create{Entity}Data {
  name: string;
  stage?: {Entity}Stage;
}

/**
 * Data for updating an existing {Entity}
 */
export interface Update{Entity}Data {
  name?: string;
  stage?: {Entity}Stage;
}
