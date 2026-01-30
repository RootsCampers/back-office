import {
  BecomeOwnerRequest,
  BecomeOwnerResponse,
  CreateKYCSessionResponse,
  KYCSessionRequest,
  KYCStatusData,
  PersonalInfo,
  PersonalInfoFormData,
} from "../domain/types";

export interface IProfileServices {
  /**
   * Gets the user's profile
   *
   * @param token - The token to authenticate the request
   * @returns Promise<PersonalInfo> - The user's profile
   */
  getMyProfile(token: string): Promise<PersonalInfo>;
  /**
   * Updates the user's profile
   *
   * @param token - The token to authenticate the request
   * @param data - The data to update the profile
   * @returns Promise<PersonalInfo> - The updated profile
   */
  updateMyProfile(
    token: string,
    data: PersonalInfoFormData,
  ): Promise<PersonalInfo>;
  /**
   * Gets the user's KYC status
   *
   * @param token - The token to authenticate the request
   * @returns Promise<KYCStatusData> - The user's KYC status
   */
  getKYCStatus(token: string): Promise<KYCStatusData>;
  /**
   * Creates a new KYC session
   *
   * @param token - The token to authenticate the request
   * @param data - The data to create the KYC session
   * @returns Promise<CreateKYCSessionResponse> - The created KYC session
   */
  createKYCSession(
    token: string,
    data: KYCSessionRequest,
  ): Promise<CreateKYCSessionResponse>;
  /**
   * Registers the user as an owner
   *
   * @param token - The token to authenticate the request
   * @param data - The become-owner request data
   * @returns Promise<BecomeOwnerResponse> - The become-owner response
   */
  becomeOwner(
    token: string,
    data: BecomeOwnerRequest,
  ): Promise<BecomeOwnerResponse>;
}

