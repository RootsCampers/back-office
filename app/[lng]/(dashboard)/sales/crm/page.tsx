"use client";

import { RefreshCw, Plus } from "lucide-react";
import Link from "next/link";
import { useLeads } from "@/modules/crm/hooks";
import { KanbanBoard } from "@/modules/crm/components";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";

export default function SalesCRMPage() {
  const { leads, isLoading, error, refetch, moveLeadToStage } = useLeads();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales CRM</h1>
          <p className="text-slate-600 mt-1">Manage traveler booking inquiries</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading leads: {error}
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalLeads = Object.values(leads).flat().length;
  const activeLeads =
    leads.new_inquiry.length +
    leads.contacted.length +
    leads.quote_sent.length +
    leads.negotiating.length;
  const bookedLeads = leads.booked.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales CRM</h1>
          <p className="text-slate-600 mt-1">
            Manage traveler booking inquiries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/en/sales/crm/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-slate-600">Total Leads</p>
          <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-slate-600">Active Pipeline</p>
          <p className="text-2xl font-bold text-blue-600">{activeLeads}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-slate-600">Booked</p>
          <p className="text-2xl font-bold text-green-600">{bookedLeads}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-slate-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-slate-900">
            {totalLeads > 0
              ? `${Math.round((bookedLeads / totalLeads) * 100)}%`
              : "-"}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border p-4">
        <KanbanBoard
          leads={leads}
          onMoveLeadToStage={(leadId, newStage, lostReason) => {
            moveLeadToStage(leadId, newStage, lostReason);
          }}
        />
      </div>
    </div>
  );
}
