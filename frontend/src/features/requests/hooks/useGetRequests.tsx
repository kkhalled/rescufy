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
import { mapAdminStreamItem, mapApiRequest } from "../utils/request.mappers";

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

      const apiRequests = await fetchRequestsApi(token);
      const mapped = apiRequests.map(mapApiRequest);

      setRequests(mapped);
      return mapped;
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

      const streamItems = await fetchAdminStreamApi(token);
      const mapped = streamItems
        .map(mapAdminStreamItem)
        .filter((request) => request.id > 0);

      setRequests(mapped);
      return mapped;
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

    async function setupRealtime() {
      try {
        await startConnection();

        unsubscribeNewRequest = onNewRequest((newRequest) => {
          if (!isRequestPayload(newRequest)) {
            return;
          }
               
          console.log("Received new request via SignalR:", newRequest);
          setRequests((prev) => [newRequest, ...prev]);
        });

        unsubscribeRequestUpdated = onRequestUpdated((updatedRequest) => {
          if (!isRequestPayload(updatedRequest)) {
            return;
          }

          setRequests((prev) =>
            prev.map((request) =>
              request.id === updatedRequest.id
                ? { ...request, ...updatedRequest }
                : request,
            ),
          );
        });
      } catch (error) {
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
