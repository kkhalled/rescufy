import axios from "axios";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { Hospital } from "../types/hospitals.types";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * Hook for fetching the current HospitalAdmin's own hospital
 * GET /api/Hospital/my-hospital
 */
export function useGetMyHospital() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["hospitals", "auth"]);
  const { isRTL } = useLanguage();

  const fetchMyHospital = useCallback(async (): Promise<Hospital | null> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return null;
      }

      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.MY_HOSPITAL),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: Hospital = response.data;
      setHospital(data);
      return data;
    } catch (error: any) {
      console.error("Fetch my hospital error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      } else if (error.response?.status === 404) {
        toast.error(t("hospitals:api.notFound"), { position: toastPosition });
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      } else {
        toast.error(
          error.response?.data?.message || t("hospitals:api.fetchError"),
          { position: toastPosition }
        );
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isRTL, t]);

  return {
    hospital,
    isLoading,
    fetchMyHospital,
  };
}
