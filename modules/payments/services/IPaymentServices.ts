import {
  GetSecurityDepositStatusResponse,
  PaymentRequest,
  PaymentResponse,
  ProcessSecurityDepositRequest,
  ProcessSecurityDepositResponse,
} from "../domain";

export interface IPaymentServices {
  /**
   * Processes a payment
   *
   * @param token - The token to authenticate the request
   * @param data - The data to process the payment
   * @returns Promise<PaymentResponse> - The processed payment
   * @throws ApiError with appropriate error codes
   */
  processPayment(token: string, data: PaymentRequest): Promise<PaymentResponse>;

  /**
   * Processes a security deposit
   *
   * @param token - The token to authenticate the request
   * @param data - The data to process the security deposit
   * @returns Promise<ProcessSecurityDepositResponse> - The processed security deposit
   * @throws ApiError with appropriate error codes
   */
  processSecurityDeposit(
    token: string,
    data: ProcessSecurityDepositRequest,
  ): Promise<ProcessSecurityDepositResponse>;

  /**
   * Gets the status of a security deposit
   *
   * @param token - The token to authenticate the request
   * @param bookingId - The id of the booking to get the status of the security deposit
   * @returns Promise<GetSecurityDepositStatusResponse> - The status of the security deposit
   * @throws ApiError with appropriate error codes
   */
  getSecurityDepositStatus(
    token: string,
    bookingId: string,
  ): Promise<GetSecurityDepositStatusResponse>;
}
