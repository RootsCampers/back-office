import { City } from "../domain";
import {
  validateCityDataHandled,
  validateCitiesListDataHandled,
} from "../validators";
import { ICitiesService } from "./ICitiesService";
import { createCitiesRepository } from "../repositories/CitiesRepository";

export function createCitiesService(): ICitiesService {
  const repository = createCitiesRepository();

  return {
    // Gets, validates and returns city by id
    async getCityById(id: string): Promise<City> {
      const rawData = await repository.fetchCityById(id);

      const validatedData = validateCityDataHandled(rawData);

      return validatedData;
    },

    // Gets, validates and returns all cities for a region
    async getCitiesByRegion(regionId: string): Promise<City[]> {
      const rawData = await repository.fetchCitiesByRegion(regionId);

      const validatedData = validateCitiesListDataHandled(rawData);

      return validatedData;
    },
  };
}
