import { Region } from "@/modules/geography/domain";

export interface IRegionsService {
  /**
   * Gets the complete regions data by id
   *
   * @param id - The id of the region
   * @returns Promise<Region> - The region by id data
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getRegionById(id: string): Promise<Region>;

  /**
   * Gets all regions for a country
   *
   * @param countryCode - The ISO 3166-1 alpha-2 country code
   * @returns Promise<Region[]> - Array of regions for the country
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getRegionsByCountry(countryCode: string): Promise<Region[]>;
}
