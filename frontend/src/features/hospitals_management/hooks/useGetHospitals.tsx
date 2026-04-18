import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { Hospital } from "../types/hospitals.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

/**
 * Hook for fetching hospitals from the API
 */
export function useGetHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchInFlightRef = useRef(false);
  const { t } = useTranslation(["hospitals", "auth"]);
  const { isRTL } = useLanguage();

  const fetchHospitals = useCallback(async (): Promise<Hospital[]> => {
    if (fetchInFlightRef.current) {
      return [];
    }

    fetchInFlightRef.current = true;
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";
    const toastId = "hospitals-fetch-error";

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
          id: toastId,
        });
        return [];
      }

      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_ALL),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedHospitals: Hospital[] = response.data;
      setHospitals(fetchedHospitals);
      return fetchedHospitals;
    } catch (error: any) {
      console.error("Fetch hospitals error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), {
          position: toastPosition,
          id: toastId,
        });
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), {
          position: toastPosition,
          id: toastId,
        });
      } else {
        toast.error(
          error.response?.data?.message || t("hospitals:api.fetchError"),
          {
            position: toastPosition,
            id: toastId,
          }
        );
      }
      return [];
    } finally {
      fetchInFlightRef.current = false;
      setIsLoading(false);
    }
  }, [isRTL, t]);

  return { hospitals, isLoading, fetchHospitals };
}
