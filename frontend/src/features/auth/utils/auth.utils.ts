import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth.types";

/**
 * Auth utility functions for token and user data management
 */

const AUTH_TOKEN_COOKIE_KEY = "auth_token";

const getSecureCookieFlag = (): string => {
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return "; Secure";
  }
  return "";
};

/**
 * Set auth token in cookie
 */
export const setAuthToken = (token: string, tokenExpiryUnixSeconds?: number): void => {
  if (typeof document === "undefined") return;

  const secureFlag = getSecureCookieFlag();
  const expires =
    typeof tokenExpiryUnixSeconds === "number"
      ? `; Expires=${new Date(tokenExpiryUnixSeconds * 1000).toUTCString()}`
      : "";

  document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; SameSite=Strict${expires}${secureFlag}`;
};

/**
 * Get the auth token from cookies
 */
export const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const keyWithEquals = `${AUTH_TOKEN_COOKIE_KEY}=`;
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    if (cookie.startsWith(keyWithEquals)) {
      return decodeURIComponent(cookie.substring(keyWithEquals.length));
    }
  }

  return null;
};

/**
 * Clear auth token cookie
 */
export const clearAuthToken = (): void => {
  if (typeof document === "undefined") return;

  const secureFlag = getSecureCookieFlag();
  document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict${secureFlag}`;
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
  clearAuthToken();
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
