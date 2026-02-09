import type { UseIncidentsStats } from "../hooks";
import { cn } from "@/lib/styles";

interface IncidentsStatsProps {
  stats: UseIncidentsStats;
}

export function IncidentsStats({ stats }: IncidentsStatsProps) {
  const items = [
    { label: "Open", value: stats.open, color: "text-blue-600" },
    { label: "In Progress", value: stats.inProgress, color: "text-amber-600" },
    {
      label: "High/Critical",
      value: stats.highCritical,
      color: stats.highCritical > 0 ? "text-red-600" : "text-slate-900",
      highlight: stats.highCritical > 0,
    },
    { label: "Resolved Today", value: stats.resolvedToday, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
