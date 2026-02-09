import {
  TripOperationalStatus,
  TripOperationalStatusLabels,
} from "@/modules/shared/domain/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { X } from "lucide-react";

interface TripsFiltersProps {
  status: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

const tripStatuses = Object.values(TripOperationalStatus);

export function TripsFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
  onClear,
}: TripsFiltersProps) {
  const hasFilters = status !== "all" || search !== "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {tripStatuses.map((s) => (
            <SelectItem key={s} value={s}>
              {TripOperationalStatusLabels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Search camper or email..."
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
