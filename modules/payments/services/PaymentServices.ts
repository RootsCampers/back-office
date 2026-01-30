import { PaymentRequest, ProcessSecurityDepositRequest } from "../domain";
import { createPaymentRepository } from "../repositories/PaymentRepository";
import {
  validateGetSecurityDepositStatusResponseHandled,
  validatePaymentRequestHandled,
  validatePaymentResponseHandled,
  validateProcessSecurityDepositRequestHandled,
  validateProcessSecurityDepositResponseHandled,
} from "../validators";
import { IPaymentServices } from "./IPaymentServices";

export function createPaymentService(): IPaymentServices {
  const repository = createPaymentRepository();

  return {
    processPayment: async (token: string, data: PaymentRequest) => {
      const validatedRequest = validatePaymentRequestHandled(data);
      const rawData = await repository.processPayment(token, validatedRequest);
      const validatedData = validatePaymentResponseHandled(rawData);
      return validatedData;
    },

    processSecurityDeposit: async (
      token: string,
      data: ProcessSecurityDepositRequest,
    ) => {
      const validatedRequest =
        validateProcessSecurityDepositRequestHandled(data);
      const rawData = await repository.processSecurityDeposit(
        token,
        validatedRequest,
      );
      const validatedData =
        validateProcessSecurityDepositResponseHandled(rawData);
      return validatedData;
    },

    getSecurityDepositStatus: async (token: string, bookingId: string) => {
      const rawData = await repository.getSecurityDepositStatus(
        token,
        bookingId,
      );
      const validatedData =
        validateGetSecurityDepositStatusResponseHandled(rawData);
      return validatedData;
    },
  };
}
