/**
 * API Configuration
 * Central configuration for all API endpoints
 */

export const API_CONFIG = {
  BASE_URL: "http://umedical.runasp.net",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/Auth/login",
      FORGOT_PASSWORD: "/api/Auth/forget-password",
      VERIFY_OTP: "/api/Auth/verify-reset-password-otp",
      RESET_PASSWORD: "/api/Auth/reset-password",
    },
    USERS: {
      GET_ALL: "/api/Users",
      CREATE: "/api/Users",
      UPDATE: (id: string) => `/api/Users/${id}`,
      DELETE: (id: string) => `/api/Users/${id}`,
      GET_BY_ID: (id: string) => `/api/Users/${id}`,
      ASSIGN_HOSPITAL: (userId: string, hospitalId: number) =>
        `/api/Users/${userId}/assign-hospital/${hospitalId}`,
    },
    HOSPITALS: {
      GET_ALL: "/api/Hospital",
      CREATE: "/api/Hospital",
      MY_HOSPITAL: "/api/Hospital/my-hospital",
      GET_BY_ID: (id: string) => `/api/Hospital/${id}`,
      UPDATE: (id: string) => `/api/Hospital/${id}`,
      DELETE: (id: string) => `/api/Hospital/${id}`,
      GET_STATS: (id: string) => `/api/Hospital/${id}/stats`,
      GET_REQUESTS: (id: string) => `/api/Hospital/${id}/requests`,
    },
    AMBULANCES: {
      GET_ALL: "/api/Ambulance",
      GET_BY_ID: (id: string) => `/api/Ambulance/${id}`,
      CREATE: "/api/Ambulance",
      UPDATE: (id: string) => `/api/Ambulance/${id}`,
      DELETE: (id: string) => `/api/Ambulance/${id}`,
    },
    REQUESTS: {
      GET_ALL: "/api/Request",
      GET_BY_ID: (id: string) => `/api/Request/${id}`,
    },
    DASHBOARD: {
      GET_STATS: "/api/Dashboard/stats",
      GET_CRITICAL:"/api/Dashboard/critical",
    },

  },
} as const;

/**
 * Helper function to build full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
