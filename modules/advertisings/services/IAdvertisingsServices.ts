import {
  Advertising,
  PricingRule,
  AdvertisingExtra,
  AdvertisingOffer,
  UpdateAdvertisingWithPricingRequest,
  UpdateAdvertisingWithPricingResponse,
  ModifyAdvertisingResponse,
} from "../domain";

export interface IAdvertisingsServices {
  /**
   * Fetches an advertising by id
   *
   * @param token - The token to authenticate the request
   * @param id - The id of the advertising to fetch
   * @returns Promise<Advertising> - The fetched advertising
   * @throws ApiError with appropriate error codes
   */
  getAdvertisingById(token: string, id: string): Promise<Advertising>;

  /**
   * Fetches pricing rules for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<PricingRule[]> - The pricing rules array
   * @throws ApiError with appropriate error codes
   */
  getPricingRulesByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<PricingRule[]>;

  /**
   * Fetches extras for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<AdvertisingExtra[]> - The extras array
   * @throws ApiError with appropriate error codes
   */
  getExtrasByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<AdvertisingExtra[]>;

  /**
   * Fetches offers for an advertising
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @returns Promise<AdvertisingOffer[]> - The offers array
   * @throws ApiError with appropriate error codes
   */
  getOffersByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<AdvertisingOffer[]>;

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
   * @returns Promise<UpdateAdvertisingWithPricingResponse> - The result with new advertising ID and counts
   * @throws ApiError with appropriate error codes
   */
  updateAdvertisingWithPricing(
    token: string,
    vehicleId: string,
    data: UpdateAdvertisingWithPricingRequest
  ): Promise<UpdateAdvertisingWithPricingResponse>;

  /**
   * Toggles advertising status (active/inactive).
   * This is a convenience method that fetches the current advertising data
   * and updates only the is_active field.
   *
   * @param token - The token to authenticate the request
   * @param advertisingId - The advertising ID
   * @param isActive - The new active status
   * @returns Promise<DeactivateAdvertisingResponse> - The updated advertising
   * @throws ApiError with appropriate error codes
   */
  toggleAdvertisingStatus(token: string, advertisingId: number, isActive: boolean): Promise<ModifyAdvertisingResponse>;
}
