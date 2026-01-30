import { createCancellationPoliciesRepository } from "../repositories";
import {
  validateCancellationPolicy,
  validateCancellationPolicyListResponse,
  validateCancellationPolicyTemplate,
  validateCancellationPolicyTemplateListResponse,
} from "../validators";
import type { ICancellationPoliciesService } from "./ICancellationPoliciesService";
import type {
  CreateCancellationPolicyRequest,
  UpdateCancellationPolicyRequest,
} from "../domain/types";

export function createCancellationPoliciesService(): ICancellationPoliciesService {
  const repository = createCancellationPoliciesRepository();

  return {
    // Policies
    getPoliciesByOwner: async (token: string, ownerId: string) => {
      const rawData = await repository.getPoliciesByOwner(token, ownerId);
      return validateCancellationPolicyListResponse(rawData);
    },

    getPolicyById: async (token: string, policyId: string) => {
      const rawData = await repository.getPolicyById(token, policyId);
      return validateCancellationPolicy(rawData);
    },

    createPolicy: async (
      token: string,
      data: CreateCancellationPolicyRequest
    ) => {
      const rawData = await repository.createPolicy(token, data);
      return validateCancellationPolicy(rawData);
    },

    updatePolicy: async (
      token: string,
      policyId: string,
      data: UpdateCancellationPolicyRequest
    ) => {
      const rawData = await repository.updatePolicy(token, policyId, data);
      return validateCancellationPolicy(rawData);
    },

    deletePolicy: async (token: string, policyId: string) => {
      await repository.deletePolicy(token, policyId);
    },

    // Templates
    getTemplates: async (token: string) => {
      const rawData = await repository.getTemplates(token);
      return validateCancellationPolicyTemplateListResponse(rawData);
    },

    getTemplateById: async (token: string, templateId: string) => {
      const rawData = await repository.getTemplateById(token, templateId);
      return validateCancellationPolicyTemplate(rawData);
    },
  };
}
