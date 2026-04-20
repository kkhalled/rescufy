import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type { AmbulanceProfile } from "../types/ambulances.types";

export function useGetAmbulanceById() {
  const [ambulance, setAmbulance] = useState<AmbulanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inFlightAmbulanceIdRef = useRef<string | null>(null);
  const { t } = useTranslation(["ambulances", "auth"]);
  const { isRTL } = useLanguage();

  const fetchAmbulanceById = useCallback(
    async (ambulanceId: string): Promise<AmbulanceProfile | null> => {
      if (inFlightAmbulanceIdRef.current === ambulanceId) {
        return ambulance;
      }

      inFlightAmbulanceIdRef.current = ambulanceId;
      setIsLoading(true);
      setAmbulance(null);
      const toastPosition = isRTL ? "top-left" : "top-right";
      const toastId = `ambulance-profile-fetch-error-${ambulanceId}`;

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
          getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.GET_BY_ID(ambulanceId)),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = response.data as AmbulanceProfile;
        setAmbulance(data);
        return data;
      } catch (error: any) {
        console.error("Fetch ambulance profile error:", error);

        if (error.response?.status === 401) {
          toast.error(t("auth:signIn.unauthorized"), {
            position: toastPosition,
            id: toastId,
          });
        } else if (error.response?.status === 404) {
          toast.error(t("ambulances:api.notFound"), {
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
            error.response?.data?.message || t("ambulances:api.fetchProfileError"),
            {
              position: toastPosition,
              id: toastId,
            },
          );
        }

        return null;
      } finally {
        if (inFlightAmbulanceIdRef.current === ambulanceId) {
          inFlightAmbulanceIdRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [ambulance, isRTL, t],
  );

  return {
    ambulance,
    isLoading,
    fetchAmbulanceById,
  };
}
