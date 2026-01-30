export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: AuthUser;
}

export type AppMetadata = {
  provider: string;
  providers: string[];
};

export type UserMetadata = {
  email: string;
  email_verified: boolean;
};

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  email_confirmed_at: string; // ISO datetime string (for serialization)
  created_at: string; // ISO datetime string (for serialization)
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
}

/**
 * Valid user roles matching Go backend (rootend/api/auth/roles.go)
 */
export type UserRole = "admin" | "owner" | "traveler";

export interface JWTPayload {
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  role: string;
  app_metadata: {
    provider: string;
    role?: UserRole;
  };
  user_metadata: {
    email_verified: boolean;
  };
}

export interface SignUpLoginRequest {
  email: string;
  password: string;
}

export interface SignInWithOAuthRequest {
  provider: "google";
  redirectTo?: string;
}
