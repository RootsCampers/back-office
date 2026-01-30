import type { UploadResponse, DeleteResponse } from "../domain/types";

export interface IStorageService {
  /**
   * Uploads an image (no vehicle ID required).
   * Images are stored under the authenticated user's organization.
   * Use this for new camper creation or when vehicle ID is not available.
   */
  uploadImage(token: string, file: File): Promise<UploadResponse>;

  /**
   * Uploads an image for a vehicle.
   * @deprecated Use uploadImage instead - vehicleId is ignored by the backend.
   */
  uploadVehicleImage(
    token: string,
    vehicleId: string,
    file: File
  ): Promise<UploadResponse>;

  /**
   * Uploads a document for a vehicle
   */
  uploadVehicleDocument(
    token: string,
    vehicleId: string,
    documentType: string,
    file: File
  ): Promise<UploadResponse>;

  /**
   * Deletes a file from storage
   */
  deleteFile(token: string, path: string): Promise<DeleteResponse>;
}
