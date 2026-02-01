"use client";

// Type imports from own module
import type { Lead, LeadStage, LeadStageUpdateData } from "../domain/types";

// Implementation imports from own module
import { LEAD_STAGES } from "../domain/types";
import { createLeadService } from "../services";

// External library imports
import { useState, useEffect, useCallback } from "react";

interface UseLeadsReturn {
  leads: Record<LeadStage, Lead[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  moveLeadToStage: (leadId: string, newStage: LeadStage, lostReason?: string) => Promise<void>;
}

/**
 * Hook to manage leads data with Kanban-style grouping.
 * Provides optimistic updates for drag-and-drop operations.
 */
export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Record<LeadStage, Lead[]>>(
    LEAD_STAGES.reduce(
      (acc, stage) => {
        acc[stage] = [];
        return acc;
      },
      {} as Record<LeadStage, Lead[]>
    )
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const service = createLeadService();
      const groupedLeads = await service.getLeadsGroupedByStage();
      setLeads(groupedLeads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const moveLeadToStage = useCallback(
    async (leadId: string, newStage: LeadStage, lostReason?: string) => {
      // Optimistic update
      setLeads((prevLeads) => {
        const newLeads = { ...prevLeads };

        // Find and remove lead from current stage
        let movedLead: Lead | undefined;
        for (const stage of LEAD_STAGES) {
          const index = newLeads[stage].findIndex((l) => l.id === leadId);
          if (index !== -1) {
            [movedLead] = newLeads[stage].splice(index, 1);
            break;
          }
        }

        // Add lead to new stage
        if (movedLead) {
          const now = new Date().toISOString();
          movedLead = {
            ...movedLead,
            stage: newStage,
            stageChangedAt: now,
            updatedAt: now,
            lostReason: newStage === "lost" ? lostReason : movedLead.lostReason,
          };
          newLeads[newStage] = [movedLead, ...newLeads[newStage]];
        }

        return newLeads;
      });

      // Persist change
      try {
        const service = createLeadService();
        const stageUpdateData: LeadStageUpdateData = {
          stage: newStage,
          lostReason: newStage === "lost" ? lostReason : undefined,
        };
        await service.moveLeadToStage(leadId, stageUpdateData);
      } catch (err) {
        console.error("Failed to move lead:", err);
        // Revert on error
        await fetchLeads();
      }
    },
    [fetchLeads]
  );

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    isLoading,
    error,
    refetch: fetchLeads,
    moveLeadToStage,
  };
}
