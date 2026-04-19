import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type { Hospital } from "../types/hospitals.types";
import { getApiErrorMessage, normalizeHospital } from "../utils/hospital.api.ts";

export function useGetHospitalById() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inFlightHospitalIdRef = useRef<string | null>(null);
  const { t } = useTranslation(["hospitals", "auth"]);
  const { isRTL } = useLanguage();

  const fetchHospitalById = useCallback(
    async (hospitalId: string): Promise<Hospital | null> => {
      if (inFlightHospitalIdRef.current === hospitalId) {
        return null;
      }

      inFlightHospitalIdRef.current = hospitalId;
      setIsLoading(true);
      setHospital(null);
      const toastPosition = isRTL ? "top-left" : "top-right";
      const toastId = `hospital-profile-fetch-error-${hospitalId}`;

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
          getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_BY_ID(hospitalId)),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = normalizeHospital(response.data);

        if (!data) {
          toast.error(t("hospitals:api.fetchProfileError"), {
            position: toastPosition,
            id: toastId,
          });
          return null;
        }

        setHospital(data);
        return data;
      } catch (error: any) {
        console.error("Fetch hospital profile error:", error);

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
          toast.error(getApiErrorMessage(error) ?? t("hospitals:api.fetchProfileError"), {
            position: toastPosition,
            id: toastId,
          });
        }

        return null;
      } finally {
        if (inFlightHospitalIdRef.current === hospitalId) {
          inFlightHospitalIdRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [isRTL, t],
  );

  return {
    hospital,
    isLoading,
    fetchHospitalById,
  };
}
