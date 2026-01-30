import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { apiFetchData } from "@/lib/api/client";
import { CreateBlockedDayRequest } from "../domain";

export class BlockedDaysRepository {
  private readonly baseEndpoint = "/api/vehicles/blocked-days";

  /**
   * Fetches blocked days for a vehicle
   *
   * @param token - The token to authenticate the request
   * @param vehicleId - The vehicle ID
   * @returns Promise<unknown> - The blocked days response
   * @throws ApiError with appropriate error codes
   */
  async getBlockedDaysByVehicleId(
    token: string,
    vehicleId: string
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/vehicle/${vehicleId}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Creates a blocked day for a vehicle
   *
   * @param token - The token to authenticate the request
   * @param vehicleId - The vehicle ID
   * @param data - The blocked day data
   * @returns Promise<unknown> - The created blocked day
   * @throws ApiError with appropriate error codes
   */
  async createBlockedDay(
    token: string,
    vehicleId: string,
    data: CreateBlockedDayRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/vehicle/${vehicleId}`, {
      method: "POST",
      token,
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Deletes a blocked day
   *
   * @param token - The token to authenticate the request
   * @param blockedDayId - The blocked day ID
   * @returns Promise<unknown> - The delete response
   * @throws ApiError with appropriate error codes
   */
  async deleteBlockedDay(
    token: string,
    blockedDayId: string
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${blockedDayId}`, {
      method: "DELETE",
      token,
      errorCode: ERROR_CODES.DELETION_FAILED,
    });
  }
}

export function createBlockedDaysRepository(): BlockedDaysRepository {
  return new BlockedDaysRepository();
}
