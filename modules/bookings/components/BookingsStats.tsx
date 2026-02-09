import type { UseDashboardBookingsStats } from "../hooks";

interface BookingsStatsProps {
  stats: UseDashboardBookingsStats;
}

export function BookingsStats({ stats }: BookingsStatsProps) {
  const items = [
    { label: "Total", value: stats.total, color: "text-slate-900" },
    { label: "Pending Payment", value: stats.pendingPayment, color: "text-amber-600" },
    { label: "Awaiting Confirmation", value: stats.awaitingConfirmation, color: "text-blue-600" },
    { label: "Active Trips", value: stats.active, color: "text-emerald-600" },
    { label: "Completed", value: stats.completed, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-lg border p-4">
          <p className="text-sm text-slate-600">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
