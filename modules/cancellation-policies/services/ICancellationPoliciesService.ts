import type {
  CancellationPolicy,
  CancellationPolicyListResponse,
  CancellationPolicyTemplate,
  CancellationPolicyTemplateListResponse,
  CreateCancellationPolicyRequest,
  UpdateCancellationPolicyRequest,
} from "../domain/types";

export interface ICancellationPoliciesService {
  // Policies
  getPoliciesByOwner(
    token: string,
    ownerId: string
  ): Promise<CancellationPolicyListResponse>;
  getPolicyById(token: string, policyId: string): Promise<CancellationPolicy>;
  createPolicy(
    token: string,
    data: CreateCancellationPolicyRequest
  ): Promise<CancellationPolicy>;
  updatePolicy(
    token: string,
    policyId: string,
    data: UpdateCancellationPolicyRequest
  ): Promise<CancellationPolicy>;
  deletePolicy(token: string, policyId: string): Promise<void>;

  // Templates
  getTemplates(token: string): Promise<CancellationPolicyTemplateListResponse>;
  getTemplateById(
    token: string,
    templateId: string
  ): Promise<CancellationPolicyTemplate>;
}
