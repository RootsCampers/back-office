"use client";

import type { Trip } from "../domain";
import type { ColumnDef } from "@/components/shared/DataTable";

import { getCurrentStatus } from "../domain";
import { TripStatusBadge } from "@/modules/shared/components";
import { DataTable } from "@/components/shared/DataTable";
import { formatDateRange, daysUntil, isOverdue } from "@/lib/format";
import { cn } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Play, CheckCircle } from "lucide-react";

interface TripsTableProps {
  trips: Trip[];
  isLoading: boolean;
  onStartTrip: (id: string, km: number) => Promise<void>;
  onCompleteTrip: (id: string, km: number) => Promise<void>;
}

export function TripsTable({
  trips,
  isLoading,
  onStartTrip,
  onCompleteTrip,
}: TripsTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"start" | "complete">("start");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [kmValue, setKmValue] = useState("");
  const [kmError, setKmError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const params = useParams();
  const lng = (params?.lng as string) ?? "en";
  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  function openDialog(tripId: string, mode: "start" | "complete") {
    setSelectedTripId(tripId);
    setDialogMode(mode);
    setKmValue("");
    setKmError("");
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!selectedTripId) return;

    const km = Number(kmValue);
    if (isNaN(km) || km <= 0) {
      setKmError("Enter a valid km reading");
      return;
    }

    if (dialogMode === "complete" && selectedTrip?.start_km != null && km < selectedTrip.start_km) {
      setKmError(`End km must be >= start km (${selectedTrip.start_km})`);
      return;
    }

    setActionLoading(true);
    try {
      if (dialogMode === "start") {
        await onStartTrip(selectedTripId, km);
      } else {
        await onCompleteTrip(selectedTripId, km);
      }
      setDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
  }

  const columns: ColumnDef<Trip>[] = [
    {
      key: "booking",
      header: "Booking",
      render: (row) => (
        <Link
          href={`/${lng}/operations/bookings`}
          className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
          title={`Go to booking ${row.booking_number}`}
        >
          {row.booking_number}
        </Link>
      ),
    },
    {
      key: "camper",
      header: "Camper",
      render: (row) => (
        <div>
          <div className="font-medium text-sm">{row.camper.name}</div>
          {row.camper.license_plate && (
            <div className="text-xs text-slate-500">{row.camper.license_plate}</div>
          )}
        </div>
      ),
    },
    {
      key: "traveler",
      header: "Traveler",
      render: (row) => <span className="text-sm">{row.traveler.email}</span>,
    },
    {
      key: "dates",
      header: "Dates",
      render: (row) => (
        <span className="text-sm">
          {formatDateRange(row.start_date, row.end_date)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <TripStatusBadge status={getCurrentStatus(row)} />
      ),
    },
    {
      key: "km",
      header: "KM",
      render: (row) => (
        <div className="text-sm font-mono">
          {row.start_km != null ? row.start_km.toLocaleString() : "-"}
          {" / "}
          {row.end_km != null ? row.end_km.toLocaleString() : "-"}
          {row.total_km != null && (
            <span className="text-xs text-slate-500 ml-1">
              ({row.total_km.toLocaleString()})
            </span>
          )}
        </div>
      ),
    },
    {
      key: "countdown",
      header: "Countdown",
      render: (row) => {
        const status = getCurrentStatus(row);
        if (status === "completed" || status.startsWith("cancelled")) {
          return <span className="text-xs text-slate-400">-</span>;
        }

        const days = daysUntil(row.end_date);
        const overdue = isOverdue(row.end_date);

        if (overdue) {
          return (
            <span className="text-sm font-medium text-red-600">
              {Math.abs(days)}d overdue
            </span>
          );
        }

        return (
          <span className="text-sm font-medium text-green-600">
            {days}d remaining
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-[50px]",
      render: (row) => {
        const status = getCurrentStatus(row);

        const canStart =
          status === "scheduled" || status === "ready_for_pickup";
        const canComplete =
          status === "in_progress" || status === "returning";

        if (!canStart && !canComplete) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canStart && (
                <DropdownMenuItem onClick={() => openDialog(row.id, "start")}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Trip
                </DropdownMenuItem>
              )}
              {canComplete && (
                <DropdownMenuItem
                  onClick={() => openDialog(row.id, "complete")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Trip
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={trips}
        isLoading={isLoading}
        emptyMessage="No trips found."
        rowClassName={(row) => {
          const status = getCurrentStatus(row);
          const overdue =
            (status === "in_progress" || status === "returning") &&
            isOverdue(row.end_date);
          return cn(overdue && "bg-red-50 border-l-4 border-red-400");
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "start" ? "Start Trip" : "Complete Trip"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "start"
                ? "Record the starting kilometer reading for this trip."
                : "Record the ending kilometer reading for this trip."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="km-input">
              {dialogMode === "start" ? "Start KM" : "End KM"}
            </Label>
            <Input
              id="km-input"
              type="number"
              placeholder="e.g., 45200"
              value={kmValue}
              onChange={(e) => {
                setKmValue(e.target.value);
                setKmError("");
              }}
            />
            {kmError && (
              <p className="text-sm text-red-600">{kmError}</p>
            )}
            {dialogMode === "complete" && selectedTrip?.start_km != null && (
              <p className="text-xs text-slate-500">
                Start KM: {selectedTrip.start_km.toLocaleString()}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={actionLoading}>
              {dialogMode === "start" ? "Start Trip" : "Complete Trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
