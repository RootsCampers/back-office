import type { PaymentStatus } from "@/modules/bookings/domain";

import { PaymentStatusLabels, PaymentStatusColors } from "@/modules/bookings/domain";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/styles";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const label = PaymentStatusLabels[status] ?? status.replace(/_/g, " ");
  const colors = PaymentStatusColors[status] ?? "border-slate-300 text-slate-700 bg-slate-50";

  return (
    <Badge variant="outline" className={cn(colors, className)}>
      {label}
    </Badge>
  );
}
