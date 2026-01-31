import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Welcome to the RootsCampers back-office
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder stats cards */}
        <div className="bg-white rounded-lg border p-6">
          <p className="text-sm text-slate-600">Active Bookings</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">-</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-sm text-slate-600">Pending Inquiries</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">-</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-sm text-slate-600">Active Vehicles</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">-</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-sm text-slate-600">Monthly Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">-</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-slate-500 text-center py-12">
          Dashboard content will be added here
        </p>
      </div>
    </div>
  );
}
