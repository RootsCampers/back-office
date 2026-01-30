import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "@/app/i18n/settings";
import decodeJWT from "@/modules/auth/utils/decode-jwt";
import ENVIRONMENT from "@/lib/environment";

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    // Skip all internal paths (_next), api routes, and public assets
    "/((?!_next|api|assets|favicon.ico|sw.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)",
  ],
};

const cookieName = "i18next";
const AUTH_TOKEN_COOKIE = "auth_token";
const AUTH_REFRESH_TOKEN_COOKIE = "auth_refresh_token";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  // ═══════════════════════════════════════════════════════════════════
  // 1. AUTH: Check and refresh token if needed (PRIMERO)
  // ═══════════════════════════════════════════════════════════════════
  const accessToken = req.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(AUTH_REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken && refreshToken) {
    try {
      // Decode token to check expiration
      const payload = decodeJWT(accessToken);

      // Grace period: refresh token 5 minutes before it expires
      // This prevents race conditions when multiple requests hit expired tokens simultaneously
      const gracePeriod = 5 * 60 * 1000; // 5 minutes
      const expiresAt = payload?.exp ? payload.exp * 1000 : null;
      const shouldRefresh = expiresAt && expiresAt - Date.now() < gracePeriod;

      if (shouldRefresh) {
        // Refresh token with GoTrue
        try {
          const refreshResponse = await fetch(
            `${ENVIRONMENT.AUTH_URL}/token?grant_type=refresh_token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken }),
            },
          );

          if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();

            if (newTokens.access_token) {
              // Set new tokens in HttpOnly cookies
              response.cookies.set(AUTH_TOKEN_COOKIE, newTokens.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                ...(newTokens.expires_at && {
                  expires: new Date(newTokens.expires_at * 1000),
                }),
              });

              if (newTokens.refresh_token) {
                response.cookies.set(
                  AUTH_REFRESH_TOKEN_COOKIE,
                  newTokens.refresh_token,
                  {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                  },
                );
              }
            }
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // Continue with expired token - will be handled by components
        }
      }
    } catch (error) {
      console.error("Token decode error:", error);
      // Continue - token might be invalid, components will handle it
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 2. I18N: Redirect locale if missing (DESPUÉS de auth)
  // ═══════════════════════════════════════════════════════════════════
  const pathname = req.nextUrl.pathname;

  // Check if pathname already has locale
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return response;

  // Redirect if there is no locale
  let locale: string = fallbackLng; // Default to Spanish

  const cookieLocale = req.cookies.get(cookieName)?.value;
  const acceptLanguageHeader = req.headers.get("Accept-Language");

  // Priority 1: Respect user's cookie preference if set
  if (cookieLocale && languages.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (acceptLanguageHeader) {
    // Priority 2: Detect browser language
    const parsedLocale = acceptLanguage.get(acceptLanguageHeader);

    // Map browser language to supported languages:
    // - Spanish (es) → Spanish
    // - Portuguese (pt) → Portuguese
    // - Any other language → English (lingua franca)
    if (parsedLocale === "pt") {
      locale = "pt";
    } else if (parsedLocale === "es") {
      locale = "es";
    } else if (parsedLocale) {
      // For any other detected language (including 'en'), use English
      locale = "en";
    }
    // If no language detected, fallback remains Spanish (fallbackLng)
  }

  // If pathname is root, redirect to locale root
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  // For auth callbacks, preserve all query parameters during redirect
  if (pathname.startsWith("/auth/")) {
    const searchParams = req.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${searchParams}`, req.url),
    );
  }

  // Redirect to locale path
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
}
