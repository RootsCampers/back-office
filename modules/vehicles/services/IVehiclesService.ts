import {
  VehicleListingDetails,
  VehiclesCompleteListingData,
  VehiclesData,
  VehiclesSearchParams,
  OwnerDashboardData,
  VehicleDetail,
  VehicleRequest,
  VehicleDocumentsData,
  VehicleVideosData,
  VehicleInstructionalVideo,
  CreateVideoRequest,
  UpdateVideoRequest,
  VehicleDocument,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "@/modules/vehicles/domain";

export interface IVehiclesService {
  /**
   * Gets vehicles with search params
   *
   * @param params - The parameters for the fetch request
   * @param params.country - The country of the vehicles
   * @param params.end_date - The end date of the vehicles
   * @param params.start_date - The start date of the vehicles
   * @param params.passengers - The passengers of the vehicles
   * @param params.state - The state/region of the vehicles
   * @returns Promise<VehiclesData> - The vehicles with search params data
   * @throws ApiError with code "validation_failed" if params are invalid
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getVehiclesWithSearchParams(
    params: VehiclesSearchParams,
  ): Promise<VehiclesData>;

  /**
   * Gets the vehicle listing details by id
   *
   * @param id - The id of the vehicle
   * @returns Promise<VehicleListingDetails> - The vehicle listing details data
   * @throws ApiError with code "validation_failed" if id is invalid
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getVehicleListingDetailsById(id: string): Promise<VehicleListingDetails>;

  /**
   * Gets the vehicles complete listings data
   *
   * @returns Promise<VehiclesCompleteListingData> - The vehicles complete listings data
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   */
  getVehiclesCompleteListings(): Promise<VehiclesCompleteListingData>;

  /**
   * Gets the owner dashboard data (organization, locations, vehicles with advertisings)
   *
   * @param token - JWT access token for authentication
   * @returns Promise<OwnerDashboardData> - The owner dashboard data
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "network_error" if network is unavailable
   * @throws ApiError with code "server_error" if server returns 5xx
   * @throws ApiError with code "unauthorized" if token is invalid
   */
  getOwnerDashboard(token: string): Promise<OwnerDashboardData>;

  /**
   * Gets a vehicle by ID
   *
   * @param id - The id of the vehicle
   * @param token - JWT access token for authentication
   * @returns Promise<VehicleDetail> - The vehicle detail data
   * @throws ApiError with code "fetch_failed" if request fails
   * @throws ApiError with code "not_found" if vehicle doesn't exist
   */
  getVehicleById(id: string, token: string): Promise<VehicleDetail>;

  /**
   * Updates a vehicle
   *
   * @param id - The id of the vehicle
   * @param token - JWT access token for authentication
   * @param data - The data to update
   * @returns Promise<VehicleDetail> - The updated vehicle data
   * @throws ApiError with code "update_failed" if update fails
   * @throws ApiError with code "forbidden" if user doesn't own the vehicle
   */
  updateVehicle(id: string, token: string, data: VehicleRequest): Promise<VehicleDetail>;

  /**
   * Creates a new vehicle
   *
   * @param token - JWT access token for authentication
   * @param data - The vehicle data
   * @returns Promise<VehicleDetail> - The created vehicle data
   * @throws ApiError with code "creation_failed" if creation fails
   */
  createVehicle(token: string, data: VehicleRequest): Promise<VehicleDetail>;

  /**
   * Gets documents for a vehicle
   *
   * @param vehicleId - The id of the vehicle
   * @param token - JWT access token for authentication
   * @returns Promise<VehicleDocumentsData> - The vehicle documents
   * @throws ApiError with code "fetch_failed" if request fails
   */
  getVehicleDocuments(vehicleId: string, token: string): Promise<VehicleDocumentsData>;

  /**
   * Creates a document for a vehicle
   *
   * @param vehicleId - The id of the vehicle
   * @param token - JWT access token for authentication
   * @param data - The document data
   * @returns Promise<VehicleDocument> - The created document
   * @throws ApiError with code "creation_failed" if creation fails
   */
  createVehicleDocument(vehicleId: string, token: string, data: CreateDocumentRequest): Promise<VehicleDocument>;

  /**
   * Updates a document
   *
   * @param documentId - The id of the document
   * @param token - JWT access token for authentication
   * @param data - The document data to update
   * @returns Promise<VehicleDocument> - The updated document
   * @throws ApiError with code "update_failed" if update fails
   */
  updateVehicleDocument(documentId: string, token: string, data: UpdateDocumentRequest): Promise<VehicleDocument>;

  /**
   * Deletes a document
   *
   * @param documentId - The id of the document
   * @param token - JWT access token for authentication
   * @returns Promise<{ success: boolean; message: string }>
   * @throws ApiError with code "delete_failed" if deletion fails
   */
  deleteVehicleDocument(documentId: string, token: string): Promise<{ success: boolean; message: string }>;

  /**
   * Gets instructional videos for a vehicle
   *
   * @param vehicleId - The id of the vehicle
   * @param token - JWT access token for authentication
   * @returns Promise<VehicleVideosData> - The vehicle videos
   * @throws ApiError with code "fetch_failed" if request fails
   */
  getVehicleVideos(vehicleId: string, token: string): Promise<VehicleVideosData>;

  /**
   * Creates an instructional video for a vehicle
   *
   * @param vehicleId - The id of the vehicle
   * @param token - JWT access token for authentication
   * @param data - The video data
   * @returns Promise<VehicleInstructionalVideo> - The created video
   * @throws ApiError with code "creation_failed" if creation fails
   */
  createVehicleVideo(vehicleId: string, token: string, data: CreateVideoRequest): Promise<VehicleInstructionalVideo>;

  /**
   * Updates an instructional video
   *
   * @param videoId - The id of the video
   * @param token - JWT access token for authentication
   * @param data - The video data to update
   * @returns Promise<VehicleInstructionalVideo> - The updated video
   * @throws ApiError with code "update_failed" if update fails
   */
  updateVehicleVideo(videoId: string, token: string, data: UpdateVideoRequest): Promise<VehicleInstructionalVideo>;

  /**
   * Deletes an instructional video
   *
   * @param videoId - The id of the video
   * @param token - JWT access token for authentication
   * @returns Promise<{ success: boolean; message: string }>
   * @throws ApiError with code "delete_failed" if deletion fails
   */
  deleteVehicleVideo(videoId: string, token: string): Promise<{ success: boolean; message: string }>;
}
