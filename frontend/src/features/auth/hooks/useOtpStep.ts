import axios from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLanguage } from "@/i18n/useLanguage";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

export default function useOtpStep(
  email: string,
  onOtpVerified: (token: string) => void,
  onResendEmail: () => void
) {
  const { t } = useTranslation(["auth", "validation"]);
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const toastPosition = isRTL ? "top-left" : "top-right";

  async function handleVerifyOtp(values: { otp: string }) {
    setIsLoading(true);
    try {
      await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP),
        { email, otp: values.otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onOtpVerified(values.otp);
      toast.success(t("auth:forgotPassword.otpVerified"), {
        position: toastPosition,
      });
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function resendOtp() {
    onResendEmail();
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
    otp: yup
      .string()
      .required(t("auth:forgotPassword.otpRequired"))
      .min(4, t("auth:forgotPassword.otpMinLength")),
  });

  const formik = useFormik({
    initialValues: { otp: "" },
    onSubmit: handleVerifyOtp,
    validationSchema: validationSchema,
  });

  return {
    formik,
    isLoading,
    resendOtp,
  };
}