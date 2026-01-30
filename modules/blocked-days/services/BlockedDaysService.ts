import { BlockedDay, CreateBlockedDayRequest } from "../domain";
import { createBlockedDaysRepository } from "../repositories";
import {
  validateBlockedDayListResponse,
  validateBlockedDay,
} from "../validators";
import { IBlockedDaysService } from "./IBlockedDaysService";

export function createBlockedDaysService(): IBlockedDaysService {
  const repository = createBlockedDaysRepository();

  return {
    async getBlockedDaysByVehicleId(
      token: string,
      vehicleId: string
    ): Promise<BlockedDay[]> {
      const rawData = await repository.getBlockedDaysByVehicleId(
        token,
        vehicleId
      );
      const validated = validateBlockedDayListResponse(rawData);
      return validated.blocked_days;
    },

    async createBlockedDay(
      token: string,
      vehicleId: string,
      data: CreateBlockedDayRequest
    ): Promise<BlockedDay> {
      const rawData = await repository.createBlockedDay(token, vehicleId, data);
      return validateBlockedDay(rawData);
    },

    async deleteBlockedDay(token: string, blockedDayId: string): Promise<void> {
      await repository.deleteBlockedDay(token, blockedDayId);
    },
  };
}
