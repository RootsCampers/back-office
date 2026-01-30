import React from "react";
import { PersonalInfo, KYCStatusData } from "../domain/types";
import { createProfileService } from "../services/ProfileServices";
import { getAuthToken } from "@/modules/auth/server";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

interface ProfileServerProps {
  children: (data: {
    profile: PersonalInfo | null;
    kycStatus: KYCStatusData | null;
    errorCode?: string;
  }) => React.ReactNode;
}

/**
 * Server Component that fetches profile and KYC data
 * Only handles GET operations that need server-side caching
 */
export default async function ProfileServer({ children }: ProfileServerProps) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return (
        <>
          {children({
            profile: null,
            kycStatus: null,
            errorCode: ERROR_CODES.UNAUTHORIZED,
          })}
        </>
      );
    }

    const profileService = createProfileService();
    const [profile, kycStatus] = await Promise.all([
      profileService.getMyProfile(token),
      profileService.getKYCStatus(token).catch(() => null), // KYC status is optional
    ]);

    return <>{children({ profile, kycStatus: kycStatus || null })}</>;
  } catch (error) {
    const errorCode =
      error instanceof ApiError ? error.tag : ERROR_CODES.UNKNOWN_ERROR;
    return (
      <>
        {children({
          profile: null,
          kycStatus: null,
          errorCode,
        })}
      </>
    );
  }
}
