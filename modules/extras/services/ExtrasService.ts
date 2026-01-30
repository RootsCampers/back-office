import {
  AdvertisingExtra,
  CreateExtraRequest,
  UpdateExtraRequest,
} from "../domain";
import { createExtrasRepository } from "../repositories";
import { validateExtraListResponse, validateExtra } from "../validators";
import { IExtrasService } from "./IExtrasService";

export function createExtrasService(): IExtrasService {
  const repository = createExtrasRepository();

  return {
    async getExtrasByAdvertisingId(
      token: string,
      advertisingId: number
    ): Promise<AdvertisingExtra[]> {
      const rawData = await repository.getExtrasByAdvertisingId(
        token,
        advertisingId
      );
      const validated = validateExtraListResponse(rawData);
      return validated.extras;
    },

    async createExtra(
      token: string,
      data: CreateExtraRequest
    ): Promise<AdvertisingExtra> {
      const rawData = await repository.createExtra(token, data);
      return validateExtra(rawData);
    },

    async updateExtra(
      token: string,
      extraId: string,
      data: UpdateExtraRequest
    ): Promise<AdvertisingExtra> {
      const rawData = await repository.updateExtra(token, extraId, data);
      return validateExtra(rawData);
    },

    async toggleExtraStatus(
      token: string,
      extraId: string,
      isActive: boolean
    ): Promise<AdvertisingExtra> {
      const rawData = await repository.updateExtra(token, extraId, {
        is_active: isActive,
      });
      return validateExtra(rawData);
    },

    async deleteExtra(token: string, extraId: string): Promise<void> {
      await repository.deleteExtra(token, extraId);
    },
  };
}
