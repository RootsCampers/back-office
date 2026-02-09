"use client";

import type { DashboardBooking, DashboardBookingsData } from "../domain";

import { createBookingService } from "../services";
import { useAccessToken } from "@/modules/auth/hooks";

import { useState, useEffect, useCallback } from "react";

export interface UseDashboardBookingsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UseDashboardBookingsStats {
  total: number;
  pendingPayment: number;
  awaitingConfirmation: number;
  active: number;
  completed: number;
}

export interface UseDashboardBookingsResult {
  bookings: DashboardBooking[];
  stats: UseDashboardBookingsStats;
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirmBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string, reason?: string) => Promise<void>;
}

/**
 * Hook for fetching dashboard bookings (owner view).
 * Returns enriched booking data including camper, traveler, statuses, and reviews.
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
      const result = await service.fetchDashboardBookings(accessToken, {
        status: params?.status,
        page: params?.page,
        limit: params?.limit,
      });

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

  // Client-side search filtering
  let bookings = data?.bookings ?? [];
  if (params?.search) {
    const q = params.search.toLowerCase();
    bookings = bookings.filter(
      (b) =>
        b.booking_number.toLowerCase().includes(q) ||
        b.traveler.email.toLowerCase().includes(q)
    );
  }

  // Stats computed from ALL data (not filtered by search)
  const allBookings = data?.bookings ?? [];
  const stats: UseDashboardBookingsStats = {
    total: allBookings.length,
    pendingPayment: allBookings.filter(
      (b) =>
        b.status === "pending_payment" ||
        b.status === "payment_processing" ||
        b.status === "payment_failed"
    ).length,
    awaitingConfirmation: allBookings.filter(
      (b) => b.status === "paid"
    ).length,
    active: allBookings.filter((b) => b.status === "active").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
  };

  const handleConfirmBooking = useCallback(
    async (id: string) => {
      if (!accessToken) return;
      try {
        const service = createBookingService();
        await service.confirmBooking(accessToken, id);
        await fetchBookings();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to confirm booking";
        setError(message);
      }
    },
    [accessToken, fetchBookings]
  );

  const handleRejectBooking = useCallback(
    async (id: string, reason?: string) => {
      if (!accessToken) return;
      try {
        const service = createBookingService();
        await service.rejectBooking(accessToken, id, reason ? { reason } : undefined);
        await fetchBookings();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to reject booking";
        setError(message);
      }
    },
    [accessToken, fetchBookings]
  );

  return {
    bookings,
    stats,
    count: bookings.length,
    isLoading,
    error,
    refetch: fetchBookings,
    confirmBooking: handleConfirmBooking,
    rejectBooking: handleRejectBooking,
  };
}
