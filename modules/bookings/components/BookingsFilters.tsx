import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { X } from "lucide-react";

interface BookingsFiltersProps {
  status: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

export function BookingsFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
  onClear,
}: BookingsFiltersProps) {
  const hasFilters = status !== "all" || search !== "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>

          <SelectGroup>
            <SelectLabel>Payment</SelectLabel>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="payment_processing">Payment Processing</SelectItem>
            <SelectItem value="payment_failed">Payment Failed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Confirmation</SelectLabel>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Deposit</SelectLabel>
            <SelectItem value="deposit_pending">Deposit Pending</SelectItem>
            <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Trip</SelectLabel>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Cancellation</SelectLabel>
            <SelectItem value="cancellation_requested">Cancellation Requested</SelectItem>
            <SelectItem value="cancelled_by_traveler">Cancelled by Traveler</SelectItem>
            <SelectItem value="cancelled_by_owner">Cancelled by Owner</SelectItem>
            <SelectItem value="cancelled_by_system">Cancelled by System</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Refund</SelectLabel>
            <SelectItem value="refund_pending">Refund Pending</SelectItem>
            <SelectItem value="refund_partial">Refund Partial</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search booking # or email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-[260px]"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
