"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { enUS, es, pt } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
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

export function DatePicker({
  date,
  onSelect,
  placeholder,
  disabled,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const { i18n, t } = useTranslation();
  const locale = getDateFnsLocale(i18n.language);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date
            ? format(date, "PP", { locale })
            : placeholder || t("camper_details.select_date", "Select a date")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
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
