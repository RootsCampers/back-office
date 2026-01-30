import { apiFetch, apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { VehiclesSearchParams, VehicleRequest, CreateVideoRequest, UpdateVideoRequest, CreateDocumentRequest, UpdateDocumentRequest } from "../domain";

/**
 * Vehicles Repository
 *
 * Responsible for:
 * - Direct HTTP communication with Go backend via Caddy
 * - Endpoint configuration
 * - Request/response handling at HTTP level
 *
 * Does NOT handle:
 * - Data transformation (structure is the same)
 * - Business logic
 * - Validation (handled by Validator layer)
 */
export class VehicleRepository {
  /**
   * Fetches vehicle listing by id
   *
   * @param id - The id of the vehicle listing
   * @returns Promise<unknown> - Raw vehicle listing data from backend
   * @throws ApiError with appropriate error codes
   */
  private readonly listingsBaseEndpoint = "/api/vehicles/listings";
  async fetchVehicleListingById(id: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.listingsBaseEndpoint}/${id}`, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["vehicle_listing"],
      },
    });
  }
  /**
   * Fetches vehicles complete listings data
   *
   * @returns Promise<unknown> - Raw vehicles complete listings data from backend
   * @throws ApiError with appropriate error codes
   */
  private readonly completeListingsBaseEndpoint = "/api/listings/complete";

  async fetchVehiclesCompleteListings(): Promise<unknown> {
    return apiFetchData<unknown>(this.completeListingsBaseEndpoint, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      defaultValue: { fleet: [], total_count: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["vehicles_complete_listings"],
      },
    });
  }

  /**
   * Fetches vehicles with search params
   *
   * @param params - The parameters for the fetch request
   * @param params.country - The country of the vehicles
   * @param params.end_date - The end date of the vehicles
   * @param params.start_date - The start date of the vehicles
   * @param params.passengers - The passengers of the vehicles
   * @param params.state - The state/region of the vehicles
   * @returns Promise<unknown> - Raw vehicles with search params data from backend
   * @throws ApiError with appropriate error codes
   */

  private readonly searchBaseEndpoint = "/api/vehicles/search";

  async fetchVehiclesWithSearchParams(
    params: VehiclesSearchParams,
  ): Promise<unknown> {
    return apiFetchData<unknown>(this.searchBaseEndpoint, {
      method: "GET",
      params,
      cache: "no-store",
      retries: 2,
      defaultValue: { vehicles: [], count: 0 },
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["vehicles"],
      },
    });
  }

  // ============================================================================
  // Admin Endpoints (require authentication)
  // ============================================================================

  private readonly vehiclesBaseEndpoint = "/api/vehicles";

  /**
   * Fetches owner dashboard data (requires authentication)
   * Returns owner's organization, locations, vehicles with advertisings
   *
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw owner dashboard data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchOwnerDashboard(token: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.vehiclesBaseEndpoint}/owner-dashboard`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Fetches a single vehicle by ID (requires authentication)
   *
   * @param id - Vehicle ID
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw vehicle data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchVehicleById(id: string, token: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.vehiclesBaseEndpoint}/${id}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 1,
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Updates a vehicle (requires authentication)
   *
   * @param id - Vehicle ID
   * @param token - JWT access token for authentication
   * @param data - Partial vehicle data to update
   * @returns Promise<unknown> - Updated vehicle data
   * @throws ApiError with appropriate error codes
   */
  async updateVehicle(
    id: string,
    token: string,
    data: VehicleRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.vehiclesBaseEndpoint}/${id}`, {
      method: "PUT",
      token,
      data,
      errorCode: ERROR_CODES.UPDATE_FAILED,
    });
  }

  /**
   * Creates a new vehicle (requires authentication)
   *
   * @param token - JWT access token for authentication
   * @param data - Vehicle data
   * @returns Promise<unknown> - Created vehicle data
   * @throws ApiError with appropriate error codes
   */
  async createVehicle(
    token: string,
    data: VehicleRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(this.vehiclesBaseEndpoint, {
      method: "POST",
      token,
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Fetches documents for a vehicle (requires authentication)
   *
   * @param vehicleId - Vehicle ID
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw documents data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchVehicleDocuments(vehicleId: string, token: string): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesBaseEndpoint}/documents/vehicle/${vehicleId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        retries: 1,
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
  }

  /**
   * Creates a new document for a vehicle (requires authentication)
   *
   * @param vehicleId - Vehicle ID
   * @param token - JWT access token for authentication
   * @param data - Document data to create
   * @returns Promise<unknown> - Created document data
   * @throws ApiError with appropriate error codes
   */
  async createVehicleDocument(
    vehicleId: string,
    token: string,
    data: CreateDocumentRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesBaseEndpoint}/documents/vehicle/${vehicleId}`,
      {
        method: "POST",
        token,
        data,
        errorCode: ERROR_CODES.CREATION_FAILED,
      }
    );
  }

  /**
   * Updates a document (requires authentication)
   *
   * @param documentId - Document ID
   * @param token - JWT access token for authentication
   * @param data - Document data to update
   * @returns Promise<unknown> - Updated document data
   * @throws ApiError with appropriate error codes
   */
  async updateVehicleDocument(
    documentId: string,
    token: string,
    data: UpdateDocumentRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesBaseEndpoint}/documents/${documentId}`,
      {
        method: "PUT",
        token,
        data,
        errorCode: ERROR_CODES.UPDATE_FAILED,
      }
    );
  }

  /**
   * Deletes a document (requires authentication)
   *
   * @param documentId - Document ID
   * @param token - JWT access token for authentication
   * @returns Promise<{ success: boolean; message: string }>
   * @throws ApiError with appropriate error codes
   */
  async deleteVehicleDocument(
    documentId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(
      `${this.vehiclesBaseEndpoint}/documents/${documentId}`,
      {
        method: "DELETE",
        token,
      }
    );
  }

  /**
   * Fetches instructional videos for a vehicle (requires authentication)
   *
   * @param vehicleId - Vehicle ID
   * @param token - JWT access token for authentication
   * @returns Promise<unknown> - Raw videos data from backend
   * @throws ApiError with appropriate error codes
   */
  async fetchVehicleVideos(vehicleId: string, token: string): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesBaseEndpoint}/videos/vehicle/${vehicleId}`,
      {
        method: "GET",
        token,
        cache: "no-store",
        retries: 1,
        errorCode: ERROR_CODES.FETCH_FAILED,
      }
    );
  }

  /**
   * Creates a new instructional video for a vehicle (requires authentication)
   *
   * @param vehicleId - Vehicle ID
   * @param token - JWT access token for authentication
   * @param data - Video data to create
   * @returns Promise<unknown> - Created video data
   * @throws ApiError with appropriate error codes
   */
  async createVehicleVideo(
    vehicleId: string,
    token: string,
    data: CreateVideoRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesBaseEndpoint}/videos/vehicle/${vehicleId}`,
      {
        method: "POST",
        token,
        data,
        errorCode: ERROR_CODES.CREATION_FAILED,
      }
    );
  }

  /**
   * Updates an instructional video (requires authentication)
   *
   * @param videoId - Video ID
   * @param token - JWT access token for authentication
   * @param data - Video data to update
   * @returns Promise<unknown> - Updated video data
   * @throws ApiError with appropriate error codes
   */
  async updateVehicleVideo(
    videoId: string,
    token: string,
    data: UpdateVideoRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.vehiclesBaseEndpoint}/videos/${videoId}`,
      {
        method: "PUT",
        token,
        data,
        errorCode: ERROR_CODES.UPDATE_FAILED,
      }
    );
  }

  /**
   * Deletes an instructional video (requires authentication)
   *
   * @param videoId - Video ID
   * @param token - JWT access token for authentication
   * @returns Promise<{ success: boolean; message: string }>
   * @throws ApiError with appropriate error codes
   */
  async deleteVehicleVideo(
    videoId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(
      `${this.vehiclesBaseEndpoint}/videos/${videoId}`,
      {
        method: "DELETE",
        token,
      }
    );
  }
}

/**
 * Factory function to create VehicleRepository instance
 */
export function createVehicleRepository(): VehicleRepository {
  return new VehicleRepository();
}
