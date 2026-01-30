import { Region } from "../domain";
import {
  validateRegionDataHandled,
  validateRegionsListDataHandled,
} from "../validators";
import { createRegionsRepository } from "../repositories";
import { IRegionsService } from "./IRegionsService";

export function createRegionsService(): IRegionsService {
  const repository = createRegionsRepository();

  return {
    // Gets, validates and returns region by id
    async getRegionById(id: string): Promise<Region> {
      const rawData = await repository.fetchRegionById(id);

      const validatedData = validateRegionDataHandled(rawData);

      return validatedData;
    },

    // Gets, validates and returns all regions for a country
    async getRegionsByCountry(countryCode: string): Promise<Region[]> {
      const rawData = await repository.fetchRegionsByCountry(countryCode);

      const validatedData = validateRegionsListDataHandled(rawData);

      return validatedData;
    },
  };
}
