import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";
import {
  onNewRequest,
  onRequestUpdated,
  startConnection,
} from "@/services/signalrService";
import type { Request } from "../types/request.types";
import {
  fetchAdminStreamApi,
  fetchRequestsApi,
} from "../data/requests.api";

function isRequestPayload(payload: unknown): payload is Request {
  return Boolean(payload && typeof payload === "object" && "id" in payload);
}

export function useGetRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const toastPosition = isRTL ? "top-left" : "top-right";

  function showFetchError(error: any) {
    if (error?.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      return;
    }

    if (error?.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      return;
    }

    toast.error(t("requests:fetchRequests.error"), { position: toastPosition });
  }

  async function fetchRequests(): Promise<Request[]> {
    setIsLoading(true);

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), { position: toastPosition });
        return [];
      }

      // Fetch current requests from the API and replace local state.
      // This hook treats the API as the source of truth for initial load and manual refreshes.
      const apiRequests = await fetchRequestsApi(token);
      setRequests(apiRequests);
      return apiRequests;
    } catch (error: any) {
      console.error("Fetch requests error:", error);
      showFetchError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAdminStreamRequests(): Promise<Request[]> {
    setIsLoading(true);

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), { position: toastPosition });
        return [];
      }

      // Fetch the administrative "stream" endpoint: used by admin UIs to load a prefiltered set.
      const streamItems = await fetchAdminStreamApi(token);
      setRequests(streamItems);
      return streamItems;
    } catch (error: any) {
      console.error("Fetch admin stream requests error:", error);
      showFetchError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let unsubscribeNewRequest = () => {};
    let unsubscribeRequestUpdated = () => {};

    // Wire realtime updates via SignalR. We call `startConnection()` to ensure the connection is running
    // and then subscribe to `NewRequest` and update events. Handlers update local state directly so
    // the UI reacts instantly without waiting for a full API refresh.
    async function setupRealtime() {
      try {
        await startConnection();

        // New requests are prepended to the list.
        unsubscribeNewRequest = onNewRequest((newRequest) => {
          if (!isRequestPayload(newRequest)) return;
          console.log("Received new request via SignalR:", newRequest);
          setRequests((prev) => [newRequest, ...prev]);
        });

        // Request updates are merged into existing items by id.
        unsubscribeRequestUpdated = onRequestUpdated((updatedRequest) => {
          if (!isRequestPayload(updatedRequest)) return;
          setRequests((prev) =>
            prev.map((request) =>
              request.id === updatedRequest.id ? { ...request, ...updatedRequest } : request,
            ),
          );
        });
      } catch (error) {
        // Failing to setup real-time should not block the app; log for diagnostics.
        console.error("SignalR setup failed:", error);
      }
    }

    void setupRealtime();

    return () => {
      unsubscribeNewRequest();
      unsubscribeRequestUpdated();
    };
  }, []);

  return {
    requests,
    isLoading,
    fetchRequests,
    fetchAdminStreamRequests,
    setRequests,
  };
}
