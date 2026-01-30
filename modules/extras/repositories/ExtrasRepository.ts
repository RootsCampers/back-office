import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { apiFetchData } from "@/lib/api/client";
import { CreateExtraRequest, UpdateExtraRequest } from "../domain";

export class ExtrasRepository {
  private readonly baseEndpoint = "/api/advertising-extras";

  /**
   * Fetches extras for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<unknown> - The extras response
   * @throws ApiError with appropriate error codes
   */
  async getExtrasByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.baseEndpoint}/advertising/${advertisingId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        retries: 1,
        defaultValue: { extras: [], page_size: 20, total_count: 0 },
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
  }

  /**
   * Creates an extra for an advertising
   *
   * @param token - The token to authenticate the request
   * @param data - The extra data
   * @returns Promise<unknown> - The created extra
   * @throws ApiError with appropriate error codes
   */
  async createExtra(token: string, data: CreateExtraRequest): Promise<unknown> {
    return apiFetchData<unknown>(this.baseEndpoint, {
      method: "POST",
      token,
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Updates an extra
   *
   * @param token - The token to authenticate the request
   * @param extraId - The extra ID
   * @param data - The update data
   * @returns Promise<unknown> - The updated extra
   * @throws ApiError with appropriate error codes
   */
  async updateExtra(
    token: string,
    extraId: string,
    data: UpdateExtraRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${extraId}`, {
      method: "PUT",
      token,
      data,
      errorCode: ERROR_CODES.UPDATE_FAILED,
    });
  }

  /**
   * Deletes an extra
   *
   * @param token - The token to authenticate the request
   * @param extraId - The extra ID
   * @returns Promise<unknown> - The delete response
   * @throws ApiError with appropriate error codes
   */
  async deleteExtra(token: string, extraId: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${extraId}`, {
      method: "DELETE",
      token,
      errorCode: ERROR_CODES.DELETION_FAILED,
    });
  }
}

export function createExtrasRepository(): ExtrasRepository {
  return new ExtrasRepository();
}
