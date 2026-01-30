import { createStorageRepository } from "../repositories";
import {
  validateUploadResponse,
  validateDeleteResponse,
} from "../validators";
import type { IStorageService } from "./IStorageService";
import type { UploadResponse, DeleteResponse } from "../domain/types";

export function createStorageService(): IStorageService {
  const repository = createStorageRepository();

  return {
    async uploadImage(token: string, file: File): Promise<UploadResponse> {
      const rawData = await repository.uploadImage(token, file);
      return validateUploadResponse(rawData);
    },

    async uploadVehicleImage(
      token: string,
      vehicleId: string,
      file: File
    ): Promise<UploadResponse> {
      const rawData = await repository.uploadVehicleImage(token, vehicleId, file);
      return validateUploadResponse(rawData);
    },

    async uploadVehicleDocument(
      token: string,
      vehicleId: string,
      documentType: string,
      file: File
    ): Promise<UploadResponse> {
      const rawData = await repository.uploadVehicleDocument(
        token,
        vehicleId,
        documentType,
        file
      );
      return validateUploadResponse(rawData);
    },

    async deleteFile(token: string, path: string): Promise<DeleteResponse> {
      const rawData = await repository.deleteFile(token, path);
      return validateDeleteResponse(rawData);
    },
  };
}
