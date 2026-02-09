import type { IncidentStatus, IncidentSeverity } from "../domain";

import { IncidentStatusLabels, IncidentSeverityLabels } from "../domain";
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

interface IncidentsFiltersProps {
  status: string;
  severity: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSeverityChange: (severity: string) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

const statuses = Object.keys(IncidentStatusLabels) as IncidentStatus[];
const severities = Object.keys(IncidentSeverityLabels) as IncidentSeverity[];

export function IncidentsFilters({
  status,
  severity,
  search,
  onStatusChange,
  onSeverityChange,
  onSearchChange,
  onClear,
}: IncidentsFiltersProps) {
  const hasFilters = status !== "all" || severity !== "all" || search !== "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {IncidentStatusLabels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={severity} onValueChange={onSeverityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          {severities.map((s) => (
            <SelectItem key={s} value={s}>
              {IncidentSeverityLabels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Search incidents..."
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
