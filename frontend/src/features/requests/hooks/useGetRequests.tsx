import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";
import {
  onNewRequest,
  onRequestUpdated,
  startConnection,
} from "@/services/signalrService";
import type { Request, ApiRequest } from "../types/request.types";
import {
  type AdminStreamItem,
  fetchAdminStreamApi,
  fetchRequestsApi,
} from "../data/requests.api";
import { mapAdminStreamItem, mapApiRequest } from "../utils/request.mappers";

function toRealtimeRequest(payload: unknown): Request | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const item = payload as Record<string, unknown>;

  if (typeof item.id !== "number" && typeof item.id !== "string") {
    return null;
  }

  if ("requestStatus" in item && "applicationUser" in item) {
    return mapApiRequest(payload as ApiRequest);
  }

  const mapped = mapAdminStreamItem(payload as AdminStreamItem);
  return mapped.id > 0 ? mapped : null;
}

export function useGetRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const toastPosition = isRTL ? "top-left" : "top-right";

  const showFetchError = useCallback(
    (error: any) => {
      if (error?.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
        return;
      }

      if (error?.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
        return;
      }

      toast.error(t("requests:fetchRequests.error"), { position: toastPosition });
    },
    [t, toastPosition],
  );

  const fetchRequests = useCallback(
    async (): Promise<Request[]> => {
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
    },
    [showFetchError, t, toastPosition],
  );

  const fetchAdminStreamRequests = useCallback(async (): Promise<Request[]> => {
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
  }, [showFetchError, t, toastPosition]);

  useEffect(() => {
    let unsubscribeNewRequest = () => {};
    let unsubscribeRequestUpdated = () => {};

    async function setupRealtime() {
      try {
        await startConnection();

        unsubscribeNewRequest = onNewRequest((payload) => {
          const newRequest = toRealtimeRequest(payload);

          if (!newRequest) {
            return;
          }

          setRequests((previous) => {
            const alreadyExists = previous.some(
              (request) => String(request.id) === String(newRequest.id),
            );

            if (alreadyExists) {
              return previous;
            }

            return [newRequest, ...previous];
          });
        });

        unsubscribeRequestUpdated = onRequestUpdated((payload) => {
          const updatedRequest = toRealtimeRequest(payload);

          if (!updatedRequest) {
            return;
          }

          setRequests((previous) => {
            const exists = previous.some(
              (request) => String(request.id) === String(updatedRequest.id),
            );

            if (!exists) {
              return [updatedRequest, ...previous];
            }

            return previous.map((request) => {
              if (String(request.id) !== String(updatedRequest.id)) {
                return request;
              }

              return {
                ...request,
                ...updatedRequest,
              };
            });
          });
        });
      } catch (error) {
        console.error("SignalR setup failed:", error);
      }
    }

    setupRealtime();

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
