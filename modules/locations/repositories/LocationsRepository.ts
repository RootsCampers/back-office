import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { LocationParams, CreateLocationRequest, UpdateLocationRequest } from "../domain";

export class LocationsRepository {
  private readonly baseEndpoint = "/api/locations";

  /**
   * Fetches all active locations
   *
   * @param params - The parameters for the fetch request
   * @param params.limit - The limit of the fetch request
   * @param params.offset - The offset of the fetch request
   * @returns Promise<unknown> - Raw all active locations from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchLocations(params: LocationParams): Promise<unknown> {
    return apiFetchData<unknown>(this.baseEndpoint, {
      method: "GET",
      params,
      cache: "no-store",
      retries: 2,
      defaultValue: { locations: [], total: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["locations"],
      },
    });
  }

  /**
   * Fetches locations by owner ID
   *
   * @param ownerId - The owner ID to fetch locations for
   * @param token - Auth token
   * @returns Promise<unknown> - Raw locations data
   * @throws ApiError with appropriate error codes
   */
  async fetchLocationsByOwner(ownerId: string, token: string): Promise<unknown> {
    return apiFetchData<unknown>(`/api/owners/${ownerId}/locations`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      defaultValue: { locations: [], total: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Creates a new location
   *
   * @param data - Location data to create
   * @param token - Auth token
   * @returns Promise<unknown> - Raw created location
   * @throws ApiError with appropriate error codes
   */
  async createLocation(data: CreateLocationRequest, token: string): Promise<unknown> {
    return apiFetchData<unknown>(this.baseEndpoint, {
      method: "POST",
      data,
      token,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Updates a location
   *
   * @param id - Location ID to update
   * @param data - Location data to update
   * @param token - Auth token
   * @returns Promise<unknown> - Raw updated location
   * @throws ApiError with appropriate error codes
   */
  async updateLocation(id: string, data: UpdateLocationRequest, token: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${id}`, {
      method: "PUT",
      data,
      token,
      errorCode: ERROR_CODES.UPDATE_FAILED,
    });
  }

  /**
   * Deletes a location (soft delete)
   *
   * @param id - Location ID to delete
   * @param token - Auth token
   * @returns Promise<{ message: string }> - Delete response
   * @throws ApiError with appropriate error codes
   */
  async deleteLocation(id: string, token: string): Promise<{ message: string }> {
    return apiFetchData<{ message: string }>(`${this.baseEndpoint}/${id}`, {
      method: "DELETE",
      token,
      errorCode: ERROR_CODES.DELETION_FAILED,
    });
  }
}

/**
 * Factory function to create LocationRepository instance
 */
export function createLocationsRepository(): LocationsRepository {
  return new LocationsRepository();
}
