import axios from "axios";
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { Hospital } from "../types/hospitals.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { getApiErrorMessage, normalizeHospital } from "../utils/hospital.api.ts";

/**
 * Hook for fetching the current HospitalAdmin's own hospital
 * GET /api/Hospital/my-hospital
 */
export function useGetMyHospital() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchInFlightRef = useRef(false);
  const { t } = useTranslation(["hospitals", "auth"]);
  const { isRTL } = useLanguage();

  const fetchMyHospital = useCallback(async (): Promise<Hospital | null> => {
    if (fetchInFlightRef.current) {
      return null;
    }

    fetchInFlightRef.current = true;
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";
    const toastId = "my-hospital-fetch-error";

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
          id: toastId,
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

      const data = normalizeHospital(response.data);

      if (!data) {
        toast.error(t("hospitals:api.fetchError"), {
          position: toastPosition,
          id: toastId,
        });
        return null;
      }

      setHospital(data);
      return data;
    } catch (error: any) {
      console.error("Fetch my hospital error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), {
          position: toastPosition,
          id: toastId,
        });
      } else if (error.response?.status === 404) {
        toast.error(t("hospitals:api.notFound"), {
          position: toastPosition,
          id: toastId,
        });
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), {
          position: toastPosition,
          id: toastId,
        });
      } else {
        toast.error(getApiErrorMessage(error) ?? t("hospitals:api.fetchError"), {
          position: toastPosition,
          id: toastId,
        });
      }
      return null;
    } finally {
      fetchInFlightRef.current = false;
      setIsLoading(false);
    }
  }, [isRTL, t]);

  return {
    hospital,
    isLoading,
    fetchMyHospital,
  };
}
