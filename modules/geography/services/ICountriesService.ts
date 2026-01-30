import { Country } from "@/modules/geography/domain";

export interface ICountriesService {
  /**
   * Gets the country data by code
   *
   * @param code - The code of the country
   * @returns Promise<Country> - The country by code data
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getCountryByCode(code: string): Promise<Country>;
}
