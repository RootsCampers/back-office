export type PaymentRequest = {
  booking_id: string;
  form_data: {
    installments: number;
    issuer_id?: string;
    payer: {
      email: string;
      first_name?: string;
      identification: {
        number: string;
        type: string;
      };
      last_name?: string;
    };
    payment_method_id: string;
    token: string;
  };
  total_amount: number;
};

export enum PaymentStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
  IN_PROCESS = "in_process",
}

export type PaymentResponse = {
  card?: {
    expiration_month?: number;
    expiration_year?: number;
    first_six_digits?: string;
    last_four_digits?: string;
  };
  message: string;
  payment_id: string;
  provider_id?: string;
  status: PaymentStatus;
  status_detail?: string;
  success: boolean;
};

export type ProcessSecurityDepositRequest = {
  booking_id: string;
  form_data: {
    installments: number;
    issuer_id?: string;
    payer: {
      email: string;
      first_name?: string;
      identification: {
        number: string;
        type: string;
      };
      last_name?: string;
    };
    payment_method_id: string;
    token: string;
  };
};

export type ProcessSecurityDepositResponse = {
  amount: number;
  card?: {
    expiration_month?: number;
    expiration_year?: number;
    first_six_digits?: string;
    last_four_digits?: string;
  };
  message: string;
  payment_id: string;
  provider_id?: string;
  status: PaymentStatus;
  status_detail?: string;
  success: boolean;
};

export type GetSecurityDepositStatusResponse = {
  amount?: number;
  created_at?: string;
  currency?: string;
  found: boolean;
  payment_id?: string;
  provider_payment_id?: string;
  status?: string;
  status_detail?: string;
};
