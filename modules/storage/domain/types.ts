/**
 * Response from storage upload operations
 */
export interface UploadResponse {
  path: string;
  public_url: string;
  size: number;
}

/**
 * Response from storage delete operations
 */
export interface DeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Parameters for uploading a vehicle image
 */
export interface UploadVehicleImageParams {
  vehicleId: string;
  file: File;
}

/**
 * Parameters for uploading a vehicle document
 */
export interface UploadVehicleDocumentParams {
  vehicleId: string;
  documentType: string;
  file: File;
}

/**
 * Parameters for deleting a file
 */
export interface DeleteFileParams {
  path: string;
}
