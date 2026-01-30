import { City } from "@/modules/geography/domain";

export interface ICitiesService {
  /**
   * Gets the city data by id
   *
   * @param id - The id of the city
   * @returns Promise<City> - The city by id data
   * @throws ApiError with code "validation_failed" if id is invalid
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getCityById(id: string): Promise<City>;

  /**
   * Gets all cities for a region
   *
   * @param regionId - The UUID of the region
   * @returns Promise<City[]> - Array of cities for the region
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getCitiesByRegion(regionId: string): Promise<City[]>;
}
