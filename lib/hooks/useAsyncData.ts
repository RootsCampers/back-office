import { useState, useCallback, useEffect } from "react";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

/**
 * State for async data fetching
 */
export interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  errorTag: string | null;
}

/**
 * Return type for useAsyncData hook
 */
export interface UseAsyncDataReturn<T> extends AsyncDataState<T> {
  /** Trigger the fetch manually */
  refetch: () => Promise<void>;
  /** Reset state to initial values */
  reset: () => void;
}

/**
 * Options for useAsyncData
 */
interface UseAsyncDataOptions<T> {
  /** Initial data value */
  initialData?: T | null;
  /** Whether to fetch on mount (default: true) */
  fetchOnMount?: boolean;
}

/**
 * Generic hook for async data fetching with error code extraction
 *
 * Handles:
 * - Loading state
 * - Error code extraction from ApiError
 * - Refetch capability
 *
 * @example
 * ```tsx
 * const { data, isLoading, errorCode, refetch } = useAsyncData(
 *   () => fleetService.getFleetData()
 * );
 *
 * if (errorCode) {
 *   return <p>{tError(errorCode)}</p>;
 * }
 * ```
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {},
): UseAsyncDataReturn<T> {
  const { initialData = null, fetchOnMount = true } = options;

  const [state, setState] = useState<AsyncDataState<T>>({
    data: initialData,
    isLoading: fetchOnMount,
    errorTag: null,
  });

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      errorTag: null,
    });
  }, [initialData]);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorTag: null }));

    try {
      const data = await fetcher();
      setState({ data, isLoading: false, errorTag: null });
    } catch (error) {
      // Extract error code - ApiError.tag maps to errors.json
      const errorTag =
        error instanceof ApiError ? error.tag : ERROR_CODES.UNKNOWN_ERROR;

      console.error("[useAsyncData] Error:", errorTag, error);
      setState({ data: null, isLoading: false, errorTag });
    }
  }, [fetcher]);

  // Fetch on mount if enabled
  useEffect(() => {
    if (fetchOnMount) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    refetch,
    reset,
  };
}
