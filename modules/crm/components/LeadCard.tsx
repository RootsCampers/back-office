"use client";

import { Mail, Phone, Calendar, MapPin, Users, User } from "lucide-react";
import type { Lead } from "../domain/types";
import { LEAD_SOURCE_LABELS } from "../domain/types";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  isDragging?: boolean;
}

export function LeadCard({ lead, isDragging }: LeadCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const sourceLabel = lead.source ? LEAD_SOURCE_LABELS[lead.source] : null;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border p-3 shadow-sm cursor-grab active:cursor-grabbing",
        "hover:shadow-md transition-shadow",
        isDragging && "shadow-lg ring-2 ring-primary/20 rotate-2"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-slate-900 text-sm truncate">
          {lead.name}
        </h4>
        {sourceLabel && (
          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full whitespace-nowrap">
            {sourceLabel}
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="space-y-1 text-xs text-slate-600">
        {lead.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-slate-400" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Trip info */}
      {(lead.tripStartDate || lead.destination || lead.travelersCount) && (
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          {lead.tripStartDate && lead.tripEndDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>
                {formatDate(lead.tripStartDate)} - {formatDate(lead.tripEndDate)}
              </span>
            </div>
          )}
          {lead.destination && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span className="truncate">{lead.destination}</span>
            </div>
          )}
          {lead.travelersCount && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-slate-400" />
              <span>{lead.travelersCount} travelers</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2 border-t flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {formatDate(lead.createdAt)}
        </div>
        {lead.assignedTo && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <User className="h-3 w-3" />
            <span>Assigned</span>
          </div>
        )}
      </div>

      {/* Notes preview */}
      {lead.notes && (
        <div className="mt-2 text-xs text-slate-500 line-clamp-2 italic">
          {lead.notes}
        </div>
      )}

      {/* Lost reason */}
      {lead.lostReason && lead.stage === "lost" && (
        <div className="mt-2 text-xs text-red-600">
          Lost: {lead.lostReason}
        </div>
      )}
    </div>
  );
}
