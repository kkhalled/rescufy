import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { Hospital } from "../types/hospitals.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

/**
 * Hook for updating an existing hospital
 */
export function useUpdateHospital() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["hospitals", "auth"]);
  const { isRTL } = useLanguage();

  const updateHospital = async (
    hospitalId: string,
    hospital: Hospital
  ): Promise<Hospital | null> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return null;
      }

      const response = await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.UPDATE(hospitalId)),
        {
          name: hospital.name,
          address: hospital.address,
          contactPhone: hospital.contactPhone,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          availableBeds: hospital.availableBeds,
          bedCapacity: hospital.bedCapacity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        t("hospitals:api.updateSuccess", { name: hospital.name }),
        { position: toastPosition }
      );

      return response.data?.hospital || response.data || { ...hospital, id: hospitalId };
    } catch (error: any) {
      console.error("Update hospital error:", error);
      handleError(error, toastPosition);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (
    error: any,
    toastPosition: "top-left" | "top-right"
  ) => {
    if (error.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
    } else if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.message || t("hospitals:api.badRequest");
      toast.error(errorMessage, { position: toastPosition });
    } else if (error.response?.status === 404) {
      toast.error(t("hospitals:api.notFound"), { position: toastPosition });
    } else if (error.response?.status === 409) {
      toast.error(t("hospitals:api.alreadyExists"), { position: toastPosition });
    } else if (error.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), { position: toastPosition });
    } else {
      toast.error(
        error.response?.data?.message || t("hospitals:api.updateError"),
        { position: toastPosition }
      );
    }
  };

  return { updateHospital, isLoading };
}
