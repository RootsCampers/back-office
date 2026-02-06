"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/styles";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous:
          "absolute left-1 top-0 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent opacity-50 hover:opacity-100 transition-opacity",
        button_next:
          "absolute right-1 top-0 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent opacity-50 hover:opacity-100 transition-opacity",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md p-0 font-normal",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "aria-selected:opacity-100",
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground/50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground/50 opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_start:
          "bg-primary text-primary-foreground rounded-l-md rounded-r-none",
        range_end:
          "bg-primary text-primary-foreground rounded-r-md rounded-l-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
export type { DayPickerProps as CalendarProps };
