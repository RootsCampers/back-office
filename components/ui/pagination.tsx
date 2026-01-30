"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/styles";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex justify-center items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">
          {t("pagination.previous", "Previous")}
        </span>
      </Button>

      <div className="flex gap-1 items-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show first, last, current, and neighbors
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                className="w-8 h-8"
              >
                {page}
              </Button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-1 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        <span className="sr-only sm:not-sr-only">
          {t("pagination.next", "Next")}
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
