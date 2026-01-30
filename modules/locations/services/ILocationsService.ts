import {
  LocationParams,
  LocationsData,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
} from "../domain";

export interface ILocationsService {
  /**
   * Gets all active locations
   *
   * @param params - The parameters for the fetch request
   * @param params.limit - The limit of the fetch request (1-100, default: 50)
   * @param params.offset - The offset of the fetch request (>= 0, default: 0)
   * @returns Promise<LocationsData> - All active locations data
   * @throws ApiError with code "validation_failed" if params are invalid
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getLocationsData(params: LocationParams): Promise<LocationsData>;

  /**
   * Gets locations by owner ID
   *
   * @param ownerId - The owner ID to fetch locations for
   * @param token - Auth token
   * @returns Promise<LocationsData> - Owner's locations data
   */
  getLocationsByOwner(ownerId: string, token: string): Promise<LocationsData>;

  /**
   * Creates a new location
   *
   * @param data - Location data to create
   * @param token - Auth token
   * @returns Promise<Location> - Created location
   */
  createLocation(data: CreateLocationRequest, token: string): Promise<Location>;

  /**
   * Updates a location
   *
   * @param id - Location ID to update
   * @param data - Location data to update
   * @param token - Auth token
   * @returns Promise<Location> - Updated location
   */
  updateLocation(id: string, data: UpdateLocationRequest, token: string): Promise<Location>;

  /**
   * Deletes a location (soft delete)
   *
   * @param id - Location ID to delete
   * @param token - Auth token
   * @returns Promise<{ message: string }> - Delete response
   */
  deleteLocation(id: string, token: string): Promise<{ message: string }>;
}
