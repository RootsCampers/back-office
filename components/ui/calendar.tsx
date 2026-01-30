"use client";

import * as React from "react";
import { DateRange as DateRangePicker } from "react-date-range";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/styles";
import { DateRange } from "@/types/date";
import { useTranslation } from "react-i18next";
import { enUS } from "date-fns/locale";
import { es } from "date-fns/locale";
import { pt } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addMonths, format } from "date-fns";
import { useMemo } from "react";

interface CalendarProps {
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange) => void;
  className?: string;
  staticDisplayLabel?: string;
  inline?: boolean;
}

export function Calendar({
  dateRange,
  onSelect,
  className,
  staticDisplayLabel,
}: CalendarProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const maxDate = useMemo(() => {
    return addMonths(new Date(), 24);
  }, []);

  const getLocale = () => {
    switch (i18n.language) {
      case "es":
        return es;
      case "pt":
        return pt;
      default:
        return enUS;
    }
  };

  const handleSelect = (ranges: any) => {
    const newRange = {
      from: ranges.selection.startDate,
      to: ranges.selection.endDate,
    };

    if (newRange.from) {
      onSelect(newRange);

      if (
        newRange.from &&
        newRange.to &&
        newRange.from.getTime() !== newRange.to.getTime()
      ) {
        setIsOpen(false);
      }
    }
  };

  // PP is a preset from date-fns to format the date in the correct language
  // like MMMM d, yyyy we were using with formatDate
  const displayValue =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "PP", {
          locale: getLocale(),
        })} - ${format(dateRange.to, "PP", {
          locale: getLocale(),
        })}`
      : staticDisplayLabel || t("camper_details.select_dates", "Select Dates");

  const calendarContent = (
    <DateRangePicker
      ranges={[
        {
          startDate: dateRange?.from || undefined,
          endDate: dateRange?.to || undefined,
          key: "selection",
        },
      ]}
      onChange={handleSelect}
      months={1}
      direction="vertical"
      minDate={new Date()}
      maxDate={maxDate}
      rangeColors={["#302724"]}
      showMonthAndYearPickers={true}
      showDateDisplay={false}
      weekStartsOn={1}
      monthDisplayFormat="MMMM yyyy"
      className={cn(
        "!border-none !shadow-none !rounded-lg",
        "[&_.rdrCalendarWrapper]:!w-auto [&_.rdrCalendarWrapper]:!font-sans [&_.rdrCalendarWrapper]:!text-sm",
        "[&_.rdrDateDisplayWrapper]:hidden",
        "[&_.rdrMonthAndYearWrapper]:!h-9 [&_.rdrMonthAndYearWrapper]:!my-0 [&_.rdrMonthAndYearWrapper]:!px-2.5",
        "[&_.rdrMonthAndYearPickers]:!text-sm [&_.rdrMonthAndYearPickers]:!font-medium",
        "[&_.rdrMonthPicker]:!p-0 [&_.rdrYearPicker]:!p-0",
        "[&_.rdrMonthAndYearPickers_select]:!px-3 [&_.rdrMonthAndYearPickers_select]:!py-1 [&_.rdrMonthAndYearPickers_select]:!pl-3 [&_.rdrMonthAndYearPickers_select]:!pr-8",
        "[&_.rdrMonthAndYearPickers_select]:!rounded-md [&_.rdrMonthAndYearPickers_select]:!text-sm",
        "[&_.rdrMonthAndYearPickers_select]:!bg-transparent [&_.rdrMonthAndYearPickers_select]:!border-gray-200",
        "[&_.rdrMonthAndYearPickers_select]:hover:!border-[#302724]",
        "[&_.rdrNextPrevButton]:!mx-1.5",
        // Fixed: Remove fixed width and ensure proper grid alignment
        "[&_.rdrMonth]:!w-auto [&_.rdrMonth]:!px-2.5 [&_.rdrMonth]:!max-w-none",
        "[&_.rdrWeekDays]:!mt-2 [&_.rdrWeekDays]:!grid [&_.rdrWeekDays]:!grid-cols-7 [&_.rdrWeekDays]:!gap-0",
        "[&_.rdrWeekDay]:!text-xs [&_.rdrWeekDay]:!font-medium [&_.rdrWeekDay]:!text-gray-500 [&_.rdrWeekDay]:!w-9 [&_.rdrWeekDay]:!h-6 [&_.rdrWeekDay]:!flex [&_.rdrWeekDay]:!items-center [&_.rdrWeekDay]:!justify-center",
        "[&_.rdrDays]:!grid [&_.rdrDays]:!grid-cols-7 [&_.rdrDays]:!gap-0",
        "[&_.rdrDay]:!h-9 [&_.rdrDay]:!w-9 [&_.rdrDay]:!flex [&_.rdrDay]:!items-center [&_.rdrDay]:!justify-center [&_.rdrDay]:!relative",
        "[&_.rdrDayNumber]:!top-1 [&_.rdrDayNumber]:!font-normal [&_.rdrDayNumber]:!text-sm [&_.rdrDayNumber]:!leading-6",
        "[&_.rdrDayToday]:!bg-transparent",
        "[&_.rdrStartEdge]:!bg-[#F08332] [&_.rdrEndEdge]:!bg-[#F08332] [&_.rdrInRange]:!bg-[#F08332]/50",
        "[&_.rdrDayHovered]:!bg-[#F08332]/10",
        "[&_.rdrDayStartPreview]:!border-[#F08332] [&_.rdrDayInPreview]:!border-[#F08332] [&_.rdrDayEndPreview]:!border-[#F08332]",
        "[&_.rdrSelected]:!text-white",
      )}
      locale={getLocale()}
    />
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative w-full", className)}>
          <Input
            readOnly
            value={displayValue}
            className="cursor-pointer bg-white pr-8 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            onClick={() => setIsOpen(true)}
            aria-label={t("camper_details.select_dates", "Select Dates")}
          />
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-3 shadow-lg border border-gray-200 bg-white rounded-lg w-auto z-[200]"
        align="center"
        sideOffset={8}
      >
        {calendarContent}
      </PopoverContent>
    </Popover>
  );
}
