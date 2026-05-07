import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type { AmbulanceProfile } from "../types/ambulances.types.ts";
import { normalizeAmbulanceProfile } from "../utils/ambulance.api.ts";

export function useGetAmbulanceById() {
  const [ambulance, setAmbulance] = useState<AmbulanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["ambulances", "auth"]);
  const { isRTL } = useLanguage();

  async function fetchAmbulanceById(ambulanceId: string): Promise<AmbulanceProfile | null> {
    if (!ambulanceId) {
      return null;
    }

    const toastPosition = isRTL ? "top-left" : "top-right";
    const toastId = `ambulance-profile-fetch-error-${ambulanceId}`;

    setIsLoading(true);
    setAmbulance(null);

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
      console.log("Fetch ambulance profile response:", response);

      const normalizedProfile = normalizeAmbulanceProfile(response.data);

      if (!normalizedProfile) {
        toast.error(t("ambulances:api.fetchProfileError"), {
          position: toastPosition,
          id: toastId,
        });
        return null;
      }

      setAmbulance(normalizedProfile);
      return normalizedProfile;
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
      setIsLoading(false);
    }
  }

  return {
    ambulance,
    isLoading,
    fetchAmbulanceById,
  };
}
