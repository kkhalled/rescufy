import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";
import { onNewRequest, onRequestUpdated, startConnection } from "@/services/signalrService";
import type { HospitalRequestItem } from "../types/request-ui.types";
import { fetchHospitalRequestsApi, mapHospitalRequestItem } from "../data/hospitalRequests.api";

type LoadOptions = {
  silent?: boolean;
};

export function useHospitalRequests() {
  const [requests, setRequests] = useState<HospitalRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const toastPosition = isRTL ? "top-left" : "top-right";

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

      const items = await fetchHospitalRequestsApi(token);
      const mapped = items.map(mapHospitalRequestItem);

      setRequests(mapped);
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
  }, [t, toastPosition]);

  useEffect(() => {
    let unsubscribeNewRequest = () => {};
    let unsubscribeRequestUpdated = () => {};
    let cancelled = false;

    async function setupRealtime() {
      try {
        await startConnection();

        if (cancelled) {
          return;
        }

        unsubscribeNewRequest = onNewRequest(() => {
          void loadRequests({ silent: true });
        });

        unsubscribeRequestUpdated = onRequestUpdated(() => {
          void loadRequests({ silent: true });
        });
      } catch (error) {
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