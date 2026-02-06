"use client";

// 1. Type imports from modules
import type { CreateLeadData, LeadSource, LeadStage } from "@/modules/crm/domain/types";

// 2. Implementation imports from modules
import { LEAD_SOURCES, LEAD_SOURCE_LABELS, LEAD_STAGES, LEAD_STAGE_CONFIG } from "@/modules/crm/domain/types";
import { createLeadService } from "@/modules/crm/services";
import { useAccessToken } from "@/modules/auth/hooks";

// 3. UI component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// 4. External library imports
import type { DateRange } from "@/types/date";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

/**
 * Converts datetime-local value (YYYY-MM-DDTHH:MM) to ISO8601 format
 * by appending seconds and timezone info.
 */
function toISO8601(datetimeLocal: string): string {
  // datetime-local gives us "YYYY-MM-DDTHH:MM", we need "YYYY-MM-DDTHH:MM:SS.000Z"
  return new Date(datetimeLocal).toISOString();
}

export default function AddLeadPage() {
  const router = useRouter();
  const accessToken = useAccessToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdLeadName, setCreatedLeadName] = useState("");

  const [formData, setFormData] = useState<CreateLeadData>({
    name: "",
    email: undefined,
    phone: undefined,
    stage: "new_inquiry",
    source: undefined,
    sourceDetail: undefined,
    tripStartDate: undefined,
    tripEndDate: undefined,
    destination: undefined,
    travelersCount: undefined,
    notes: undefined,
    nextFollowUpAt: undefined,
  });

  const handleInputChange = (field: keyof CreateLeadData, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: undefined,
      phone: undefined,
      stage: "new_inquiry",
      source: undefined,
      sourceDetail: undefined,
      tripStartDate: undefined,
      tripEndDate: undefined,
      destination: undefined,
      travelersCount: undefined,
      notes: undefined,
      nextFollowUpAt: undefined,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Not authenticated");
      return;
    }

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const service = createLeadService(accessToken);

      // Prepare data with proper date format conversion
      const submitData: CreateLeadData = {
        ...formData,
        // Convert datetime-local to ISO8601 if present
        nextFollowUpAt: formData.nextFollowUpAt
          ? toISO8601(formData.nextFollowUpAt)
          : undefined,
      };

      await service.createLead(submitData);
      setCreatedLeadName(formData.name);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Failed to create lead:", err);
      setError(err instanceof Error ? err.message : "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessDialog(false);
    resetForm();
  };

  const handleGoToLeads = () => {
    setShowSuccessDialog(false);
    router.push("/en/sales/crm");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/en/sales/crm">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Lead</h1>
          <p className="text-slate-600 mt-1">Create a new traveler inquiry</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Lead Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleInputChange("stage", value as LeadStage)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {LEAD_STAGE_CONFIG[stage].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source || ""}
                  onValueChange={(value) => handleInputChange("source", value as LeadSource)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        {LEAD_SOURCE_LABELS[source]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceDetail">Source Detail</Label>
              <Input
                id="sourceDetail"
                value={formData.sourceDetail || ""}
                onChange={(e) => handleInputChange("sourceDetail", e.target.value)}
                placeholder="e.g., Google Ads Campaign, Friend referral"
              />
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Trip Details</h2>

            <div className="space-y-2">
              <Label>Trip Dates</Label>
              <DateRangePicker
                dateRange={
                  formData.tripStartDate
                    ? {
                        from: new Date(formData.tripStartDate + "T00:00:00"),
                        to: formData.tripEndDate
                          ? new Date(formData.tripEndDate + "T00:00:00")
                          : undefined,
                      }
                    : undefined
                }
                onSelect={(range: DateRange | undefined) => {
                  handleInputChange(
                    "tripStartDate",
                    range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
                  );
                  handleInputChange(
                    "tripEndDate",
                    range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
                  );
                }}
                placeholder="Select trip dates"
                numberOfMonths={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination || ""}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  placeholder="e.g., Patagonia, Iceland"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelersCount">Number of Travelers</Label>
                <Input
                  id="travelersCount"
                  type="number"
                  min={1}
                  value={formData.travelersCount || ""}
                  onChange={(e) => handleInputChange("travelersCount", e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Follow-up</h2>

            <div className="space-y-2">
              <Label htmlFor="nextFollowUpAt">Next Follow-up Date</Label>
              <Input
                id="nextFollowUpAt"
                type="datetime-local"
                value={formData.nextFollowUpAt || ""}
                onChange={(e) => handleInputChange("nextFollowUpAt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this lead..."
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link href="/en/sales/crm">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Lead
            </Button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Lead Created Successfully
            </DialogTitle>
            <DialogDescription>
              <strong>{createdLeadName}</strong> has been added to your CRM.
              What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCreateAnother}>
              Create Another Lead
            </Button>
            <Button onClick={handleGoToLeads}>
              Go to Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
