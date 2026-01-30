import { ERROR_CODES } from "@/lib/constants/errorCodes";

/**
 * Error response structure from Go backend
 */
export interface ErrorResponse {
  tag: string;
  message: string;
}

/**
 * ApiError class for typed error handling
 * Mirrors the backend error structure
 */
export class ApiError extends Error {
  constructor(
    public tag: string, // Error code for i18n lookup
    public message: string, // Fallback message from backend
  ) {
    super(message);
    this.name = "ApiError";
    this.tag = tag;
    this.message = message;
  }
}

/**
 * Parses an error response from Go backend
 */
export async function parseErrorResponse(
  response: Response,
): Promise<ApiError> {
  try {
    const data: ErrorResponse = await response.json();
    // Handle cases where message might be undefined or null
    const errorMessage =
      data.message || response.statusText || "An error occurred";
    const errorTag = data.tag || ERROR_CODES.UNKNOWN_ERROR;
    return new ApiError(errorTag, errorMessage);
  } catch {
    // Fallback if response is not JSON
    return new ApiError(
      ERROR_CODES.UNKNOWN_ERROR,
      response.statusText || "Unknown error",
    );
  }
}
