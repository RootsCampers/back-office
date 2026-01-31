"use client";

// Type imports from own module
import type { {Entity}, {Entity}Stage } from "../domain/types";

// Implementation imports from own module
import { create{Domain}Service } from "../services";

// External library imports
import { useState, useEffect, useCallback } from "react";

interface Use{Domain}Return {
  {entities}: Record<{Entity}Stage, {Entity}[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  move{Entity}ToStage: (id: string, newStage: {Entity}Stage) => Promise<void>;
}

/**
 * Hook to manage {entities} data with Kanban-style grouping.
 * Provides optimistic updates for drag-and-drop operations.
 */
export function use{Domain}(): Use{Domain}Return {
  const [{entities}, set{Entities}] = useState<Record<{Entity}Stage, {Entity}[]>>({
    stage_one: [],
    stage_two: [],
    stage_three: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch{Entities} = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const service = create{Domain}Service();
      const grouped{Entities} = await service.get{Entities}GroupedByStage();
      set{Entities}(grouped{Entities});
    } catch (err) {
      console.error("Failed to fetch {entities}:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch {entities}");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const move{Entity}ToStage = useCallback(
    async (id: string, newStage: {Entity}Stage) => {
      // Optimistic update
      set{Entities}((prev{Entities}) => {
        const new{Entities} = { ...prev{Entities} };

        // Find and remove {entity} from current stage
        let moved{Entity}: {Entity} | undefined;
        for (const stage of Object.keys(new{Entities}) as {Entity}Stage[]) {
          const index = new{Entities}[stage].findIndex((item) => item.id === id);
          if (index !== -1) {
            [moved{Entity}] = new{Entities}[stage].splice(index, 1);
            break;
          }
        }

        // Add {entity} to new stage
        if (moved{Entity}) {
          moved{Entity} = {
            ...moved{Entity},
            stage: newStage,
            updatedAt: new Date().toISOString(),
          };
          new{Entities}[newStage] = [moved{Entity}, ...new{Entities}[newStage]];
        }

        return new{Entities};
      });

      // Persist change
      try {
        const service = create{Domain}Service();
        await service.move{Entity}ToStage(id, newStage);
      } catch (err) {
        console.error("Failed to move {entity}:", err);
        // Revert on error
        await fetch{Entities}();
      }
    },
    [fetch{Entities}]
  );

  useEffect(() => {
    fetch{Entities}();
  }, [fetch{Entities}]);

  return {
    {entities},
    isLoading,
    error,
    refetch: fetch{Entities},
    move{Entity}ToStage,
  };
}
