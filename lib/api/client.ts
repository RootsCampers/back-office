import ENVIRONMENT from "@/lib/environment";
import { parseErrorResponse, ApiError } from "./errors";
import { ERROR_CODES, isRetryableError } from "@/lib/constants/errorCodes";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown | FormData | URLSearchParams;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  responseType?: "json" | "blob" | "text" | "arraybuffer";
  timeout?: number;
  retries?: number;
  token?: string;
  /**
   * Next.js data cache options
   * - "force-cache": Cache indefinitely
   * - "no-store": No cache, always fresh (default)
   * - "no-cache": Cache but revalidate on each request
   * - "only-if-cached": Only use existing cache
   */
  cache?: RequestCache;
  /**
   * Next.js revalidation options for ISR (Incremental Static Regeneration)
   * - revalidate: Time in seconds to automatically revalidate
   * - tags: Tags to invalidate cache manually with revalidateTag()
   */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Options for apiFetchData with default value support
 */
interface ApiFetchDataOptions<T> extends FetchOptions {
  /**
   * Default value to return when response is empty/undefined
   * If not provided, empty data will throw an error
   */
  defaultValue?: T;
  /**
   * Error code to use when the request fails (for i18n)
   * Defaults to "fetch_failed"
   */
  errorCode?: string;
}

/**
 * Builds the URL for the API request
 * @param endpoint - The endpoint of the API
 * @param params - The parameters of the API
 * @returns The URL for the API request
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): string {
  if (!ENVIRONMENT.API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }
  const url = new URL(`${ENVIRONMENT.API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
}

/**
 * Prepares the body for the API request
 * @param data - The data to send in the request
 * @param method - The method of the API
 * @param headers - The headers of the API
 * @returns The body for the API request
 */
function prepareBody(
  data: unknown,
  method: string,
  headers: Record<string, string>,
): BodyInit | undefined {
  if (!data || method === "GET") return undefined;

  if (data instanceof FormData) {
    return data; // The browser sets Content-Type automatically
  }
  if (data instanceof URLSearchParams) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    return data;
  }
  headers["Content-Type"] = "application/json";
  return JSON.stringify(data);
}

/**
 * Parses the response from the API request
 * @param response - The response from the API request
 * @param responseType - The type of the response
 * @returns The parsed response
 */
async function parseResponse<T>(
  response: Response,
  responseType: "json" | "blob" | "text" | "arraybuffer",
): Promise<T> {
  if (!response.ok) {
    throw await parseErrorResponse(response);
  }
  const parsers = {
    json: () => response.json(),
    blob: () => response.blob(),
    text: () => response.text(),
    arraybuffer: () => response.arrayBuffer(),
  };
  return parsers[responseType]() as Promise<T>;
}

/**
 * Fetches the data from the API with a timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(ERROR_CODES.TIMEOUT, "Request timeout");
    }
    throw error;
  }
}

/**
 * Fetches the data from the API with a retry
 * @param fn - The function to fetch the data
 * @param retries - The number of retries
 * @param delay - The delay between retries
 * @returns The response from the API request
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries: number,
  delay = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!(error instanceof ApiError) || retries <= 0) throw error;

    const shouldRetry = isRetryableError(error.tag);

    if (!shouldRetry) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}

/**
 * Fetches the data from the API
 * @param endpoint - The endpoint of the API
 * @param options - The options for the API request
 * @returns The response from the API request
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    params,
    headers = {},
    data,
    responseType = "json",
    timeout = 30000,
    retries = 0,
    token,
    cache,
    next,
  } = options;

  const url = buildUrl(endpoint, params);
  if (token) headers.Authorization = `Bearer ${token}`;

  const body = prepareBody(data, method, headers);
  const fetchOptions: RequestInit = {
    method,
    headers,
    ...(body && { body }),
    ...(cache && { cache }),
    ...(next && { next }),
  };

  const fetchFn = async (): Promise<T> => {
    const response = await fetchWithTimeout(url, fetchOptions, timeout);
    return parseResponse<T>(response, responseType);
  };

  try {
    return await fetchWithRetry(fetchFn, retries);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(ERROR_CODES.NETWORK_ERROR, "Network error");
  }
}

/**
 * Fetches data from the API with full error handling
 *
 * Handles:
 * - Unwrapping ApiResponse<T>
 * - Checking success flag
 * - Default value for empty data
 * - Normalizing all errors to ApiError with proper codes
 *
 * @param endpoint - The endpoint of the API
 * @param options - The options for the API request
 * @returns The data from the API response
 *
 * @example
 * ```ts
 * // Simple fetch - throws if no data
 * const fleet = await apiFetchData<FleetData>("/api/v1/fleet");
 *
 * // With default value for empty responses
 * const fleet = await apiFetchData<FleetData>("/api/v1/fleet", {
 *   defaultValue: { fleet: [], total_count: 0 }
 * });
 *
 * // With custom error code for i18n
 * const fleet = await apiFetchData<FleetData>("/api/v1/fleet", {
 *   errorCode: "fleet_fetch_failed"
 * });
 * ```
 */
export async function apiFetchData<T = unknown>(
  endpoint: string,
  options: ApiFetchDataOptions<T> = {},
): Promise<T> {
  const {
    defaultValue,
    errorCode = ERROR_CODES.FETCH_FAILED,
    ...fetchOptions
  } = options;

  try {
    const data = await apiFetch<T>(endpoint, fetchOptions);

    // Handle empty data
    if (data === undefined || data === null) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new ApiError(errorCode, "Empty response");
    }

    return data;
  } catch (error) {
    // If it's already an ApiError, let it bubble up
    if (error instanceof ApiError) {
      throw error;
    }

    // Normalize unknown errors - use unknown_error code for i18n
    throw new ApiError(
      ERROR_CODES.UNKNOWN_ERROR,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
