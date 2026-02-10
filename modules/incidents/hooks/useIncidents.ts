"use client";

import type { Incident, IncidentsData, IncidentStatus, IncidentSeverity } from "../domain";

import { createIncidentsService } from "../services";
import { useAccessToken } from "@/modules/auth/hooks";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseIncidentsParams {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  search?: string;
}

export interface UseIncidentsStats {
  open: number;
  inProgress: number;
  highCritical: number;
  resolvedToday: number;
}

export interface UseIncidentsResult {
  incidents: Incident[];
  stats: UseIncidentsStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncidents(params?: UseIncidentsParams): UseIncidentsResult {
  const accessToken = useAccessToken();
  const serviceRef = useRef(createIncidentsService());
  const [data, setData] = useState<IncidentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await serviceRef.current.fetchIncidents(accessToken, {
        status: params?.status,
        severity: params?.severity,
      });

      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch incidents";
      setError(message);
      console.error("Error fetching incidents:", err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, params?.status, params?.severity]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Client-side search filtering
  let incidents = data?.incidents ?? [];
  if (params?.search) {
    const q = params.search.toLowerCase();
    incidents = incidents.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.booking_number.toLowerCase().includes(q) ||
        i.camper.name.toLowerCase().includes(q) ||
        i.traveler.email.toLowerCase().includes(q)
    );
  }

  // Calculate stats from ALL data (not filtered)
  const allIncidents = data?.incidents ?? [];
  const today = new Date().toISOString().split("T")[0];
  const stats: UseIncidentsStats = {
    open: allIncidents.filter((i) => i.status === "open").length,
    inProgress: allIncidents.filter((i) => i.status === "in_progress").length,
    highCritical: allIncidents.filter(
      (i) =>
        (i.severity === "high" || i.severity === "critical") &&
        (i.status === "open" || i.status === "in_progress")
    ).length,
    resolvedToday: allIncidents.filter((i) => {
      if (i.status !== "resolved") return false;
      return i.resolved_at?.startsWith(today) ?? false;
    }).length,
  };

  return {
    incidents,
    stats,
    isLoading,
    error,
    refetch: fetchIncidents,
  };
}
