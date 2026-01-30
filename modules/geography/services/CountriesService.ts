import { ICountriesService } from "./ICountriesService";
import { createCountriesRepository } from "../repositories";
import { Country } from "../domain";
import { validateCountryDataHandled } from "../validators";

export function createCountriesService(): ICountriesService {
  const repository = createCountriesRepository();

  return {
    // Gets, validates and returns country by code
    async getCountryByCode(code: string): Promise<Country> {
      const rawData = await repository.fetchCountryByCode(code);

      const validatedData = validateCountryDataHandled(rawData);

      return validatedData;
    },
  };
}
