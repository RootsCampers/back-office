"use client";

import { useTrips } from "@/modules/trips/hooks";
import {
  TripsStats,
  TripsFilters,
  TripsTable,
} from "@/modules/trips/components";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function TripsPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { trips, stats, isLoading, error, refetch, startTrip, completeTrip } =
    useTrips({
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
          <h1 className="text-3xl font-bold text-slate-900">Trips</h1>
          <p className="text-slate-600 mt-1">
            Track active and upcoming trips
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading trips: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trips</h1>
          <p className="text-slate-600 mt-1">
            Track active and upcoming trips
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <TripsStats stats={stats} />

      {/* Filters */}
      <TripsFilters
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
        <TripsTable
          trips={trips}
          isLoading={isLoading}
          onStartTrip={startTrip}
          onCompleteTrip={completeTrip}
        />
      </div>
    </div>
  );
}
