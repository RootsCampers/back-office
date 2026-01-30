import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class CitiesRepository {
  private readonly baseEndpoint = "/api/cities";
  private readonly regionsEndpoint = "/api/regions";

  /**
   * Fetches city data by id
   *
   * @pathParam id - The id of the city
   * @returns Promise<unknown> - Raw city by id data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchCityById(id: string): Promise<unknown> {
    const endpoint = `${this.baseEndpoint}/${id}`;

    return apiFetchData<unknown>(endpoint, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["city"],
      },
    });
  }

  /**
   * Fetches all cities for a region
   *
   * @param regionId - The UUID of the region
   * @returns Promise<unknown> - Raw cities array from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchCitiesByRegion(regionId: string): Promise<unknown> {
    const endpoint = `${this.regionsEndpoint}/${regionId}/cities`;

    return apiFetchData<unknown>(endpoint, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["cities", `cities-${regionId}`],
      },
    });
  }
}

/**
 * Factory function to create CitiesRepository instance
 */
export function createCitiesRepository(): CitiesRepository {
  return new CitiesRepository();
}
