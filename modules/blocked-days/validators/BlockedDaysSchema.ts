import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { BlockedDay, BlockedDayListResponse } from "../domain";

const BlockedDaySchema = z.object({
  id: z.string(),
  vehicle_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const BlockedDayListResponseSchema = z.object({
  blocked_days: z.array(BlockedDaySchema),
  count: z.number(),
});

/**
 * Validates blocked day list response data
 * @param data - Raw data to validate
 * @returns Validated BlockedDayListResponse
 * @throws ApiError if validation fails
 */
export function validateBlockedDayListResponse(
  data: unknown,
): BlockedDayListResponse {
  const result = BlockedDayListResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("Blocked days validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid blocked days data",
    );
  }
  return result.data;
}

/**
 * Validates a single blocked day response
 * @param data - Raw data to validate
 * @returns Validated BlockedDay
 * @throws ApiError if validation fails
 */
export function validateBlockedDay(data: unknown): BlockedDay {
  const result = BlockedDaySchema.safeParse(data);
  if (!result.success) {
    console.error("Blocked day validation error:", result.error);
    throw new ApiError(
      ERROR_CODES.VALIDATION_FAILED,
      "Invalid blocked day data",
    );
  }
  return result.data;
}
