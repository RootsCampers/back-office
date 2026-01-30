import { BlockedDay, CreateBlockedDayRequest } from "../domain";

export interface IBlockedDaysService {
  /**
   * Get all blocked days for a vehicle
   * @param token - Authentication token
   * @param vehicleId - The vehicle ID
   * @returns Array of blocked days
   */
  getBlockedDaysByVehicleId(
    token: string,
    vehicleId: string
  ): Promise<BlockedDay[]>;

  /**
   * Create a new blocked day for a vehicle
   * @param token - Authentication token
   * @param vehicleId - The vehicle ID
   * @param data - The blocked day data
   * @returns The created blocked day
   */
  createBlockedDay(
    token: string,
    vehicleId: string,
    data: CreateBlockedDayRequest
  ): Promise<BlockedDay>;

  /**
   * Delete a blocked day
   * @param token - Authentication token
   * @param blockedDayId - The blocked day ID
   */
  deleteBlockedDay(token: string, blockedDayId: string): Promise<void>;
}
