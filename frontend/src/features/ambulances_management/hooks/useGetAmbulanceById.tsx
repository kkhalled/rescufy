import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type { AmbulanceProfile } from "../types/ambulances.types";
import { normalizeAmbulanceProfile } from "../utils/ambulance.api.ts";

type ProfileCacheEntry = {
  value: AmbulanceProfile;
  cachedAt: number;
};

const PROFILE_CACHE_TTL_MS = 30_000;
const profileCache = new Map<string, ProfileCacheEntry>();

export function useGetAmbulanceById() {
  const [ambulance, setAmbulance] = useState<AmbulanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inFlightAmbulanceIdRef = useRef<string | null>(null);
  const loadedAmbulanceIdRef = useRef<string | null>(null);
  const { t } = useTranslation(["ambulances", "auth"]);
  const { isRTL } = useLanguage();

  const fetchAmbulanceById = useCallback(
    async (ambulanceId: string): Promise<AmbulanceProfile | null> => {
      if (!ambulanceId) {
        return null;
      }

      const cachedEntry = profileCache.get(ambulanceId);
      const cachedProfile = cachedEntry?.value;

      if (cachedProfile) {
        loadedAmbulanceIdRef.current = ambulanceId;
        setAmbulance(cachedProfile);

        if (Date.now() - cachedEntry.cachedAt < PROFILE_CACHE_TTL_MS) {
          return cachedProfile;
        }
      }

      if (inFlightAmbulanceIdRef.current === ambulanceId) {
        return cachedProfile ?? null;
      }

      if (loadedAmbulanceIdRef.current !== ambulanceId) {
        setAmbulance(null);
      }

      inFlightAmbulanceIdRef.current = ambulanceId;
      setIsLoading(true);
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

        const normalizedProfile = normalizeAmbulanceProfile(response.data);

        if (!normalizedProfile) {
          toast.error(t("ambulances:api.fetchProfileError"), {
            position: toastPosition,
            id: toastId,
          });
          return null;
        }

        profileCache.set(ambulanceId, {
          value: normalizedProfile,
          cachedAt: Date.now(),
        });
        loadedAmbulanceIdRef.current = ambulanceId;
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
        if (inFlightAmbulanceIdRef.current === ambulanceId) {
          inFlightAmbulanceIdRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [isRTL, t],
  );

  return {
    ambulance,
    isLoading,
    fetchAmbulanceById,
  };
}
