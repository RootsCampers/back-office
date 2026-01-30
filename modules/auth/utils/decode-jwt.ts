import { JWTPayload } from "../domain";

/**
 * Decode JWT to extract user information
 * JWT structure: header.payload.signature
 * Payload contains: sub (user id), email, role, etc.
 */
export default function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch {
    return null;
  }
}
