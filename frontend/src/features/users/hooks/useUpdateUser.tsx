import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { User } from "../types/users.types";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * Hook for updating existing users
 */
export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["users", "auth"]);
  const { isRTL } = useLanguage();

  const updateUser = async (userId: string, userdata: User): Promise<User | null> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return null;
      }

      const response = await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.UPDATE(userId)),
        {
          email: userdata.email,
          password: userdata.password,
          name: userdata.name,
          phoneNumber: userdata.phoneNumber,
          role: userdata.role, // Sends "Admin" | "HospitalAdmin" | "Paramedic" | "SuperAdmin"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("User updated successfully:", response.data);

      toast.success(t("users:updateUser.success", { name: userdata.name }), {
        position: toastPosition,
      });

      return response.data?.user || response.data || { ...userdata, id: userId };
    } catch (error: any) {
      console.error("Update user error:", error);
      handleError(error, toastPosition);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (
    error: any,
    toastPosition: "top-left" | "top-right",
  ) => {
    if (error.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
    } else if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.message || t("users:updateUser.badRequest");
      toast.error(errorMessage, { position: toastPosition });
    } else if (error.response?.status === 404) {
      toast.error(t("users:updateUser.userNotFound"), { position: toastPosition });
    } else if (error.response?.status === 409) {
      toast.error(t("users:updateUser.emailExists"), { position: toastPosition });
    } else if (error.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), { position: toastPosition });
    } else {
      toast.error(
        error.response?.data?.message || t("users:updateUser.genericError"),
        { position: toastPosition },
      );
    }
  };

  return {
    updateUser,
    isLoading,
  };
}