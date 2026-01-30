import {
  BecomeOwnerRequest,
  BecomeOwnerResponse,
  KYCStatusData,
  PersonalInfo,
  PersonalInfoFormData,
} from "../domain";
import { createProfileRepository } from "../repositories/ProfileRepository";
import {
  validateBecomeOwnerRequestHandled,
  validateBecomeOwnerResponseHandled,
  validateCreateKYCSessionResponseHandled,
  validateKYCStatusDataHandled,
  validateProfileDataHandled,
} from "../validators";
import { IProfileServices } from "./IProfileServices";
import { CreateKYCSessionResponse, KYCSessionRequest } from "../domain/types";

export function createProfileService(): IProfileServices {
  const repository = createProfileRepository();

  return {
    async getMyProfile(token: string): Promise<PersonalInfo> {
      const rawData = await repository.getProfile(token);
      const validatedData = validateProfileDataHandled(rawData);
      return validatedData;
    },

    async updateMyProfile(
      token: string,
      data: PersonalInfoFormData,
    ): Promise<PersonalInfo> {
      const rawData = await repository.updateProfile(token, data);
      const validatedData = validateProfileDataHandled(rawData);
      return validatedData;
    },

    async getKYCStatus(token: string): Promise<KYCStatusData> {
      const rawData = await repository.getKYCStatus(token);
      const validatedData = validateKYCStatusDataHandled(rawData);
      return validatedData;
    },

    async createKYCSession(
      token: string,
      data: KYCSessionRequest,
    ): Promise<CreateKYCSessionResponse> {
      const rawData = await repository.createKYCSession(token, data);
      const validatedData = validateCreateKYCSessionResponseHandled(rawData);
      return validatedData;
    },

    async becomeOwner(
      token: string,
      data: BecomeOwnerRequest,
    ): Promise<BecomeOwnerResponse> {
      const validatedRequest = validateBecomeOwnerRequestHandled(data);
      const rawData = await repository.becomeOwner(token, validatedRequest);
      const validatedData = validateBecomeOwnerResponseHandled(rawData);
      return validatedData;
    },
  };
}

