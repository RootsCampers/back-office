import { IAuthService } from "./IAuthService";
import { createAuthRepository } from "@/modules/auth/repositories";
import { validateAuthSessionHandled } from "@/modules/auth/validators";
import {
  AuthSession,
  SignUpLoginRequest,
  SignInWithOAuthRequest,
} from "../domain/types";

/**
 * Sets HttpOnly cookies via API route after successful auth
 */
async function setSessionCookies(session: AuthSession): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    }),
  });
  if (!response.ok) {
    console.error("Failed to set session cookies:", response.statusText);
    throw new Error(`Failed to set session cookies: ${response.statusText}`);
  }
}

export function createAuthService(): IAuthService {
  const repository = createAuthRepository();

  return {
    async signUp(request: SignUpLoginRequest): Promise<AuthSession> {
      const rawData = await repository.signUp(request);
      const validatedData = validateAuthSessionHandled(rawData);

      // Set HttpOnly cookies after successful signup
      await setSessionCookies(validatedData);

      return validatedData;
    },

    async signInWithPassword(
      request: SignUpLoginRequest,
    ): Promise<AuthSession> {
      const rawData = await repository.signInWithPassword(request);
      const validatedData = validateAuthSessionHandled(rawData);

      // Set HttpOnly cookies after successful login
      await setSessionCookies(validatedData);

      return validatedData;
    },

    async signInWithOAuth(request: SignInWithOAuthRequest): Promise<void> {
      // This redirects the user, so no validation needed
      // Cookies will be set after OAuth callback
      return repository.signInWithOAuth(request);
    },

    async refreshToken(refreshToken: string): Promise<AuthSession> {
      const rawData = await repository.refreshToken(refreshToken);
      const validatedData = validateAuthSessionHandled(rawData);

      // Set HttpOnly cookies after refresh
      await setSessionCookies(validatedData);

      return validatedData;
    },

    async logout(accessToken: string): Promise<void> {
      // Clear cookies first
      await fetch("/api/auth/session", {
        method: "DELETE",
      });

      // Then logout from backend
      return repository.logout(accessToken);
    },
  };
}
