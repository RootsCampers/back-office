import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class ProfileRepository {
  private readonly baseEndpoint = "/api/profiles";

  /**
   * Gets the user's profile
   *
   * @param token - The token to authenticate the request
   * @returns Promise<unknown> - The user's profile
   * @throws ApiError with appropriate error codes
   */
  async getProfile(token: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/me`, {
      cache: "no-store",
      retries: 2,
      method: "GET",
      token,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["profile"],
      },
    });
  }

  /**
   * Updates the user's profile
   *
   * @param token - The token to authenticate the request
   * @param data - The data to update the profile
   * @returns Promise<unknown> - The updated profile
   */
  async updateProfile(token: string, data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/me`, {
      method: "PUT",
      token,
      data,
      errorCode: ERROR_CODES.UPDATE_FAILED,
      // No cache tags needed for PUT - PUT requests are not cached
      // Cache invalidation is handled by the Server Action that calls revalidateTag("profile")
    });
  }

  /**
   * Gets the user's KYC status
   *
   * @param token - The token to authenticate the request
   * @returns Promise<unknown> - The user's KYC status
   */
  async getKYCStatus(token: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/me/kyc`, {
      method: "GET",
      params: { sync: false },
      token,
      cache: "no-store",
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["kyc_status"],
      },
    });
  }

  /**
   * Creates a new KYC session
   *
   * @param token - The token to authenticate the request
   * @param data - The data to create the KYC session
   * @returns Promise<unknown> - The created KYC session
   */
  async createKYCSession(token: string, data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/me/kyc/session`, {
      method: "POST",
      token,
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Registers the user as an owner, creating their organization
   *
   * @param token - The token to authenticate the request
   * @param data - The become-owner request data
   * @returns Promise<unknown> - The become-owner response
   */
  async becomeOwner(token: string, data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/become-owner`, {
      method: "POST",
      token,
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }
}

/**
 * Factory function to create ProfileRepository instance
 */
export function createProfileRepository(): ProfileRepository {
  return new ProfileRepository();
}

