import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { apiFetchData } from "@/lib/api/client";

export class StorageRepository {
  private readonly baseEndpoint = "/api/storage";

  /**
   * Uploads an image (no vehicle ID required).
   * Images are stored under the authenticated user's organization.
   */
  async uploadImage(token: string, file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetchData<unknown>(`${this.baseEndpoint}/images`, {
      method: "POST",
      token,
      data: formData,
      errorCode: ERROR_CODES.UPLOAD_FAILED,
    });
  }

  /**
   * Uploads an image for a vehicle.
   * @deprecated Use uploadImage instead - vehicleId is ignored by the backend.
   */
  async uploadVehicleImage(
    token: string,
    vehicleId: string,
    file: File
  ): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetchData<unknown>(
      `${this.baseEndpoint}/vehicles/${vehicleId}/images`,
      {
        method: "POST",
        token,
        data: formData,
        errorCode: ERROR_CODES.UPLOAD_FAILED,
      }
    );
  }

  /**
   * Uploads a document for a vehicle
   */
  async uploadVehicleDocument(
    token: string,
    vehicleId: string,
    documentType: string,
    file: File
  ): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetchData<unknown>(
      `${this.baseEndpoint}/vehicles/${vehicleId}/documents/${documentType}`,
      {
        method: "POST",
        token,
        data: formData,
        errorCode: ERROR_CODES.UPLOAD_FAILED,
      }
    );
  }

  /**
   * Deletes a file from storage
   */
  async deleteFile(token: string, path: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/files`, {
      method: "DELETE",
      token,
      data: { path },
      errorCode: ERROR_CODES.DELETION_FAILED,
    });
  }
}

export function createStorageRepository(): StorageRepository {
  return new StorageRepository();
}
