import React from "react";
import { UserBookingDetails, UserBookingsData } from "../domain/types";
import { createBookingService } from "../services/BookingServices";
import { getAuthToken } from "@/modules/auth/server";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { GetSecurityDepositStatusResponse } from "@/modules/payments/domain/types";
import { createPaymentService } from "@/modules/payments/services/PaymentServices";

interface UserBookingServerProps {
  id?: string;
  children: (data: {
    userBookings?: UserBookingsData | null;
    bookingDetail?: UserBookingDetails | null;
    securityDepositStatus?: GetSecurityDepositStatusResponse | null;
    errorCode?: string;
  }) => React.ReactNode;
}

/**
 * Server Component that fetches user bookings or booking detail
 * Only handles GET operations that need server-side caching
 */
export default async function UserBookingServer({
  children,
  id,
}: UserBookingServerProps) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return (
        <>
          {children({
            userBookings: null,
            bookingDetail: null,
            securityDepositStatus: null,
            errorCode: ERROR_CODES.UNAUTHORIZED,
          })}
        </>
      );
    }

    const bookingService = createBookingService();
    const paymentService = createPaymentService();

    // if id is provided, get booking detail
    if (id) {
      const bookingDetail = await bookingService.fetchBookingDetail(token, id);
      const securityDepositStatus =
        await paymentService.getSecurityDepositStatus(token, id);
      return (
        <>
          {children({
            bookingDetail: bookingDetail || null,
            securityDepositStatus: securityDepositStatus || null,
            errorCode: undefined,
          })}
        </>
      );
    }

    // default case: get user bookings with default params
    const userBookings = await bookingService.fetchUserBookings(token, {
      limit: 10,
      offset: 0,
    });
    return <>{children({ userBookings, errorCode: undefined })}</>;
  } catch (error) {
    const errorCode =
      error instanceof ApiError ? error.tag : ERROR_CODES.UNKNOWN_ERROR;
    return (
      <>
        {children({
          userBookings: null,
          bookingDetail: null,
          errorCode,
        })}
      </>
    );
  }
}
