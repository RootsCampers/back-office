"use server";

import { revalidateTag } from "next/cache";

/**
 * Server Action to revalidate profile cache
 * Call this after updating profile data to invalidate cached GET requests
 */
export async function revalidateProfile() {
  revalidateTag("profile");
}

/**
 * Server Action to revalidate KYC status cache
 * Call this after creating/updating KYC sessions
 */
export async function revalidateKYCStatus() {
  revalidateTag("kyc_status");
}
