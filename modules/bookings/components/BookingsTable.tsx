"use client";

import type { DashboardBooking } from "../domain";
import type { ColumnDef } from "@/components/shared/DataTable";

import { BookingStatusBadge, TripStatusBadge, PaymentStatusBadge } from "@/modules/shared/components";
import { RVTypeLabels, RVType } from "@/modules/shared/domain/types";
import { formatCLP, formatDateRange, formatRelativeTime } from "@/lib/format";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { MoreHorizontal, Check, X } from "lucide-react";

interface BookingsTableProps {
  bookings: DashboardBooking[];
  isLoading: boolean;
  onConfirm: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
}

export function BookingsTable({
  bookings,
  isLoading,
  onConfirm,
  onReject,
}: BookingsTableProps) {
  const params = useParams();
  const lng = (params?.lng as string) ?? "en";

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function handleConfirm(id: string) {
    setActionLoading(true);
    try {
      await onConfirm(id);
    } finally {
      setActionLoading(false);
    }
  }

  function openRejectDialog(id: string) {
    setRejectBookingId(id);
    setRejectReason("");
    setRejectDialogOpen(true);
  }

  async function handleReject() {
    if (!rejectBookingId) return;
    setActionLoading(true);
    try {
      await onReject(rejectBookingId, rejectReason || undefined);
      setRejectDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
  }

  const columns: ColumnDef<DashboardBooking>[] = [
    {
      key: "booking_number",
      header: "Booking #",
      render: (row) => (
        <span className="font-mono text-sm">{row.booking_number}</span>
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
      key: "camper",
      header: "Camper",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{row.camper.name}</span>
          <Badge variant="outline" className="w-fit text-xs">
            {RVTypeLabels[row.camper.type as RVType] ?? row.camper.type}
          </Badge>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      render: (row) => (
        <div className="text-sm">
          <div>{formatDateRange(row.start_date, row.end_date)}</div>
          <div className="text-xs text-slate-500">
            {Math.ceil(
              (new Date(row.end_date).getTime() -
                new Date(row.start_date).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days
          </div>
        </div>
      ),
    },
    {
      key: "total_price",
      header: "Price",
      render: (row) => (
        <span className="text-sm font-medium">
          {formatCLP(row.total_price)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <BookingStatusBadge status={row.status} />,
    },
    {
      key: "payment",
      header: "Payment",
      render: (row) =>
        row.payment ? (
          <PaymentStatusBadge status={row.payment.status} />
        ) : (
          <span className="text-xs text-slate-400">-</span>
        ),
    },
    {
      key: "trip_status",
      header: "Trip",
      render: (row) =>
        row.trip_id && row.trip_operational_status ? (
          <Link
            href={`/${lng}/operations/trips`}
            className="inline-block hover:opacity-80 transition-opacity"
            title={`Go to trip ${row.trip_id}`}
          >
            <TripStatusBadge status={row.trip_operational_status} />
          </Link>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (row) => (
        <span className="text-sm text-slate-500">
          {formatRelativeTime(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[50px]",
      render: (row) => {
        if (row.status !== "paid") return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleConfirm(row.id)}
                disabled={actionLoading}
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openRejectDialog(row.id)}
                disabled={actionLoading}
                className="text-red-600"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </DropdownMenuItem>
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
        data={bookings}
        isLoading={isLoading}
        emptyMessage="No bookings found."
      />

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking</DialogTitle>
            <DialogDescription>
              This will cancel the booking and notify the traveler.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading}
            >
              Reject Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
