import { IVehiclesService } from "./IVehiclesService";
import { createVehicleRepository } from "@/modules/vehicles/repositories";
import {
  validateVehicleListingDetailsDataHandled,
  validateVehiclesCompleteListingsDataHandled,
  validateVehiclesDataHandled,
  validateVehiclesSearchParamsHandled,
  validateOwnerDashboardDataHandled,
  validateVehicleDetailHandled,
  validateVehicleDocumentsDataHandled,
  validateVehicleVideosDataHandled,
  validateVehicleInstructionalVideo,
  validateVehicleDocument,
  validateVehicleRequestDataHandled,
} from "@/modules/vehicles/validators";
import {
  VehiclesSearchParams,
  VehiclesData,
  VehiclesCompleteListingData,
  VehicleListingDetails,
  OwnerDashboardData,
  VehicleDetail,
  VehicleRequest,
  VehicleDocumentsData,
  VehicleVideosData,
  VehicleInstructionalVideo,
  VehicleDocument,
  CreateVideoRequest,
  UpdateVideoRequest,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "../domain/types";

/**
 * Creates the Vehicles Service
 *
 * Architecture:
 * - Repository: Handles HTTP communication with Go backend via Caddy
 * - Validator: Validates response structure with Zod
 * - Service: Orchestrates Repository + Validator, handles business logic
 *
 * Key principles:
 * - Let errors bubble up naturally (ApiError from Repository or Validator)
 * - Type-safe validation ensures data integrity
 * - Separation of concerns: HTTP, validation, business logic
 */
export function createVehiclesService(): IVehiclesService {
  const repository = createVehicleRepository();

  return {
    // Gets, validates and returns vehicles with search params
    async getVehiclesWithSearchParams(
      params: VehiclesSearchParams,
    ): Promise<VehiclesData> {
      const validatedParams = validateVehiclesSearchParamsHandled(params);

      const rawData = await repository.fetchVehiclesWithSearchParams(
        validatedParams,
      );

      const validatedData = validateVehiclesDataHandled(rawData);

      return validatedData;
    },

    // Gets, validates and returns vehicle listing details by id
    async getVehicleListingDetailsById(
      id: string,
    ): Promise<VehicleListingDetails> {
      const rawData = await repository.fetchVehicleListingById(id);

      const validatedData = validateVehicleListingDetailsDataHandled(rawData);

      return validatedData;
    },

    // Gets, validates and returns vehicles complete listings data
    async getVehiclesCompleteListings(): Promise<VehiclesCompleteListingData> {
      const rawData = await repository.fetchVehiclesCompleteListings();

      const validatedData =
        validateVehiclesCompleteListingsDataHandled(rawData);

      return validatedData;
    },

    // Gets, validates and returns owner dashboard data
    async getOwnerDashboard(token: string): Promise<OwnerDashboardData> {
      const rawData = await repository.fetchOwnerDashboard(token);

      const validatedData = validateOwnerDashboardDataHandled(rawData);

      return validatedData;
    },

    // Gets a vehicle by ID
    async getVehicleById(id: string, token: string): Promise<VehicleDetail> {
      const rawData = await repository.fetchVehicleById(id, token);

      const validatedData = validateVehicleDetailHandled(rawData);

      return validatedData;
    },

    // Updates a vehicle
    async updateVehicle(
      id: string,
      token: string,
      data: VehicleRequest
    ): Promise<VehicleDetail> {
      const validateRequestData = validateVehicleRequestDataHandled(data);
      const rawData = await repository.updateVehicle(id, token, validateRequestData);

      const validatedData = validateVehicleDetailHandled(rawData);

      return validatedData;
    },

    // Creates a new vehicle
    async createVehicle(
      token: string,
      data: VehicleRequest
    ): Promise<VehicleDetail> {
      const validateRequestData = validateVehicleRequestDataHandled(data);
      const rawData = await repository.createVehicle(token, validateRequestData);

      const validatedData = validateVehicleDetailHandled(rawData);

      return validatedData;
    },

    // Gets documents for a vehicle
    async getVehicleDocuments(
      vehicleId: string,
      token: string
    ): Promise<VehicleDocumentsData> {
      const rawData = await repository.fetchVehicleDocuments(vehicleId, token);

      const validatedData = validateVehicleDocumentsDataHandled(rawData);

      return validatedData;
    },

    // Gets instructional videos for a vehicle
    async getVehicleVideos(
      vehicleId: string,
      token: string
    ): Promise<VehicleVideosData> {
      const rawData = await repository.fetchVehicleVideos(vehicleId, token);

      const validatedData = validateVehicleVideosDataHandled(rawData);

      return validatedData;
    },

    // Creates an instructional video for a vehicle
    async createVehicleVideo(
      vehicleId: string,
      token: string,
      data: CreateVideoRequest
    ): Promise<VehicleInstructionalVideo> {
      const rawData = await repository.createVehicleVideo(vehicleId, token, data);

      const validatedData = validateVehicleInstructionalVideo(rawData);

      return validatedData;
    },

    // Updates an instructional video
    async updateVehicleVideo(
      videoId: string,
      token: string,
      data: UpdateVideoRequest
    ): Promise<VehicleInstructionalVideo> {
      const rawData = await repository.updateVehicleVideo(videoId, token, data);

      const validatedData = validateVehicleInstructionalVideo(rawData);

      return validatedData;
    },

    // Deletes an instructional video
    async deleteVehicleVideo(
      videoId: string,
      token: string
    ): Promise<{ success: boolean; message: string }> {
      return repository.deleteVehicleVideo(videoId, token);
    },

    // Creates a document for a vehicle
    async createVehicleDocument(
      vehicleId: string,
      token: string,
      data: CreateDocumentRequest
    ): Promise<VehicleDocument> {
      const rawData = await repository.createVehicleDocument(vehicleId, token, data);

      const validatedData = validateVehicleDocument(rawData);

      return validatedData;
    },

    // Updates a document
    async updateVehicleDocument(
      documentId: string,
      token: string,
      data: UpdateDocumentRequest
    ): Promise<VehicleDocument> {
      const rawData = await repository.updateVehicleDocument(documentId, token, data);

      const validatedData = validateVehicleDocument(rawData);

      return validatedData;
    },

    // Deletes a document
    async deleteVehicleDocument(
      documentId: string,
      token: string
    ): Promise<{ success: boolean; message: string }> {
      return repository.deleteVehicleDocument(documentId, token);
    },
  };
}
