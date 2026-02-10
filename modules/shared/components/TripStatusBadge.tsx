import { Badge } from "@/components/ui/badge";
import {
  TripOperationalStatus,
  TripOperationalStatusLabels,
} from "@/modules/shared/domain/types";
import { cn } from "@/lib/styles";

const statusColors: Record<TripOperationalStatus, string> = {
  [TripOperationalStatus.SCHEDULED]:
    "bg-blue-100 text-blue-800 border-blue-200",
  [TripOperationalStatus.READY_FOR_PICKUP]:
    "bg-blue-100 text-blue-800 border-blue-200",
  [TripOperationalStatus.PENDING]:
    "bg-slate-100 text-slate-800 border-slate-200",
  [TripOperationalStatus.IN_PROGRESS]:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  [TripOperationalStatus.RETURNING]:
    "bg-amber-100 text-amber-800 border-amber-200",
  [TripOperationalStatus.COMPLETED]:
    "bg-green-100 text-green-800 border-green-200",
  [TripOperationalStatus.CANCELLED_BEFORE_START]:
    "bg-red-100 text-red-800 border-red-200",
  [TripOperationalStatus.CANCELLED_DURING_TRIP]:
    "bg-red-100 text-red-800 border-red-200",
  [TripOperationalStatus.ABORTED]:
    "bg-red-100 text-red-800 border-red-200",
};

interface TripStatusBadgeProps {
  status: string;
  className?: string;
}

export function TripStatusBadge({ status, className }: TripStatusBadgeProps) {
  const enumStatus = status as TripOperationalStatus;
  const label =
    TripOperationalStatusLabels[enumStatus] ?? status.replace(/_/g, " ");
  const colors =
    statusColors[enumStatus] ?? "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <Badge variant="outline" className={cn(colors, className)}>
      {label}
    </Badge>
  );
}
