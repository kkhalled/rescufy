import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { User } from "../types/users.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

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
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return null;
      }

      const resolvedRole =
        userdata.role ||
        (Array.isArray(userdata.roles) && userdata.roles.length > 0
          ? userdata.roles[0]
          : undefined);

      const payload: Record<string, unknown> = {
        id: userId,
        email: userdata.email,
        name: userdata.name,
      };

      if (resolvedRole) {
        payload.role = resolvedRole;
        payload.roles = [resolvedRole];
      }

      if (typeof userdata.password === "string" && userdata.password.trim()) {
        payload.password = userdata.password;
      }

      if (typeof userdata.phoneNumber === "string") {
        payload.phoneNumber = userdata.phoneNumber;
      } else if (userdata.phoneNumber === null) {
        payload.phoneNumber = null;
      }

      if (typeof userdata.nationalId === "string") {
        payload.nationalId = userdata.nationalId;
      }

      if (userdata.gender) {
        payload.gender = userdata.gender;
      }

      if (typeof userdata.age === "number" && Number.isFinite(userdata.age)) {
        payload.age = userdata.age;
      }

      if (typeof userdata.isBanned === "boolean") {
        payload.isBanned = userdata.isBanned;
      }

      const response = await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.UPDATE(userId)),
        payload,
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