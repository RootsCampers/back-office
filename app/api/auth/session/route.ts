import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * API Route for managing auth session cookies (HttpOnly)
 *
 * GET: Read session from HttpOnly cookies
 * POST: Set session in HttpOnly cookies (after login)
 * DELETE: Clear session cookies (logout)
 */

const AUTH_TOKEN_COOKIE = "auth_token";
const AUTH_REFRESH_TOKEN_COOKIE = "auth_refresh_token";

/**
 * GET /api/auth/session
 * Returns the current session from HttpOnly cookies
 * Used by Client Components to read auth state
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json({ session: null });
    }

    // Decode token to get expiration
    let expiresAt: number | null = null;
    try {
      const payload = accessToken.split(".")[1];
      if (payload) {
        const decoded = JSON.parse(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
        );
        expiresAt = decoded.exp || null;
      }
    } catch {
      // If we can't decode, return session anyway
    }

    return NextResponse.json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken || null,
        expires_at: expiresAt,
      },
    });
  } catch (error) {
    console.error("Error reading session:", error);
    return NextResponse.json({ session: null }, { status: 500 });
  }
}

/**
 * POST /api/auth/session
 * Sets HttpOnly cookies after login/signup
 * Body: { access_token, refresh_token, expires_at }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, refresh_token, expires_at } = body;

    if (!access_token) {
      return NextResponse.json(
        { error: "access_token is required" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    // Set access token cookie (HttpOnly)
    response.cookies.set(AUTH_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(expires_at && {
        expires: new Date(expires_at * 1000),
      }),
    });

    // Set refresh token cookie (HttpOnly)
    if (refresh_token) {
      response.cookies.set(AUTH_REFRESH_TOKEN_COOKIE, refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error("Error setting session:", error);
    return NextResponse.json(
      { error: "Failed to set session" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clears HttpOnly cookies (logout)
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Clear cookies by setting them to expire in the past
  response.cookies.set(AUTH_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(AUTH_REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
