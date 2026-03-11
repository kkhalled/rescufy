import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * Hook for assigning a hospital to a HospitalAdmin user
 * PUT /api/Users/{userId}/assign-hospital/{hospitalId}
 */
export function useAssignHospital() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["users", "auth"]);
  const { isRTL } = useLanguage();

  const assignHospital = async (
    userId: string,
    hospitalId: number
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

      await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.ASSIGN_HOSPITAL(userId, hospitalId)),
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(t("users:assignHospital.success"), {
        position: toastPosition,
      });

      return true;
    } catch (error: any) {
      console.error("Assign hospital error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      } else if (error.response?.status === 404) {
        toast.error(t("users:assignHospital.notFound"), {
          position: toastPosition,
        });
      } else if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message || t("users:assignHospital.badRequest"),
          { position: toastPosition }
        );
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      } else {
        toast.error(
          error.response?.data?.message ||
            t("users:assignHospital.genericError"),
          { position: toastPosition }
        );
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { assignHospital, isLoading };
}
