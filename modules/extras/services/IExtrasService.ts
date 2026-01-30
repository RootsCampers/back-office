import {
  AdvertisingExtra,
  CreateExtraRequest,
  UpdateExtraRequest,
} from "../domain";

export interface IExtrasService {
  /**
   * Get all extras for an advertising
   * @param token - Authentication token
   * @param advertisingId - The advertising ID
   * @returns Array of extras
   */
  getExtrasByAdvertisingId(
    token: string,
    advertisingId: number
  ): Promise<AdvertisingExtra[]>;

  /**
   * Create a new extra for an advertising
   * @param token - Authentication token
   * @param data - The extra data
   * @returns The created extra
   */
  createExtra(token: string, data: CreateExtraRequest): Promise<AdvertisingExtra>;

  /**
   * Update an extra
   * @param token - Authentication token
   * @param extraId - The extra ID
   * @param data - The update data
   * @returns The updated extra
   */
  updateExtra(
    token: string,
    extraId: string,
    data: UpdateExtraRequest
  ): Promise<AdvertisingExtra>;

  /**
   * Toggle the active status of an extra
   * @param token - Authentication token
   * @param extraId - The extra ID
   * @param isActive - The new active status
   * @returns The updated extra
   */
  toggleExtraStatus(
    token: string,
    extraId: string,
    isActive: boolean
  ): Promise<AdvertisingExtra>;

  /**
   * Delete an extra
   * @param token - Authentication token
   * @param extraId - The extra ID
   */
  deleteExtra(token: string, extraId: string): Promise<void>;
}
