"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { enUS, es, pt } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import type { DateRange } from "@/types/date";
import { cn } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  numberOfMonths?: number;
  className?: string;
}

function getDateFnsLocale(lang: string) {
  switch (lang) {
    case "es":
      return es;
    case "pt":
      return pt;
    default:
      return enUS;
  }
}

export function DateRangePicker({
  dateRange,
  onSelect,
  placeholder,
  disabled,
  minDate,
  maxDate,
  numberOfMonths = 2,
  className,
}: DateRangePickerProps) {
  const { i18n, t } = useTranslation();
  const locale = getDateFnsLocale(i18n.language);
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      onSelect(range);
      // Auto-close when both dates are selected
      if (range?.from && range?.to) {
        setOpen(false);
      }
    },
    [onSelect],
  );

  const displayValue = React.useMemo(() => {
    if (!dateRange?.from) {
      return null;
    }
    if (!dateRange.to) {
      return format(dateRange.from, "PP", { locale });
    }
    return `${format(dateRange.from, "PP", { locale })} – ${format(dateRange.to, "PP", { locale })}`;
  }, [dateRange, locale]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue ||
            placeholder ||
            t("camper_details.select_dates", "Select dates")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={numberOfMonths}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}
