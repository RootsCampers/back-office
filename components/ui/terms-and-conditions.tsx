"use client";

import { ExternalLink } from "lucide-react";

interface TermsAndConditionsProps {
  children: React.ReactNode;
  type?: "platform" | "host";
}

export function TermsAndConditions({
  children,
  type = "platform",
}: TermsAndConditionsProps) {
  const getTermsUrl = () => {
    if (type === "host") {
      return "https://atmaucjbgvnyduoexsuj.supabase.co/storage/v1/object/public/terms-and-conditions/host/TYC%20-%20HOST%20ESP.pdf";
    }
    return "https://atmaucjbgvnyduoexsuj.supabase.co/storage/v1/object/public/terms-and-conditions/traveler/TYC%20TRAVELER%20ESP.pdf";
  };

  const handleClick = () => {
    window.open(getTermsUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </button>
  );
}
