"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Hook that enforces owner/admin role for protected pages.
 * Redirects to login if not authenticated, or to home if not an owner.
 *
 * @returns { isAuthorized, isLoading } - Use isLoading for skeleton states
 *
 * @example
 * ```tsx
 * function AdminPage() {
 *   const { isAuthorized, isLoading } = useRequireOwner();
 *
 *   if (isLoading || !isAuthorized) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return <AdminContent />;
 * }
 * ```
 */
export function useRequireOwner() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ lng: string }>();
  const lng = params?.lng || "es";

  const isOwnerOrAdmin = user?.role === "owner" || user?.role === "admin";
  const isAuthorized = isAuthenticated && isOwnerOrAdmin;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/${lng}/login`);
      return;
    }

    if (!isOwnerOrAdmin) {
      // User is logged in but not an owner - redirect to home
      router.push(`/${lng}`);
      return;
    }
  }, [isLoading, isAuthenticated, isOwnerOrAdmin, router, lng]);

  return {
    isAuthorized,
    isLoading,
    user,
  };
}
