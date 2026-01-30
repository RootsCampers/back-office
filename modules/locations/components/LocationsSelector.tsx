"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { City, Country, Region } from "@/modules/geography/domain";
import {
  chileRegions,
  chileCities,
} from "@/types/locations";

interface LocationsSelectorProps {
  selectedLocation: string;
  onSelect: (location: string) => void;
  countries: Country[];
  regions: Region[];
  cities: City[];
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

export function LocationsSelector({
  selectedLocation,
  onSelect,
  countries,
  regions,
  cities,
  isLoading = false,
  hasError = false,
  onRetry,
}: LocationsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  // Helper function to get geographic order index for regions
  const getRegionOrderIndex = (regionName: string): number => {
    const index = chileRegions.findIndex(
      (r) => r.name.toLowerCase() === regionName.toLowerCase(),
    );
    return index === -1 ? 9999 : index; // Put unknown regions at the end
  };

  // Helper function to get geographic order index for cities within a region
  const getCityOrderIndex = (
    cityName: string,
    regionId: string,
  ): number => {
    // Find the region's numeric ID from chileRegions
    const region = regions.find((r) => r.id === regionId);
    if (!region) return 9999;

    const chileRegion = chileRegions.find(
      (r) => r.name.toLowerCase() === region.name.toLowerCase(),
    );
    if (!chileRegion) return 9999;

    // Find cities for this region
    const regionCities = chileCities.filter(
      (c) => c.regionId === chileRegion.id,
    );
    const index = regionCities.findIndex(
      (c) => c.name.toLowerCase() === cityName.toLowerCase(),
    );
    return index === -1 ? 9999 : index; // Put unknown cities at the end
  };

  // Measure trigger width when it opens or component mounts
  useLayoutEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.offsetWidth;
      setPopoverWidth(width);
    }
  }, [isOpen]);

  // Build a map of region_id -> region for quick lookup
  const regionMap = new Map(regions.map((r) => [r.id, r]));
  // Build a map of country_code -> country for quick lookup
  const countryMap = new Map(countries.map((c) => [c.code, c]));
  // Build a map of region_id -> cities[]
  const citiesByRegion = new Map<string, City[]>();
  cities.forEach((city) => {
    const existing = citiesByRegion.get(city.region_id) || [];
    citiesByRegion.set(city.region_id, [...existing, city]);
  });

  // Build a map of country_code -> regions[]
  const regionsByCountry = new Map<string, Region[]>();
  regions.forEach((region) => {
    const existing = regionsByCountry.get(region.country_code) || [];
    regionsByCountry.set(region.country_code, [...existing, region]);
  });

  const getDisplayValue = () => {
    if (isLoading) return t("location_selector.loading");
    if (hasError) return t("location_selector.error");
    if (!selectedLocation) return t("location_selector.select");

    const parts = selectedLocation.split("|");
    if (parts.length < 2) return t("location_selector.select");
    const [level, countryCode, regionId, cityId] = parts;

    if (level === "city") {
      const city = cities.find((c) => c.id === cityId);
      const region = city ? regionMap.get(city.region_id) : null;
      if (city && region) return `${city.name}, ${region.name}`;
    }
    if (level === "region") {
      const region = regions.find((r) => r.id === regionId);
      const country = region ? countryMap.get(region.country_code) : null;
      if (region && country) return `${region.name}, ${country.name}`;
    }
    if (level === "country") {
      const country = countryMap.get(countryCode);
      if (country) return country.name;
    }
    return t("location_selector.select");
  };

  // Filter countries, regions, and cities based on search
  const searchLower = searchValue.toLowerCase();

  // Check if a country matches the search
  const countryMatches = (country: Country) => {
    if (!searchValue) return true;
    return country.name.toLowerCase().includes(searchLower);
  };

  // Check if a region matches the search (including its country)
  const regionMatches = (region: Region) => {
    if (!searchValue) return true;
    const country = countryMap.get(region.country_code);
    return (
      region.name.toLowerCase().includes(searchLower) ||
      country?.name.toLowerCase().includes(searchLower)
    );
  };

  // Check if a city matches the search (including its region and country)
  const cityMatches = (city: City) => {
    if (!searchValue) return true;
    const region = regionMap.get(city.region_id);
    const country = region ? countryMap.get(region.country_code) : null;
    return (
      city.name.toLowerCase().includes(searchLower) ||
      region?.name.toLowerCase().includes(searchLower) ||
      country?.name.toLowerCase().includes(searchLower)
    );
  };

  // Build grouped structure: country -> regions -> cities
  const groupedLocations: {
    [countryCode: string]: {
      country: Country;
      regions: {
        [regionId: string]: {
          region: Region;
          cities: City[];
        };
      };
    };
  } = {};

  countries.forEach((country) => {
    // Only include country if it matches search or has matching regions/cities
    const countryRegions = regionsByCountry.get(country.code) || [];
    const hasMatchingRegion = countryRegions.some((r) => regionMatches(r));
    const hasMatchingCity = countryRegions.some((region) => {
      const regionCities = citiesByRegion.get(region.id) || [];
      return regionCities.some((c) => cityMatches(c));
    });

    if (!countryMatches(country) && !hasMatchingRegion && !hasMatchingCity) {
      return; // Skip this country
    }

    groupedLocations[country.code] = {
      country,
      regions: {},
    };

    countryRegions.forEach((region) => {
      // Include region if country matches, region matches, or has matching cities
      const regionCities = citiesByRegion.get(region.id) || [];
      const hasMatchingCityInRegion = regionCities.some((c) => cityMatches(c));

      if (
        countryMatches(country) ||
        regionMatches(region) ||
        hasMatchingCityInRegion
      ) {
        // Include all cities if country or region matches, otherwise only matching cities
        const citiesToShow =
          countryMatches(country) || regionMatches(region)
            ? regionCities
            : regionCities.filter((c) => cityMatches(c));

        if (citiesToShow.length > 0) {
          groupedLocations[country.code].regions[region.id] = {
            region,
            cities: citiesToShow,
          };
        }
      }
    });
  });

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            className="h-12 rounded-full bg-white w-full justify-between text-left"
            disabled={isLoading || hasError}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 text-base font-normal">
              <MapPin className="h-4 w-4 text-black shrink-0" />
              {getDisplayValue()}
            </div>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0 opacity-50" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        {!isLoading && !hasError && (
          <PopoverContent
            className="p-0 bg-white rounded-md border border-gray-200 shadow-lg"
            align="start"
            sideOffset={8}
            style={popoverWidth ? { width: `${popoverWidth}px` } : undefined}
          >
            <div className="p-2">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder={t("location_selector.search")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {Object.entries(groupedLocations).map(
                ([countryCode, { country, regions: countryRegions }]) => {
                  // Get regions and sort by geographic order
                  const regionsInOrder = regions
                    .filter((r) => r.country_code === country.code)
                    .filter((r) => countryRegions[r.id])
                    .map((r) => ({
                      region: r,
                      cities: countryRegions[r.id]?.cities || [],
                    }))
                    .sort((a, b) => {
                      const orderA = getRegionOrderIndex(a.region.name);
                      const orderB = getRegionOrderIndex(b.region.name);
                      return orderA - orderB;
                    });

                  return (
                    <div key={countryCode} className="px-2 py-1">
                      {/* "Todo Chile" stays at the top */}
                      <div
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        onClick={() => {
                          onSelect(`country|${country.code}`);
                          setIsOpen(false);
                        }}
                      >
                        {t("location_selector.all", { country: country.name })}
                      </div>
                      {/* Regions and cities in original order */}
                      {regionsInOrder.map(({ region, cities: regionCities }) => {
                        // Get cities and sort by geographic order
                        const citiesInOrder = cities
                          .filter(
                            (c) =>
                              c.region_id === region.id &&
                              regionCities.some((rc) => rc.id === c.id),
                          )
                          .sort((a, b) => {
                            const orderA = getCityOrderIndex(a.name, region.id);
                            const orderB = getCityOrderIndex(b.name, region.id);
                            return orderA - orderB;
                          });

                        return (
                          <div key={region.id}>
                            {/* Region with indentación */}
                            <div
                              className="px-3 py-2 pl-6 hover:bg-gray-100 cursor-pointer rounded-md font-semibold"
                              onClick={() => {
                                onSelect(
                                  `region|${country.code}|${region.id}`,
                                );
                                setIsOpen(false);
                              }}
                            >
                              {region.name}
                            </div>
                            {/* Cities with more indentación in original order */}
                            {citiesInOrder.map((city) => (
                              <div
                                key={city.id}
                                className="px-3 py-2 pl-10 hover:bg-gray-100 cursor-pointer rounded-md"
                                onClick={() => {
                                  onSelect(
                                    `city|${country.code}|${region.id}|${city.id}`,
                                  );
                                  setIsOpen(false);
                                }}
                              >
                                {city.name}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                },
              )}
              {Object.keys(groupedLocations).length === 0 && (
                <div className="px-3 py-2 text-gray-500">
                  {t("location_selector.no_locations")}
                </div>
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>

      {hasError && (
        <Button
          variant="outline"
          className="mt-2 w-full text-destructive"
          onClick={handleRetry}
        >
          {t("location_selector.retry")}
        </Button>
      )}
    </div>
  );
}
