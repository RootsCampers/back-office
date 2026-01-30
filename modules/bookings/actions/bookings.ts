"use server";

import { revalidateTag } from "next/cache";

/**
 * Server Action to revalidate profile cache
 * Call this after updating profile data to invalidate cached GET requests
 */
export async function revalidateBookingDetail() {
  revalidateTag("user-bookings");
  revalidateTag("user-booking-detail");
}

export async function revalidateSecurityDepositStatus() {
  revalidateTag("security-deposit-status");
}
