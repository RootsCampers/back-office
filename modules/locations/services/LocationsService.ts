import { ILocationsService } from "./ILocationsService";
import {
  LocationParams,
  LocationsData,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
} from "../domain";
import { createLocationsRepository } from "../repositories";
import {
  validateLocationsDataHandled,
  validateLocationParamsHandled,
  validateLocationHandled,
} from "../validators";

export function createLocationsService(): ILocationsService {
  const repository = createLocationsRepository();

  return {
    // Gets, validates and returns all active locations
    async getLocationsData(params: LocationParams): Promise<LocationsData> {
      const validatedParams = validateLocationParamsHandled(params);

      const rawData = await repository.fetchLocations(validatedParams);

      const validatedData = validateLocationsDataHandled(rawData);

      return validatedData;
    },

    // Gets locations by owner ID
    async getLocationsByOwner(ownerId: string, token: string): Promise<LocationsData> {
      const rawData = await repository.fetchLocationsByOwner(ownerId, token);

      const validatedData = validateLocationsDataHandled(rawData);

      return validatedData;
    },

    // Creates a new location
    async createLocation(data: CreateLocationRequest, token: string): Promise<Location> {
      const rawData = await repository.createLocation(data, token);

      const validatedData = validateLocationHandled(rawData);

      return validatedData;
    },

    // Updates a location
    async updateLocation(id: string, data: UpdateLocationRequest, token: string): Promise<Location> {
      const rawData = await repository.updateLocation(id, data, token);

      const validatedData = validateLocationHandled(rawData);

      return validatedData;
    },

    // Deletes a location
    async deleteLocation(id: string, token: string): Promise<{ message: string }> {
      return repository.deleteLocation(id, token);
    },
  };
}
