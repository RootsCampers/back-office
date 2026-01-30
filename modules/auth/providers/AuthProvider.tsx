"use client";

import { useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { AuthSession, AuthUser } from "@/modules/auth/domain";
import { AuthContext } from "./AuthContext";
import { createAuthService } from "../services";
import decodeJWT from "../utils/decode-jwt";

// BroadcastChannel for cross-tab communication
const AUTH_CHANNEL_NAME = "auth_sync";
let authChannel: BroadcastChannel | null = null;

// Generate unique tab ID
const TAB_ID = Math.random().toString(36).substring(2, 15);

// Initialize BroadcastChannel
if (typeof window !== "undefined") {
  try {
    authChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);
  } catch (error) {
    console.warn(
      "BroadcastChannel not supported, cross-tab sync disabled",
      error,
    );
  }
}

/**
 * Fetches session from HttpOnly cookies via API route
 * Includes timeout to prevent hanging requests
 *
 * Throws on retryable errors (network, timeout, 5xx) to enable retry logic
 * Returns { session: null } for expected "no session" cases (401/403)
 */
async function fetchSessionFromServer(): Promise<{
  session: AuthSession | null;
}> {
  // Add timeout to prevent hanging requests (8 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("/api/auth/session", {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 401/403 = no session (expected case, don't retry)
    if (response.status === 401 || response.status === 403) {
      return { session: null };
    }

    // Other non-OK responses are retryable errors
    if (!response.ok) {
      throw new Error(`Session fetch failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Re-throw to allow retry logic to work
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Session fetch timeout");
    }
    throw error;
  }
}

/**
 * Converts session from API format to AuthSession format
 */
function convertApiSessionToAuthSession(
  apiSession: {
    access_token: string;
    refresh_token: string | null;
    expires_at: number | null;
  } | null,
): AuthSession | null {
  if (!apiSession?.access_token) return null;

  // Decode token to get user info
  const payload = decodeJWT(apiSession.access_token);
  if (!payload) return null;

  // Validate required JWT claims
  if (!payload.sub || !payload.email) {
    console.warn("JWT missing required claims (sub or email)");
    return null;
  }

  // Build AuthSession from token payload
  const session: AuthSession = {
    access_token: apiSession.access_token,
    refresh_token: apiSession.refresh_token || "",
    expires_at: apiSession.expires_at || payload.exp || 0,
    expires_in: apiSession.expires_at
      ? apiSession.expires_at - Math.floor(Date.now() / 1000)
      : 3600,
    token_type: "bearer",
    user: {
      id: payload.sub,
      email: payload.email,
      // Prefer app_metadata.role (set by Go backend), fallback to "traveler" for logged-in users without explicit role
      role: payload.app_metadata?.role || payload.role || "traveler",
      email_confirmed_at: new Date().toISOString(), // Token doesn't have this, use current time
      created_at: new Date().toISOString(), // Token doesn't have this, use current time
      app_metadata: {
        provider: payload.app_metadata?.provider || "email",
        providers: [payload.app_metadata?.provider || "email"],
      },
      user_metadata: {
        email: payload.email,
        email_verified: payload.user_metadata?.email_verified || false,
      },
    },
  };

  return session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshingRef = useRef(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Broadcast auth changes across tabs using BroadcastChannel
  const broadcastAuthChange = useCallback((event: string) => {
    if (!authChannel) return;

    try {
      authChannel.postMessage({
        type: "AUTH_CHANGED",
        event,
        tabId: TAB_ID,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error broadcasting auth change:", error);
    }
  }, []);

  // Update session state
  const updateSession = useCallback((newSession: AuthSession | null) => {
    setSessionState(newSession);
    setUser(newSession?.user || null);

    // Log auth state change
    if (newSession) {
      console.log("Auth state changed: SIGNED_IN", !!newSession);
    } else {
      console.log("Auth state changed: SIGNED_OUT", false);
    }

    // Schedule automatic token refresh before expiration
    // Note: Middleware handles refresh automatically, but we keep this as backup
    if (newSession?.expires_at && newSession.refresh_token) {
      const expiresIn = newSession.expires_at * 1000 - Date.now();
      const refreshIn = expiresIn - 60000; // Refresh 1 minute before expiration

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      if (refreshIn > 0) {
        refreshTimerRef.current = setTimeout(async () => {
          // Refresh from server (middleware should have already refreshed)
          const { session: refreshedSession } = await fetchSessionFromServer();
          if (refreshedSession) {
            const authSession =
              convertApiSessionToAuthSession(refreshedSession);
            if (authSession) {
              updateSession(authSession);
            }
          }
        }, refreshIn);
      }
    }
  }, []);

  // Refresh session from server
  const refreshSession = useCallback(async () => {
    if (refreshingRef.current) {
      console.log("Refresh already in progress, skipping");
      return;
    }

    try {
      refreshingRef.current = true;
      setIsLoading(true);

      const { session: apiSession } = await fetchSessionFromServer();
      const authSession = convertApiSessionToAuthSession(apiSession);

      if (authSession) {
        updateSession(authSession);
      } else {
        updateSession(null);
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      updateSession(null);
    } finally {
      refreshingRef.current = false;
      setIsLoading(false);
    }
  }, [updateSession]);

  // Initialize auth state
  useEffect(() => {
    let unmounted = false;

    const initializeAuth = async () => {
      try {
        if (unmounted) return;

        setIsLoading(true);

        // Try to fetch session with 1 retry (2 total attempts)
        let apiSession: { session: AuthSession | null } | null = null;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < 2; attempt++) {
          if (unmounted) return;

          try {
            apiSession = await fetchSessionFromServer();
            // If we got a response (even if session is null), break
            break;
          } catch (error) {
            lastError =
              error instanceof Error ? error : new Error(String(error));
            // If not the last attempt, wait 2 seconds before retry
            if (attempt < 1) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          }
        }

        // If all attempts failed, log and continue with no session
        if (!apiSession && lastError) {
          console.warn(
            "Failed to fetch session after retries, continuing without auth:",
            lastError,
          );
        }

        if (unmounted) return;

        const authSession = convertApiSessionToAuthSession(
          apiSession?.session || null,
        );

        if (authSession) {
          // Check if expired
          if (
            authSession.expires_at &&
            authSession.expires_at < Date.now() / 1000
          ) {
            updateSession(null);
          } else {
            updateSession(authSession);
          }
        } else {
          updateSession(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (!unmounted) {
          updateSession(null);
        }
      } finally {
        if (!unmounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for BroadcastChannel messages from other tabs
    if (authChannel) {
      const handleMessage = async (event: MessageEvent) => {
        const { type, event: authEvent, tabId, timestamp } = event.data;

        // Don't react to our own messages
        if (tabId === TAB_ID) return;

        // Only process recent events (within the last 5 seconds)
        if (Date.now() - timestamp > 5000) return;

        console.log("Auth change detected from another tab:", authEvent);

        if (type === "AUTH_CHANGED") {
          // Refresh session from server when another tab changes auth
          await refreshSession();
        }
      };

      authChannel.addEventListener("message", handleMessage);

      return () => {
        unmounted = true;
        authChannel?.removeEventListener("message", handleMessage);
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }
      };
    }

    return () => {
      unmounted = true;
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [updateSession, refreshSession]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get current session to extract access token
      const currentSession = session;

      // Call logout endpoint to invalidate token on server and clear cookies
      if (currentSession?.access_token) {
        const authService = createAuthService();
        try {
          await authService.logout(currentSession.access_token);
        } catch (error) {
          // Log error but continue with local cleanup
          console.error("Error calling logout endpoint:", error);
        }
      }

      // Clear local state
      updateSession(null);
      broadcastAuthChange("SIGNED_OUT");
    } catch (error) {
      console.error("Error signing out:", error);
      updateSession(null);
      broadcastAuthChange("SIGNED_OUT");
    } finally {
      setIsLoading(false);
    }
  }, [session, updateSession, broadcastAuthChange]);

  // Set session function (for signup/login flows)
  // Note: AuthService already sets cookies, we just update local state
  const setSession = useCallback(
    (newSession: AuthSession) => {
      updateSession(newSession);
      broadcastAuthChange("SIGNED_IN");
    },
    [updateSession, broadcastAuthChange],
  );

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    signOut,
    refreshSession,
    setSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
