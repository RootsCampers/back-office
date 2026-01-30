"use client";

import { createContext } from "react";
import { AuthSession, AuthUser } from "../domain";

/**
 * Type for the Auth Context value
 */
export type AuthContextType = {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setSession: (session: AuthSession) => void;
};

/**
 * Auth Context
 * Provides authentication state and methods to child components
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
