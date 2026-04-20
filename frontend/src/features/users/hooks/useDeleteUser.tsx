import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

/**
 * Hook for deleting users
 */
export function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["users", "auth"]);
  const { isRTL } = useLanguage();

  const deleteUser = async (userId: string, userName?: string): Promise<boolean> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return false;
      }

      const response = await axios.delete(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.DELETE(userId)),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("User deleted successfully:", response.data);

      const successMessage = userName 
        ? t("users:deleteUser.success", { name: userName })
        : t("users:deleteUser.successGeneric");
      
      toast.success(successMessage, {
        position: toastPosition,
      });

      return true;
    } catch (error: any) {
      console.error("Delete user error:", error);
      handleError(error, toastPosition, userName);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (
    error: any,
    toastPosition: "top-left" | "top-right",
    userName?: string,
  ) => {
    if (error.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
    } else if (error.response?.status === 404) {
      toast.error(t("users:deleteUser.userNotFound"), { position: toastPosition });
    } else if (error.response?.status === 403) {
      toast.error(t("users:deleteUser.forbidden"), { position: toastPosition });
    } else if (error.response?.status === 409) {
      toast.error(t("users:deleteUser.conflict"), { position: toastPosition });
    } else if (error.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), { position: toastPosition });
    } else {
      const errorMessage = userName 
        ? t("users:deleteUser.genericError", { name: userName })
        : t("users:deleteUser.genericErrorGeneric");
      
      toast.error(
        error.response?.data?.message || errorMessage,
        { position: toastPosition },
      );
    }
  };

  return {
    deleteUser,
    isLoading,
  };
}