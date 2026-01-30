import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class CountriesRepository {
  private readonly baseEndpoint = "/api/countries";

  /**
   * Fetches country data by code
   *
   * @returns Promise<unknown> - Raw country by code data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchCountryByCode(code: string): Promise<unknown> {
    const endpoint = `${this.baseEndpoint}/${code}`;

    return apiFetchData<unknown>(endpoint, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["country"],
      },
    });
  }
}

/**
 * Factory function to create CountriesRepository instance
 */
export function createCountriesRepository(): CountriesRepository {
  return new CountriesRepository();
}
