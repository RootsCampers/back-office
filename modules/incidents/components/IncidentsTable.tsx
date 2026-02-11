"use client";

import type { Incident } from "../domain";
import type { ColumnDef } from "@/components/shared/DataTable";

import {
  IncidentStatusLabels,
  IncidentStatusColors,
  IncidentSeverityLabels,
  IncidentSeverityColors,
  IncidentTypeLabels,
} from "../domain";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/styles";

import { useParams } from "next/navigation";
import Link from "next/link";

function IncidentStatusBadge({ status }: { status: Incident["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(IncidentStatusColors[status])}
    >
      {IncidentStatusLabels[status]}
    </Badge>
  );
}

function IncidentSeverityBadge({ severity }: { severity: Incident["severity"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(IncidentSeverityColors[severity])}
    >
      {IncidentSeverityLabels[severity]}
    </Badge>
  );
}

interface IncidentsTableProps {
  incidents: Incident[];
  isLoading: boolean;
}

export function IncidentsTable({ incidents, isLoading }: IncidentsTableProps) {
  const params = useParams();
  const lng = (params?.lng as string) ?? "en";

  const columns: ColumnDef<Incident>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-slate-500">{row.id}</span>
      ),
    },
    {
      key: "trip",
      header: "Trip",
      render: (row) => (
        <div>
          <Link
            href={`/${lng}/operations/bookings`}
            className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
            title={`Go to booking ${row.booking_number}`}
          >
            {row.booking_number}
          </Link>
          <div className="text-xs text-slate-500">{row.camper.name}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className="text-sm">{IncidentTypeLabels[row.type]}</span>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => <IncidentSeverityBadge severity={row.severity} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <IncidentStatusBadge status={row.status} />,
    },
    {
      key: "title",
      header: "Description",
      render: (row) => (
        <div className="max-w-[300px]">
          <div className="text-sm font-medium truncate">{row.title}</div>
          <div className="text-xs text-slate-500 truncate">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: "traveler",
      header: "Traveler",
      render: (row) => (
        <span className="text-sm">{row.traveler.email}</span>
      ),
    },
    {
      key: "reported_at",
      header: "Reported",
      render: (row) => (
        <span className="text-sm text-slate-500">
          {row.reported_at ? formatRelativeTime(row.reported_at) : "—"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={incidents}
      isLoading={isLoading}
      emptyMessage="No incidents found."
    />
  );
}
