import { createContext, useContext, type ReactNode, useState, useEffect } from "react";
import type { JwtPayload, Role } from "../../features/auth/types/auth.types";

/**
 * AuthUser
 * This type describes the user object we store from the decoded JWT.
 * Keep the claim keys exactly as they come from the token so other parts
 * of the app can read them (`nameidentifier` is the user id claim).
 */
export interface AuthUser {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; // user id
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string; // email (from claim)
  FullName: string;
  PicUrl: string;
  Email: string;
  UserName: string;
  Role: Role; // "admin" | "hospital" | "ambulance"
  SecurityStamp?: string;
  aud?: string;
  exp?: number;
  iss?: string;
  jti?: string;
}

/**
 * AuthContextType
 * The shape of the context that components will use.
 * - `user`: the current user object or null
 * - `isAuthenticated`: quick boolean check
 * - `isLoading`: true while we restore user from storage
 * - `setUser`: save or clear user
 * - `logout`: clears all stored auth data (token + user)
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

// Create the context. We keep `undefined` as default so `useAuth`
// can throw a helpful error if used outside the provider.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * Wrap your app with this provider so any component can call `useAuth()`.
 * Internally it restores the user from `localStorage` (if present) and
 * keeps the user saved there for persistence across refreshes.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // `user` is the current user info (decoded JWT claims)
  const [user, setUserState] = useState<AuthUser | null>(null);
  // `isLoading` is true while we try to restore user from localStorage
  const [isLoading, setIsLoading] = useState(true);

  // On first render try to read saved user and token from localStorage.
  // If both exist, we restore the user object.
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");

    if (savedUser && token) {
      try {
        // Parse the stored JSON and set it to state
        setUserState(JSON.parse(savedUser));
      } catch (err) {
        // If parsing fails we clear storage to avoid repeated errors
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }

    // We finished the restore attempt
    setIsLoading(false);
  }, []);

  /**
   * setUser
   * Save user to state and to localStorage. Pass `null` to clear it.
   * Keep the function name simple since components will call it.
   */
  const setUser = (newUser: AuthUser | null) => {
    if (newUser) {
      setUserState(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } else {
      setUserState(null);
      localStorage.removeItem("auth_user");
    }
  };

  /**
   * logout
   * Remove both token and user from storage and clear the state.
   */
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
  };

  // Provide the context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth
 * Helper hook for components to access auth state.
 * Throws a helpful error if used outside the provider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
