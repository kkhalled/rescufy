import axios from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLanguage } from "@/i18n/useLanguage";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

export default function useEmailStep(onEmailSent: (email: string) => void) {
  const { t } = useTranslation(["auth", "validation"]);
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const toastPosition = isRTL ? "top-left" : "top-right";

  async function handleSendEmail(values: { email: string }) {
    setIsLoading(true);
    try {
      await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD),
        { email: values.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onEmailSent(values.email);
      toast.success(t("auth:forgotPassword.otpSent"), {
        position: toastPosition,
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleError(error: any) {
    if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.message || t("auth:forgotPassword.badRequest");
      toast.error(errorMessage, { position: toastPosition });
    } else if (error.response?.status === 404) {
      toast.error(t("auth:forgotPassword.emailNotFound"), {
        position: toastPosition,
      });
    } else if (error.response?.status === 429) {
      toast.error(t("auth:forgotPassword.tooManyAttempts"), {
        position: toastPosition,
      });
    } else if (error.message === "Network Error") {
      toast.error(t("auth:signIn.networkError"), {
        position: toastPosition,
      });
    } else if (error.code === "ECONNABORTED") {
      toast.error(t("auth:signIn.timeout"), {
        position: toastPosition,
      });
    } else {
      toast.error(
        error.response?.data?.message || t("auth:forgotPassword.genericError"),
        { position: toastPosition }
      );
    }
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("validation:email.invalid"))
      .required(t("validation:email.required")),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: handleSendEmail,
    validationSchema: validationSchema,
  });

  return {
    formik,
    isLoading,
  };
}