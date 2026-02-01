"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { Lead, LeadStage } from "../domain/types";
import { LEAD_STAGES, LEAD_STAGE_CONFIG } from "../domain/types";
import { LeadCard } from "./LeadCard";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface KanbanBoardProps {
  leads: Record<LeadStage, Lead[]>;
  onMoveLeadToStage: (leadId: string, newStage: LeadStage, lostReason?: string) => void;
}

interface PendingLostMove {
  leadId: string;
  leadName: string;
}

export function KanbanBoard({ leads, onMoveLeadToStage }: KanbanBoardProps) {
  const [pendingLostMove, setPendingLostMove] = useState<PendingLostMove | null>(null);
  const [lostReason, setLostReason] = useState("");

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move to new stage
    const newStage = destination.droppableId as LeadStage;

    // If moving to "lost" stage, prompt for reason
    if (newStage === "lost") {
      // Find the lead to get its name for the dialog
      let leadName = "this lead";
      for (const stage of LEAD_STAGES) {
        const lead = leads[stage].find((l) => l.id === draggableId);
        if (lead) {
          leadName = lead.name;
          break;
        }
      }
      setPendingLostMove({ leadId: draggableId, leadName });
      setLostReason("");
      return;
    }

    onMoveLeadToStage(draggableId, newStage);
  };

  const handleConfirmLost = () => {
    if (pendingLostMove) {
      onMoveLeadToStage(pendingLostMove.leadId, "lost", lostReason || undefined);
      setPendingLostMove(null);
      setLostReason("");
    }
  };

  const handleCancelLost = () => {
    setPendingLostMove(null);
    setLostReason("");
  };

  return (
    <>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STAGES.map((stage) => {
          const config = LEAD_STAGE_CONFIG[stage];
          const stageLeads = leads[stage] || [];

          return (
            <div key={stage} className="flex-shrink-0 w-72">
              {/* Column header */}
              <div
                className={cn(
                  "rounded-t-lg border-t-4 px-3 py-2",
                  config.bgColor
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className={cn("font-semibold text-sm", config.color)}>
                    {config.label}
                  </h3>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      config.color,
                      "bg-white/80"
                    )}
                  >
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[500px] p-2 rounded-b-lg border border-t-0 transition-colors",
                      snapshot.isDraggingOver
                        ? "bg-slate-100 border-primary/30"
                        : "bg-slate-50 border-slate-200"
                    )}
                  >
                    <div className="space-y-2">
                      {stageLeads.map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <LeadCard
                                lead={lead}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}

                    {/* Empty state */}
                    {stageLeads.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                        No leads
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>

      {/* Lost Reason Dialog */}
      <Dialog open={pendingLostMove !== null} onOpenChange={(open) => !open && handleCancelLost()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Lead as Lost</DialogTitle>
            <DialogDescription>
              You are marking <strong>{pendingLostMove?.leadName}</strong> as lost.
              Please provide a reason to help track why this lead was lost.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="lostReason">Reason for losing this lead (optional)</Label>
            <Textarea
              id="lostReason"
              placeholder="e.g., Budget constraints, chose competitor, trip cancelled..."
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelLost}>
              Cancel
            </Button>
            <Button onClick={handleConfirmLost}>
              Mark as Lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
