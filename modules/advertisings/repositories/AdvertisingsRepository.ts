import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { apiFetchData } from "@/lib/api/client";
import { ModifyAdvertisingRequest, UpdateAdvertisingWithPricingRequest } from "../domain";

export class AdvertisingsRepository {
  private readonly baseEndpoint = "/api/advertisings";
  private readonly vehiclesEndpoint = "/api/vehicles";

  /**
   * Fetches an advertising by id
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The id of the advertising to fetch
   * @returns Promise<unknown> - The fetched advertising
   * @throws ApiError with appropriate error codes
   */
  async getAdvertisingById(
    token: string,
    advertisingId: string
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${advertisingId}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["advertising"],
      },
    });
  }

  // ============================================================================
  // Pricing Rules
  // ============================================================================

  /**
   * Fetches pricing rules for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<unknown> - The pricing rules array
   * @throws ApiError with appropriate error codes
   */
  async getPricingRulesByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `/api/advertising-pricing-rules/advertising/${advertisingId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        retries: 1,
        defaultValue: [],
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
  }

  // ============================================================================
  // Advertising Extras
  // ============================================================================

  /**
   * Fetches extras for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<unknown> - The extras array
   * @throws ApiError with appropriate error codes
   */
  async getExtrasByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `/api/advertising-extras/advertising/${advertisingId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        retries: 1,
        defaultValue: [],
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
  }

  // ============================================================================
  // Advertising Offers
  // ============================================================================

  /**
   * Fetches offers for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<unknown> - The offers array
   * @throws ApiError with appropriate error codes
   */
  async getOffersByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `/api/advertising-offers/advertising/${advertisingId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        retries: 1,
        defaultValue: [],
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
  }

  // ============================================================================
  // Transactional Update (Advertising Immutability)
  // ============================================================================

  /**
   * Updates advertising with pricing rules, extras, and offers atomically.
   * This creates a NEW advertising version (immutable pattern).
   *
   * IMPORTANT: This endpoint creates a new advertising version and deactivates
   * the old one. Old bookings keep their reference to the old advertising_id,
   * preserving financial integrity.
   *
   * @param token - The token to authenticate the request
   * @param vehicleId - The vehicle ID to create advertising for
   * @param data - The advertising data with pricing rules, extras, and offers
   * @returns Promise<unknown> - The result with new advertising ID and counts
   * @throws ApiError with appropriate error codes
   */
  async updateAdvertisingWithPricing(
    token: string,
    vehicleId: string,
    data: UpdateAdvertisingWithPricingRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesEndpoint}/${vehicleId}/advertising-with-pricing`,
      {
        method: "POST",
        token,
        data,
        errorCode: ERROR_CODES.UPDATE_FAILED,
      }
    );
  }

  /**
   * Toggles the active status of an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @param data - The data to update the advertising
   * @returns Promise<unknown> - The updated advertising
   * @throws ApiError with appropriate error codes
   */
  async toggleAdvertisingStatus(token: string, advertisingId: number, data: ModifyAdvertisingRequest): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${advertisingId}`, {
      method: "PUT",
      token,
      data,
      errorCode: ERROR_CODES.UPDATE_FAILED,
    });
  }
  
}

export function createAdvertisingsRepository(): AdvertisingsRepository {
  return new AdvertisingsRepository();
}
