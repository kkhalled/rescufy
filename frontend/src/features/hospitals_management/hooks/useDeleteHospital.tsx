import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * Hook for deleting a hospital
 */
export function useDeleteHospital() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["hospitals", "auth"]);
  const { isRTL } = useLanguage();

  const deleteHospital = async (
    hospitalId: string,
    hospitalName?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return false;
      }

      await axios.delete(
        getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.DELETE(hospitalId)),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMessage = hospitalName
        ? t("hospitals:api.deleteSuccess", { name: hospitalName })
        : t("hospitals:api.deleteSuccessGeneric");

      toast.success(successMessage, { position: toastPosition });
      return true;
    } catch (error: any) {
      console.error("Delete hospital error:", error);
      handleError(error, toastPosition, hospitalName);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (
    error: any,
    toastPosition: "top-left" | "top-right",
    hospitalName?: string
  ) => {
    if (error.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
    } else if (error.response?.status === 404) {
      toast.error(t("hospitals:api.notFound"), { position: toastPosition });
    } else if (error.response?.status === 403) {
      toast.error(t("hospitals:api.forbidden"), { position: toastPosition });
    } else if (error.response?.status === 409) {
      toast.error(t("hospitals:api.deleteConflict"), {
        position: toastPosition,
      });
    } else if (error.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), { position: toastPosition });
    } else {
      const errorMessage = hospitalName
        ? t("hospitals:api.deleteError", { name: hospitalName })
        : t("hospitals:api.deleteErrorGeneric");
      toast.error(errorMessage, { position: toastPosition });
    }
  };

  return { deleteHospital, isLoading };
}
