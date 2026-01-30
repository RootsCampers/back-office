"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleManufacturer } from "@/types/vehicles";
import { cn } from "@/lib/styles";

interface VehicleSelectorProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  manufacturers: VehicleManufacturer[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  showModels?: boolean; // If true, shows models instead of manufacturers
}

export function VehicleSelector({
  selectedValue,
  onSelect,
  manufacturers,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  disabled = false,
  showModels = false,
}: VehicleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get either manufacturers or models based on showModels prop
  const items = showModels
    ? manufacturers.flatMap((m) =>
        m.models.map((model) => ({ value: model.name, label: model.name })),
      )
    : manufacturers.map((m) => ({ value: m.name, label: m.name }));

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedValue || placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded-md border border-gray-200 shadow-lg z-50">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm mx-2 my-1"
                onClick={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                  setSearchValue("");
                }}
              >
                {item.label}
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
