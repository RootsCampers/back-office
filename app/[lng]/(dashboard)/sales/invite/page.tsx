"use client";

// 1. Implementation imports from modules
import { useAccessToken } from "@/modules/auth/hooks";

// 2. Shared library imports
import { apiFetchData } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

// 3. UI component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

interface InviteUserResponse {
  user_id: string;
  message: string;
}

export default function InviteTravelerPage() {
  const router = useRouter();
  const accessToken = useAccessToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("es");

  const resetForm = () => {
    setEmail("");
    setFullName("");
    setLanguage("es");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Not authenticated");
      return;
    }

    if (!email.trim() || !fullName.trim()) {
      setError("Email and full name are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetchData<InviteUserResponse>("/api/admin/invite-user", {
        method: "POST",
        data: { email, full_name: fullName, language },
        token: accessToken,
        cache: "no-store",
      });
      setInvitedEmail(email);
      setShowSuccessDialog(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to invite user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteAnother = () => {
    setShowSuccessDialog(false);
    resetForm();
  };

  const handleGoToCRM = () => {
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
          <h1 className="text-3xl font-bold text-slate-900">Invite Traveler</h1>
          <p className="text-slate-600 mt-1">Send an invitation to a new traveler</p>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
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
              Send Invite
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
              Invitation Sent
            </DialogTitle>
            <DialogDescription>
              An invitation has been sent to <strong>{invitedEmail}</strong>.
              What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleInviteAnother}>
              Invite Another
            </Button>
            <Button onClick={handleGoToCRM}>
              Go to CRM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
