import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/provider/AuthContext";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";
import { onNewRequest, onRequestUpdated, startConnection } from "@/services/signalrService";
import type { Request } from "../types/request.types";
import { fetchHospitalActiveRequestsApi } from "@/features/hospitalDashboard/data/hospitalRecentRequests.api";

type LoadOptions = {
  silent?: boolean;
};

export function useHospitalRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const toastPosition = isRTL ? "top-left" : "top-right";
  const hospitalId = Number(user?.HospitalId);
  const hasHospitalId = Number.isFinite(hospitalId) && hospitalId > 0;

  const loadRequests = useCallback(async ({ silent = false }: LoadOptions = {}) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), { position: toastPosition });
        return;
      }

      // If the user is not associated with a hospital, we consider the feed empty.
      if (!hasHospitalId) {
        setRequests([]);
        return;
      }

      // Fetch active requests for this hospital and update local state + last sync timestamp.
      const items = await fetchHospitalActiveRequestsApi(token, hospitalId);
      setRequests(items);
      setLastSyncedAt(new Date().toISOString());
    } catch (error: any) {
      console.error("Fetch hospital requests error:", error);

      if (error?.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      } else if (error?.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      } else {
        toast.error(t("requests:fetchRequests.error"), { position: toastPosition });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [hasHospitalId, hospitalId, t, toastPosition]);

  useEffect(() => {
    let unsubscribeNewRequest = () => {};
    let unsubscribeRequestUpdated = () => {};
    let cancelled = false;

    // Setup realtime: whenever the hub signals a new request or update, we refresh the hospital feed silently.
    async function setupRealtime() {
      try {
        await startConnection();

        if (cancelled) return;

        unsubscribeNewRequest = onNewRequest(() => {
          // Silent refresh keeps the current UI state while pulling the latest items.
          void loadRequests({ silent: true });
        });

        unsubscribeRequestUpdated = onRequestUpdated(() => {
          void loadRequests({ silent: true });
        });
      } catch (error) {
        // Real-time is optional: log failures but keep the feed functional.
        console.error("Hospital SignalR setup failed:", error);
      }
    }

    void loadRequests();
    void setupRealtime();

    return () => {
      cancelled = true;
      unsubscribeNewRequest();
      unsubscribeRequestUpdated();
    };
  }, [loadRequests]);

  return {
    requests,
    isLoading,
    isRefreshing,
    lastSyncedAt,
    refreshRequests: () => loadRequests({ silent: true }),
  };
}