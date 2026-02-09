import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth.types";

/**
 * Auth utility functions for token and user data management
 */

/**
 * Get the auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

/**
 * Get decoded user data from token
 */
export const getDecodedToken = (): JwtPayload | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const decoded = getDecodedToken();
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Clear authentication data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

/**
 * Validate authentication status
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  return !isTokenExpired();
};
