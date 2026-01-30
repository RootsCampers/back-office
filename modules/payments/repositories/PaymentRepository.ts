import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class PaymentRepository {
  private readonly processPaymentBaseEndpoint = "/api/payments/process";

  /**
   * Processes a payment
   *
   * @param token - The token to authenticate the request
   * @param data - The data to process the payment
   * @returns Promise<unknown> - The processed payment
   * @throws ApiError with appropriate error codes
   */
  async processPayment(token: string, data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(this.processPaymentBaseEndpoint, {
      method: "POST",
      data,
      token,
      errorCode: ERROR_CODES.CREATION_FAILED,
    });
  }

  /**
   * Processes a security deposit
   *
   * @param token - The token to authenticate the request
   * @param data - The data to process the security deposit
   * @returns Promise<unknown> - The processed security deposit
   * @throws ApiError with appropriate error codes
   */
  private readonly processSecurityDepositBaseEndpoint =
    "/api/payments/security-deposit";

  async processSecurityDeposit(token: string, data: unknown): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.processSecurityDepositBaseEndpoint}/process`,
      {
        method: "POST",
        data,
        token,
        errorCode: ERROR_CODES.CREATION_FAILED,
      },
    );
  }

  /**
   * Gets the status of a security deposit
   *
   * @param token - The token to authenticate the request
   * @param data - The data to get the status of the security deposit
   * @returns Promise<unknown> - The status of the security deposit
   * @throws ApiError with appropriate error codes
   */
  async getSecurityDepositStatus(
    token: string,
    bookingId: string,
  ): Promise<unknown> {
    return apiFetchData<unknown>(
      `${this.processSecurityDepositBaseEndpoint}/${bookingId}`,
      {
        method: "GET",
        token,
        errorCode: ERROR_CODES.FETCH_FAILED,
        next: {
          tags: ["security-deposit-status"],
        },
      },
    );
  }
}

export function createPaymentRepository(): PaymentRepository {
  return new PaymentRepository();
}
