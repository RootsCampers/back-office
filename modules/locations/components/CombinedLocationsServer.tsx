import React from "react";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { City, Country, Region } from "@/modules/geography/domain";
import { Location } from "../domain";
import {
  createCountriesService,
  createRegionsService,
  createCitiesService,
} from "@/modules/geography/services";
import { createLocationsService } from "../services";

type CombinedLocationsData = {
  locations: Location[];
  countries: Country[];
  regions: Region[];
  cities: City[];
  isLoading: boolean;
  hasError: boolean;
};

interface CombinedLocationsServerProps {
  children: (data: {
    locationsData: CombinedLocationsData | null;
    errors?: {
      locations?: string;
      countries?: string;
      regions?: string;
      cities?: string;
    };
  }) => React.ReactNode;
}

/**
 * Server Component that combines active locations with geography data
 * Fetches active locations and enriches them with country, region, and city information
 */
export default async function CombinedLocationsServer({
  children,
}: CombinedLocationsServerProps) {
  // Fetch active locations
  let locations: Location[] = [];
  let locationsError: string | undefined = undefined;

  try {
    const locationsService = createLocationsService();
    const rawLocationsData = await locationsService.getLocationsData({
      limit: 50,
      offset: 0,
    });

    locations = rawLocationsData.locations;
  } catch (error) {
    console.error("Error fetching locations data:", error);
    locationsError =
      error instanceof ApiError ? error.tag : ERROR_CODES.UNKNOWN_ERROR;
  }

  // Extract unique identifiers from active locations
  const uniqueCountryCodes = new Set<string>();
  const uniqueRegionIds = new Set<string>();
  const uniqueCityIds = new Set<string>();

  locations.forEach((location) => {
    if (location.country_code) {
      uniqueCountryCodes.add(location.country_code);
    }
    if (location.region_id) {
      uniqueRegionIds.add(location.region_id);
    }
    if (location.city_id) {
      uniqueCityIds.add(location.city_id);
    }
  });

  // Fetch geography data in two phases:
  // 1. First fetch cities to get their region_ids
  // 2. Then fetch regions (including those from cities) and countries
  let countries: Country[] = [];
  let countriesError: string | undefined = undefined;
  let regions: Region[] = [];
  let regionsError: string | undefined = undefined;
  let cities: City[] = [];
  let citiesError: string | undefined = undefined;

  try {
    const countriesService = createCountriesService();
    const regionsService = createRegionsService();
    const citiesService = createCitiesService();

    // First, fetch all cities
    const citiesResults = await Promise.all(
      Array.from(uniqueCityIds).map((id) => citiesService.getCityById(id)),
    );
    cities = citiesResults;

    // Add region_ids from cities to ensure we fetch their parent regions
    cities.forEach((city) => {
      if (city.region_id) {
        uniqueRegionIds.add(city.region_id);
      }
    });

    // Now fetch regions and countries
    const [countriesResults, regionsResults] = await Promise.all([
      Promise.all(
        Array.from(uniqueCountryCodes).map((code) =>
          countriesService.getCountryByCode(code),
        ),
      ),
      Promise.all(
        Array.from(uniqueRegionIds).map((id) =>
          regionsService.getRegionById(id),
        ),
      ),
    ]);

    countries = countriesResults;
    regions = regionsResults;
  } catch (error) {
    console.error("Error fetching geography data:", error);

    const errorCode =
      error instanceof ApiError ? error.tag : ERROR_CODES.UNKNOWN_ERROR;
    countriesError = errorCode;
    regionsError = errorCode;
    citiesError = errorCode;
  }

  const hasError =
    !!locationsError || !!countriesError || !!regionsError || !!citiesError;

  // isLoading is false in server components (data is already fetched)
  // but we keep it for consistency with the type
  const isLoading = false;

  const locationsData: CombinedLocationsData | null =
    locations.length > 0 ||
    countries.length > 0 ||
    regions.length > 0 ||
    cities.length > 0
      ? { locations, countries, regions, cities, isLoading, hasError }
      : null;

  return (
    <>
      {children({
        locationsData,
        errors: {
          locations: locationsError,
          countries: countriesError,
          regions: regionsError,
          cities: citiesError,
        },
      })}
    </>
  );
}
