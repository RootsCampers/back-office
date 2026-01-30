"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { countries } from "countries-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CountrySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const COUNTRIES = Object.entries(countries)
  .map(([code, data]: [string, any]) => ({
    code,
    name: data.name,
    flag: data.emoji,
  }))
  .sort((a, b) => {
    // Chile first
    if (a.code === "CL") return -1;
    if (b.code === "CL") return 1;
    return a.name.localeCompare(b.name);
  });

export function CountrySelector({
  value,
  onValueChange,
  placeholder,
  className,
}: CountrySelectorProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCountry = COUNTRIES.find((country) => country.name === value);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset search when opening
      setSearchTerm("");
      // Focus the search input after a short delay
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedCountry && (
            <span className="flex items-center gap-2">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="max-h-[300px]"
        position="popper"
        side="bottom"
        align="start"
      >
        <div className="sticky top-0 z-10 p-2 bg-white border-b shadow-sm">
          <Input
            ref={searchInputRef}
            placeholder={t("search_country")}
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              // Prevent the Select component from closing when typing
              e.stopPropagation();
              // Handle escape key to close the dropdown
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            onClick={(e) => {
              // Prevent the Select component from closing when clicking
              e.stopPropagation();
            }}
            onFocus={(e) => {
              // Prevent the Select component from closing when focusing
              e.stopPropagation();
            }}
          />
        </div>
        <div className="overflow-y-auto max-h-[250px] pt-1">
          {filteredCountries.map(({ code, name, flag }) => (
            <SelectItem key={code} value={name} className="cursor-pointer">
              <span className="flex items-center gap-2">
                <span>{flag}</span>
                <span>{name}</span>
              </span>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
