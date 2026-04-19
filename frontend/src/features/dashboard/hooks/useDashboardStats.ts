import axios from "axios";
import { useEffect, useState } from "react";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

export type DashboardStats = {
  totalRequests: number;
  completedRequests: number;
  failedCancelledRequests: number;
  totalReports: number;
};

const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalRequests: 0,
  completedRequests: 0,
  failedCancelledRequests: 0,
  totalReports: 0,
};

const toFiniteNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const parseDashboardStats = (payload: unknown): DashboardStats => {
  if (typeof payload !== "object" || payload === null) {
    return EMPTY_DASHBOARD_STATS;
  }

  const record = payload as Record<string, unknown>;
  const source =
    typeof record.data === "object" && record.data !== null
      ? (record.data as Record<string, unknown>)
      : record;

  return {
    totalRequests: toFiniteNumber(source.totalRequests),
    completedRequests: toFiniteNumber(source.completedRequests),
    failedCancelledRequests: toFiniteNumber(source.failedCancelledRequests),
    totalReports: toFiniteNumber(source.totalReports),
  };
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_DASHBOARD_STATS);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await axios.get(
          getApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD.GET_STATS),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!isMounted) return;
        setStats(parseDashboardStats(response.data));
      } catch (error) {
        console.error("Fetch dashboard stats error:", error);
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalRequests = stats.totalRequests;
  const completedRequests = stats.completedRequests;
  const failedCancelledRequests = stats.failedCancelledRequests;
  const completionRate =
    totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;
  const failedCancelledRate =
    totalRequests > 0 ? (failedCancelledRequests / totalRequests) * 100 : 0;

  return {
    stats,
    totalRequests,
    completedRequests,
    failedCancelledRequests,
    completionRate,
    failedCancelledRate,
  };
}
