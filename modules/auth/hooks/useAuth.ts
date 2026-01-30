"use client";

import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext";

/**
 * Custom hook to use auth context
 *
 * @returns AuthContextType - Authentication state and methods
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, signOut } = useAuth()
 *
 *   if (!isAuthenticated) {
 *     return <div>Please log in</div>
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.email}</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
