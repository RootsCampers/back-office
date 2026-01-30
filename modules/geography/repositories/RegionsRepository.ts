import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class RegionsRepository {
  private readonly baseEndpoint = "/api/regions";
  private readonly countriesEndpoint = "/api/countries";

  /**
   * Fetches region data by id
   *
   * @param id - The id of the region
   * @returns Promise<unknown> - Raw region by id data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchRegionById(id: string): Promise<unknown> {
    const endpoint = `${this.baseEndpoint}/${id}`;

    return apiFetchData<unknown>(endpoint, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["region"],
      },
    });
  }

  /**
   * Fetches all regions for a country
   *
   * @param countryCode - The ISO 3166-1 alpha-2 country code
   * @returns Promise<unknown> - Raw regions array from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchRegionsByCountry(countryCode: string): Promise<unknown> {
    const endpoint = `${this.countriesEndpoint}/${countryCode}/regions`;

    return apiFetchData<unknown>(endpoint, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["regions", `regions-${countryCode}`],
      },
    });
  }
}

/**
 * Factory function to create RegionsRepository instance
 */
export function createRegionsRepository(): RegionsRepository {
  return new RegionsRepository();
}
