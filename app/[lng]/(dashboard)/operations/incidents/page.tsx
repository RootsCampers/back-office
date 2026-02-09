"use client";

import { useIncidents } from "@/modules/incidents/hooks";
import {
  IncidentsStats,
  IncidentsFilters,
  IncidentsTable,
} from "@/modules/incidents/components";
import type { IncidentStatus, IncidentSeverity } from "@/modules/incidents/domain";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function IncidentsPage() {
  const [status, setStatus] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [search, setSearch] = useState("");

  const { incidents, stats, isLoading, error, refetch } = useIncidents({
    status: status === "all" ? undefined : (status as IncidentStatus),
    severity: severity === "all" ? undefined : (severity as IncidentSeverity),
    search: search || undefined,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incidents</h1>
          <p className="text-slate-600 mt-1">
            Manage trip incidents and issues
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading incidents: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incidents</h1>
          <p className="text-slate-600 mt-1">
            Manage trip incidents and issues
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <IncidentsStats stats={stats} />

      {/* Filters */}
      <IncidentsFilters
        status={status}
        severity={severity}
        search={search}
        onStatusChange={setStatus}
        onSeverityChange={setSeverity}
        onSearchChange={setSearch}
        onClear={() => {
          setStatus("all");
          setSeverity("all");
          setSearch("");
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <IncidentsTable incidents={incidents} isLoading={isLoading} />
      </div>
    </div>
  );
}
