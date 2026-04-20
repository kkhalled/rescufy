import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import type { RequestDetail } from "../types/requestDetails.types";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

export function useGetRequestById() {
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const fetchRequest = async (id: string): Promise<RequestDetail | null> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), { position: toastPosition });
        return null;
      }

      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.GET_BY_ID(id)),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: RequestDetail = response.data;
      setRequest(data);
      return data;
    } catch (error: any) {
      console.error("Fetch request details error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      } else if (error.response?.status === 404) {
        toast.error(t("requests:fetchRequests.notFound", "Request not found"), { position: toastPosition });
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      } else {
        toast.error(t("requests:fetchRequests.error"), { position: toastPosition });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    request,
    isLoading,
    fetchRequest,
  };
}
