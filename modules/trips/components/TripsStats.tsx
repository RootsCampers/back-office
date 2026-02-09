import type { UseTripsStats } from "../hooks";
import { cn } from "@/lib/styles";

interface TripsStatsProps {
  stats: UseTripsStats;
}

export function TripsStats({ stats }: TripsStatsProps) {
  const items = [
    { label: "Scheduled", value: stats.scheduled, color: "text-blue-600" },
    { label: "In Progress", value: stats.inProgress, color: "text-emerald-600" },
    { label: "Returning", value: stats.returning, color: "text-amber-600" },
    { label: "Completed Today", value: stats.completedToday, color: "text-green-600" },
    {
      label: "Overdue",
      value: stats.overdue,
      color: stats.overdue > 0 ? "text-red-600" : "text-slate-900",
      highlight: stats.overdue > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "bg-white rounded-lg border p-4",
            item.highlight && "border-red-300 bg-red-50"
          )}
        >
          <p className="text-sm text-slate-600">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
