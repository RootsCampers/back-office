import { z } from "zod";
import { handleZodValidationError } from "@/lib/validation/errorHandler";
import {
  GetSecurityDepositStatusResponse,
  PaymentRequest,
  PaymentResponse,
  ProcessSecurityDepositRequest,
  ProcessSecurityDepositResponse,
} from "../domain";

const PaymentRequestSchema = z.object({
  booking_id: z.string(),
  form_data: z.object({
    installments: z.number().int().positive().default(1),
    issuer_id: z.string().optional(),
    payer: z.object({
      email: z.string(),
      first_name: z.string().optional(),
      identification: z.object({
        number: z.string(),
        type: z.string(),
      }),
      last_name: z.string().optional(),
    }),
    payment_method_id: z.string(),
    token: z.string(),
  }),
  total_amount: z.number().positive(),
});

const PaymentResponseSchema = z.object({
  card: z
    .object({
      expiration_month: z.number().int().positive().optional(),
      expiration_year: z.number().int().positive().optional(),
      first_six_digits: z.string().optional(),
      last_four_digits: z.string().optional(),
    })
    .optional(),
  message: z.string(),
  payment_id: z.string(),
  provider_id: z.string().optional(),
  status: z.string(),
  status_detail: z.string().optional(),
  success: z.boolean(),
});

export function validatePaymentRequestHandled(data: unknown): PaymentRequest {
  try {
    return PaymentRequestSchema.parse(data) as PaymentRequest;
  } catch (error) {
    handleZodValidationError(error, "payment_request");
  }
}

export function validatePaymentResponseHandled(data: unknown): PaymentResponse {
  try {
    return PaymentResponseSchema.parse(data) as PaymentResponse;
  } catch (error) {
    handleZodValidationError(error, "payment_response");
  }
}

const ProcessSecurityDepositRequestSchema = z.object({
  booking_id: z.string(),
  form_data: z.object({
    installments: z.number().int().positive().default(1),
    issuer_id: z.string().optional(),
    payer: z.object({
      email: z.string(),
      first_name: z.string().optional(),
      identification: z.object({
        number: z.string(),
        type: z.string(),
      }),
      last_name: z.string().optional(),
    }),
    payment_method_id: z.string(),
    token: z.string(),
  }),
});

const ProcessSecurityDepositResponseSchema = z.object({
  amount: z.number().positive(),
  card: z
    .object({
      expiration_month: z.number().int().positive().optional(),
      expiration_year: z.number().int().positive().optional(),
      first_six_digits: z.string().optional(),
      last_four_digits: z.string().optional(),
    })
    .optional(),
  message: z.string(),
  payment_id: z.string(),
  provider_id: z.string().optional(),
  status: z.string(),
  status_detail: z.string().optional(),
  success: z.boolean(),
});

const GetSecurityDepositStatusResponseSchema = z.object({
  amount: z.number().positive().optional(),
  created_at: z.string().optional(),
  currency: z.string().optional(),
  found: z.boolean(),
  payment_id: z.string().optional(),
  provider_payment_id: z.string().optional(),
  status: z.string().optional(),
  status_detail: z.string().optional(),
});

export function validateProcessSecurityDepositRequestHandled(
  data: unknown,
): ProcessSecurityDepositRequest {
  try {
    return ProcessSecurityDepositRequestSchema.parse(
      data,
    ) as ProcessSecurityDepositRequest;
  } catch (error) {
    handleZodValidationError(error, "process_security_deposit_request");
  }
}

export function validateProcessSecurityDepositResponseHandled(
  data: unknown,
): ProcessSecurityDepositResponse {
  try {
    return ProcessSecurityDepositResponseSchema.parse(
      data,
    ) as ProcessSecurityDepositResponse;
  } catch (error) {
    handleZodValidationError(error, "process_security_deposit_response");
  }
}

export function validateGetSecurityDepositStatusResponseHandled(
  data: unknown,
): GetSecurityDepositStatusResponse {
  try {
    return GetSecurityDepositStatusResponseSchema.parse(
      data,
    ) as GetSecurityDepositStatusResponse;
  } catch (error) {
    handleZodValidationError(error, "get_security_deposit_status_response");
  }
}
