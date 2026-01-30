"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccessToken } from "@/modules/auth/hooks";
import { createBookingService } from "../services";
import type { DashboardBooking, DashboardBookingsData } from "../domain";

export interface UseDashboardBookingsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface UseDashboardBookingsResult {
  bookings: DashboardBooking[];
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching dashboard bookings (owner view).
 * Returns enriched booking data including camper, traveler, statuses, and reviews.
 *
 * @param params - Optional filters: status, page, limit
 * @returns { bookings, count, isLoading, error, refetch }
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const { bookings, isLoading, error, refetch } = useDashboardBookings({
 *     status: "scheduled",
 *     limit: 20,
 *   });
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return <BookingsList bookings={bookings} />;
 * }
 * ```
 */
export function useDashboardBookings(
  params?: UseDashboardBookingsParams
): UseDashboardBookingsResult {
  const accessToken = useAccessToken();
  const [data, setData] = useState<DashboardBookingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const service = createBookingService();
      const result = await service.fetchDashboardBookings(accessToken, params);

      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      setError(message);
      console.error("Error fetching dashboard bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, params?.status, params?.page, params?.limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings: data?.bookings ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch: fetchBookings,
  };
}
