"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks";
import { AuthSession, AuthUser } from "@/modules/auth/domain";
import decodeJWT from "@/modules/auth/utils/decode-jwt";
import { useTranslation } from "react-i18next";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Processing OAuth callback...");

        // Decode state parameter to recover redirect info
        let next = "/";
        let lng = "en";

        const stateParam = searchParams.get("state");
        if (stateParam) {
          try {
            const decoded = JSON.parse(atob(decodeURIComponent(stateParam)));
            next = decoded.next || "/";
            lng = decoded.lng || "en";
          } catch (e) {
            console.warn("Failed to decode state parameter:", e);
          }
        }

        // Check for OAuth errors from provider (in query string)
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          console.error("OAuth error:", error, errorDescription);
          router.push(
            `/${lng}/login?error=${encodeURIComponent(
              errorDescription || error,
            )}`,
          );
          return;
        }

        // GoTrue redirects with tokens in URL hash: #access_token=...&refresh_token=...
        const hash = window.location.hash.substring(1); // Remove #
        if (!hash) {
          console.error("No hash found in URL");
          router.push(`/${lng}/login?error=No tokens found`);
          return;
        }

        const hashParams = new URLSearchParams(hash);

        // Check for errors in hash
        const hashError = hashParams.get("error");
        const hashErrorDescription = hashParams.get("error_description");

        if (hashError) {
          console.error(
            "OAuth error in hash:",
            hashError,
            hashErrorDescription,
          );
          router.push(
            `/${lng}/login?error=${encodeURIComponent(
              hashErrorDescription || hashError,
            )}`,
          );
          return;
        }

        // Extract tokens from hash
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const expiresIn = hashParams.get("expires_in");

        if (!accessToken || !refreshToken) {
          console.error("Missing tokens in hash");
          router.push(`/${lng}/login?error=Missing tokens`);
          return;
        }

        // Decode JWT to get user information
        const jwtPayload = decodeJWT(accessToken);
        if (!jwtPayload || !jwtPayload.sub || !jwtPayload.email) {
          console.error("Failed to decode JWT or missing user info");
          router.push(`/${lng}/login?error=Invalid token`);
          return;
        }

        // Calculate expires_at from expires_in (seconds) or use current time + default
        const parsedExpiresIn = expiresIn ? parseInt(expiresIn, 10) : NaN;
        const expiresInSeconds =
          Number.isNaN(parsedExpiresIn) || parsedExpiresIn <= 0
            ? 3600
            : parsedExpiresIn;
        const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

        // Build AuthUser from JWT payload
        // Use same role extraction logic as AuthProvider: app_metadata.role > role > "traveler"
        const now = new Date().toISOString();
        const user: AuthUser = {
          id: jwtPayload.sub,
          email: jwtPayload.email,
          role: jwtPayload.app_metadata?.role || jwtPayload.role || "traveler",
          email_confirmed_at: now,
          created_at: now,
          app_metadata: {
            provider: jwtPayload.app_metadata?.provider || "email",
            providers: [jwtPayload.app_metadata?.provider || "email"],
          },
          user_metadata: {
            email: jwtPayload.email,
            email_verified: jwtPayload.user_metadata?.email_verified ?? false,
          },
        };

        // Build AuthSession
        const session: AuthSession = {
          access_token: accessToken,
          token_type: "bearer",
          refresh_token: refreshToken,
          expires_in: expiresInSeconds,
          expires_at: expiresAt,
          user,
        };

        // Set HttpOnly cookies via API route
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          }),
        });

        if (!sessionResponse.ok) {
          console.error(
            "Failed to set session cookies:",
            sessionResponse.status,
          );
          // Continue anyway - client state will still work for this session
        }

        // Store session in auth provider (for client-side state)
        setSession(session);

        console.log("✅ OAuth authentication successful, redirecting...");

        // Redirect to the original destination
        const redirectPath = next.startsWith("/")
          ? `/${lng}${next}`
          : `/${lng}/dashboard`;
        router.push(redirectPath);
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push(
          `/${
            searchParams.get("lng") || "en"
          }/login?error=Something went wrong`,
        );
      }
    };

    handleAuthCallback();
  }, [router, searchParams, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 cursor-default">
          {t("auth.setting_up_session", "Setting up your session...")}
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 cursor-default">
              {t("common.loading", "Loading...")}
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
