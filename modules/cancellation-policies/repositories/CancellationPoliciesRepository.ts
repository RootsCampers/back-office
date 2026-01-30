import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { apiFetchData } from "@/lib/api/client";
import type {
  CreateCancellationPolicyRequest,
  UpdateCancellationPolicyRequest,
} from "../domain/types";

export class CancellationPoliciesRepository {
  private readonly policiesEndpoint = "/api/cancellation-policies";
  private readonly templatesEndpoint = "/api/cancellation-policy-templates";

  /**
   * Fetches cancellation policies for an owner
   */
  async getPoliciesByOwner(token: string, ownerId: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.policiesEndpoint}/owner/${ownerId}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Fetches a single cancellation policy by ID
   */
  async getPolicyById(token: string, policyId: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.policiesEndpoint}/${policyId}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
    });
  }

  /**
   * Creates a new cancellation policy
   */
  async createPolicy(
    token: string,
    data: CreateCancellationPolicyRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(this.policiesEndpoint, {
      method: "POST",
      token,
      data,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Updates an existing cancellation policy
   */
  async updatePolicy(
    token: string,
    policyId: string,
    data: UpdateCancellationPolicyRequest
  ): Promise<unknown> {
    return apiFetchData<unknown>(`${this.policiesEndpoint}/${policyId}`, {
      method: "PUT",
      token,
      data,
      errorCode: ERROR_CODES.UPDATE_FAILED,
    });
  }

  /**
   * Deletes a cancellation policy
   */
  async deletePolicy(token: string, policyId: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.policiesEndpoint}/${policyId}`, {
      method: "DELETE",
      token,
      errorCode: ERROR_CODES.DELETION_FAILED,
    });
  }

  /**
   * Fetches all cancellation policy templates
   */
  async getTemplates(token: string): Promise<unknown> {
    return apiFetchData<unknown>(this.templatesEndpoint, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["cancellation-policy-templates"],
      },
    });
  }

  /**
   * Fetches a single cancellation policy template by ID
   */
  async getTemplateById(token: string, templateId: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.templatesEndpoint}/${templateId}`, {
      method: "GET",
      token,
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: {
        tags: ["cancellation-policy-templates"],
      },
    });
  }
}

export function createCancellationPoliciesRepository(): CancellationPoliciesRepository {
  return new CancellationPoliciesRepository();
}
