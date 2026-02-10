"use client";

import type { Trip, TripsData } from "../domain";

import { createTripsService } from "../services";
import { getCurrentStatus } from "../repositories";
import { useAccessToken } from "@/modules/auth/hooks";
import { isOverdue } from "@/lib/format";

import { useState, useEffect, useCallback } from "react";

export interface UseTripsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UseTripsStats {
  scheduled: number;
  inProgress: number;
  returning: number;
  overdue: number;
  completedToday: number;
}

export interface UseTripsResult {
  trips: Trip[];
  stats: UseTripsStats;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  startTrip: (id: string, km: number) => Promise<void>;
  completeTrip: (id: string, km: number) => Promise<void>;
}

export function useTrips(params?: UseTripsParams): UseTripsResult {
  const accessToken = useAccessToken();
  const [data, setData] = useState<TripsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const service = createTripsService();
      const result = await service.getTrips(accessToken, {
        status: params?.status,
        page: params?.page,
        limit: params?.limit,
      });

      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch trips";
      setError(message);
      console.error("Error fetching trips:", err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, params?.status, params?.page, params?.limit]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Client-side search filtering (within current page)
  let trips = data?.trips ?? [];

  if (params?.search) {
    const q = params.search.toLowerCase();
    trips = trips.filter(
      (t) =>
        t.camper.name.toLowerCase().includes(q) ||
        t.traveler.email.toLowerCase().includes(q) ||
        (t.camper.license_plate?.toLowerCase().includes(q) ?? false)
    );
  }

  // Sort by start_date ascending (upcoming first)
  trips = [...trips].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  // Calculate stats from current page trips
  const allTrips = data?.trips ?? [];
  const today = new Date().toISOString().split("T")[0];
  const stats: UseTripsStats = {
    scheduled: allTrips.filter((t) => {
      const s = getCurrentStatus(t);
      return s === "scheduled" || s === "ready_for_pickup";
    }).length,
    inProgress: allTrips.filter(
      (t) => getCurrentStatus(t) === "in_progress"
    ).length,
    returning: allTrips.filter(
      (t) => getCurrentStatus(t) === "returning"
    ).length,
    overdue: allTrips.filter((t) => {
      const s = getCurrentStatus(t);
      return (s === "in_progress" || s === "returning") && isOverdue(t.end_date);
    }).length,
    completedToday: allTrips.filter((t) => {
      const s = getCurrentStatus(t);
      if (s !== "completed") return false;
      const completedStatus = t.statuses.find((st) => st.status === "completed");
      return completedStatus?.timestamp.startsWith(today) ?? false;
    }).length,
  };

  const handleStartTrip = useCallback(
    async (id: string, km: number) => {
      if (!accessToken) return;
      try {
        const service = createTripsService();
        await service.startTrip(id, km, accessToken);
        await fetchTrips();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to start trip";
        setError(message);
      }
    },
    [accessToken, fetchTrips]
  );

  const handleCompleteTrip = useCallback(
    async (id: string, km: number) => {
      if (!accessToken) return;
      try {
        const service = createTripsService();
        await service.completeTrip(id, km, accessToken);
        await fetchTrips();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to complete trip";
        setError(message);
      }
    },
    [accessToken, fetchTrips]
  );

  return {
    trips,
    stats,
    totalCount: data?.count ?? 0,
    isLoading,
    error,
    refetch: fetchTrips,
    startTrip: handleStartTrip,
    completeTrip: handleCompleteTrip,
  };
}
