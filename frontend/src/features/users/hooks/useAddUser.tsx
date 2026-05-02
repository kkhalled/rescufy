import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { User } from "../types/users.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

/**
 * Hook for adding new users
 */
export function useAddUser() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["users", "auth"]);
  const { isRTL } = useLanguage();

  const addUser = async (userdata: User): Promise<User | null> => {
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

      const userPayload = {
        email: userdata.email,
        nationalId: userdata.nationalId,
        gender: userdata.gender,
        age: userdata.age,
        password: userdata.password,
        name: userdata.name,
        phoneNumber: userdata.phoneNumber,
        role: userdata.role,
        hospitalId:
          userdata.role === "HospitalAdmin" ? userdata.hospitalId : "1",
        ambulanceId:
          userdata.role === "AmbulanceDriver"
            ? userdata.ambulanceId
            : "",
      };

      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.CREATE),
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("User created successfully:", response);

      toast.success(t("users:addUser.success", { name: userdata.name }), {
        position: toastPosition,
      });

      return (
        response.data?.user ||
        response.data || { ...userdata, id: Date.now().toString() }
      );
    } catch (error: any) {
      console.error("Add user error:", error);
      handleError(error, toastPosition);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: any, toastPosition: "top-left" | "top-right") => {
    // Log full error response for debugging
    console.error("Full error response:", error.response?.data);
    console.error("Status:", error.response?.status);

    if (error.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
    } else if (error.response?.status === 400) {
      // Parse ASP.NET validation error formats
      const data = error.response?.data;
      let errorMessage = "";

      if (data?.errors && typeof data.errors === "object") {
        // ASP.NET validation: { errors: { FieldName: ["error1", "error2"] } }
        const messages = Object.entries(data.errors)
          .map(([field, msgs]: [string, any]) => {
            const msgList = Array.isArray(msgs)
              ? msgs.join(", ")
              : String(msgs);
            return `${field}: ${msgList}`;
          })
          .join(" | ");
        errorMessage = messages || data.title || t("users:addUser.badRequest");
      } else if (typeof data === "string") {
        errorMessage = data;
      } else {
        errorMessage =
          data?.message || data?.title || t("users:addUser.badRequest");
      }

      toast.error(errorMessage, { position: toastPosition });
    } else if (error.response?.status === 409) {
      toast.error(t("users:addUser.emailExists"), { position: toastPosition });
    } else if (error.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), { position: toastPosition });
    } else {
      toast.error(
        error.response?.data?.message || t("users:addUser.genericError"),
        { position: toastPosition },
      );
    }
  };

  return {
    addUser,
    isLoading,
  };
}
