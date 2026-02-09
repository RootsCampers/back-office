import { Badge } from "@/components/ui/badge";
import {
  UserBookingStatus,
  UserBookingStatusLabels,
} from "@/modules/shared/domain/types";
import { cn } from "@/lib/styles";

const statusColors: Record<UserBookingStatus, string> = {
  // Payment — amber
  [UserBookingStatus.PENDING_PAYMENT]:
    "bg-amber-100 text-amber-800 border-amber-200",
  [UserBookingStatus.PAYMENT_PROCESSING]:
    "bg-amber-100 text-amber-800 border-amber-200",
  [UserBookingStatus.PAYMENT_FAILED]:
    "bg-red-100 text-red-800 border-red-200",
  [UserBookingStatus.PAID]:
    "bg-amber-100 text-amber-800 border-amber-200",
  // Confirmation — blue
  [UserBookingStatus.PENDING_CONFIRMATION]:
    "bg-blue-100 text-blue-800 border-blue-200",
  [UserBookingStatus.CONFIRMED]:
    "bg-blue-100 text-blue-800 border-blue-200",
  // Deposit — teal
  [UserBookingStatus.DEPOSIT_PENDING]:
    "bg-teal-100 text-teal-800 border-teal-200",
  [UserBookingStatus.DEPOSIT_PAID]:
    "bg-teal-100 text-teal-800 border-teal-200",
  // Active — emerald
  [UserBookingStatus.ACTIVE]:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  [UserBookingStatus.COMPLETED]:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  // Cancellation — red
  [UserBookingStatus.CANCELLATION_REQUESTED]:
    "bg-red-100 text-red-800 border-red-200",
  [UserBookingStatus.CANCELLED_BY_TRAVELER]:
    "bg-red-100 text-red-800 border-red-200",
  [UserBookingStatus.CANCELLED_BY_OWNER]:
    "bg-red-100 text-red-800 border-red-200",
  [UserBookingStatus.CANCELLED_BY_SYSTEM]:
    "bg-red-100 text-red-800 border-red-200",
  // Refund — purple
  [UserBookingStatus.REFUND_PENDING]:
    "bg-purple-100 text-purple-800 border-purple-200",
  [UserBookingStatus.REFUND_PARTIAL]:
    "bg-purple-100 text-purple-800 border-purple-200",
  [UserBookingStatus.REFUNDED]:
    "bg-purple-100 text-purple-800 border-purple-200",
};

interface BookingStatusBadgeProps {
  status: string;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const enumStatus = status as UserBookingStatus;
  const label =
    UserBookingStatusLabels[enumStatus] ?? status.replace(/_/g, " ");
  const colors =
    statusColors[enumStatus] ?? "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <Badge variant="outline" className={cn(colors, className)}>
      {label}
    </Badge>
  );
}
