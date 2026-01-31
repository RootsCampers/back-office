"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead, LeadStage } from "../domain/types";
import { createLeadService } from "../services";

interface UseLeadsReturn {
  leads: Record<LeadStage, Lead[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  moveLeadToStage: (leadId: string, newStage: LeadStage) => Promise<void>;
}

/**
 * Hook to manage leads data with Kanban-style grouping.
 */
export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Record<LeadStage, Lead[]>>({
    new_inquiry: [],
    contacted: [],
    quote_sent: [],
    negotiating: [],
    booked: [],
    lost: [],
  });
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
    async (leadId: string, newStage: LeadStage) => {
      // Optimistic update
      setLeads((prevLeads) => {
        const newLeads = { ...prevLeads };

        // Find and remove lead from current stage
        let movedLead: Lead | undefined;
        for (const stage of Object.keys(newLeads) as LeadStage[]) {
          const index = newLeads[stage].findIndex((l) => l.id === leadId);
          if (index !== -1) {
            [movedLead] = newLeads[stage].splice(index, 1);
            break;
          }
        }

        // Add lead to new stage
        if (movedLead) {
          movedLead = { ...movedLead, stage: newStage, updatedAt: new Date().toISOString() };
          newLeads[newStage] = [movedLead, ...newLeads[newStage]];
        }

        return newLeads;
      });

      // Persist change
      try {
        const service = createLeadService();
        await service.moveLeadToStage(leadId, newStage);
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
