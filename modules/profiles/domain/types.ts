export interface PersonalInfo {
  avatar_url?: string;
  bio?: string;
  birth_date?: string;
  created_at?: string;
  full_name: string;
  id: string;
  languages: string[];
  nationality?: string;
  personal_tax_id?: string;
  updated_at?: string;
}

export type PersonalInfoFormData = Pick<
  PersonalInfo,
  "full_name" | "birth_date" | "nationality" | "personal_tax_id" | "languages"
>;

export enum KYCStatus {
  NONE = "none",
  PENDING = "pending",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  ABANDONED = "abandoned",
  EXPIRED = "expired",
}

export const KYCStatusLabels: Record<KYCStatus, string> = {
  [KYCStatus.NONE]: "None",
  [KYCStatus.PENDING]: "Pending",
  [KYCStatus.IN_REVIEW]: "In Review",
  [KYCStatus.APPROVED]: "Approved",
  [KYCStatus.REJECTED]: "Rejected",
  [KYCStatus.ABANDONED]: "Abandoned",
  [KYCStatus.EXPIRED]: "Expired",
};

export interface KYCStatusData {
  can_create_session: boolean;
  extracted_birth_date?: string;
  extracted_dni?: string;
  extracted_full_name?: string;
  extracted_nationality?: string;
  is_verified: boolean;
  session_id?: string;
  status: KYCStatus;
  synced_at?: string;
  verified_at?: string;
}

export interface CreateKYCSessionResponse {
  existing_session: boolean;
  session_id: string;
  verification_url?: string;
}

export interface KYCSessionRequest {
  callback_url?: string;
}

// ============================================================================
// Become Owner Types
// ============================================================================

export type LanguageInfo = {
  language: string;
  level: string;
}

export type BecomeOwnerRequest = {
  personal_info: {
    full_name: string;
    birth_date?: string | null;
    personal_tax_id: string;
    nationality: string;
    languages: LanguageInfo[];
  };
  business_info: {
    type: "individual" | "business";
    name?: string | null;
    tax_id?: string | null;
  };
}

export type BecomeOwnerResponse = {
  organization_id: string;
  role: string;
  message: string;
}

