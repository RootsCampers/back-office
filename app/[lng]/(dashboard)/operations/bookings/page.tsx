"use client";

import { useDashboardBookings } from "@/modules/bookings/hooks";
import { BookingsStats } from "@/modules/bookings/components/BookingsStats";
import { BookingsFilters } from "@/modules/bookings/components/BookingsFilters";
import { BookingsTable } from "@/modules/bookings/components/BookingsTable";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function BookingsPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const {
    bookings,
    stats,
    isLoading,
    error,
    refetch,
    confirmBooking,
    rejectBooking,
  } = useDashboardBookings({
    status: status === "all" ? undefined : status,
    search: search || undefined,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-600 mt-1">Manage all platform bookings</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading bookings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-600 mt-1">Manage all platform bookings</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <BookingsStats stats={stats} />

      {/* Filters */}
      <BookingsFilters
        status={status}
        search={search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onClear={() => {
          setStatus("all");
          setSearch("");
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <BookingsTable
          bookings={bookings}
          isLoading={isLoading}
          onConfirm={confirmBooking}
          onReject={rejectBooking}
        />
      </div>
    </div>
  );
}
