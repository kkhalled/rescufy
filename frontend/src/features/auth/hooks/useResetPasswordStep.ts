import axios from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLanguage } from "@/i18n/useLanguage";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

export default function useResetPasswordStep(email: string, token: string) {
  const navigate = useNavigate();
  const { t } = useTranslation(["auth", "validation"]);
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const toastPosition = isRTL ? "top-left" : "top-right";

  async function handleResetPassword(values: {
    password: string;
    confirmPassword: string;
  }) {
    setIsLoading(true);
    try {
      console.log(email,token ,values);
      
      await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD),
        {
          email,
          token,
          newPassword: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast.success(t("auth:forgotPassword.passwordReset"), {
        position: toastPosition,
      });
      navigate("/signin");
    } catch (error: any) {
      console.error("Reset password error:", error);
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
        { position: toastPosition },
      );
    }
  }

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(6, t("validation:password.minLength", { min: 6 }))
      .required(t("validation:password.required")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("validation:password.mismatch"))
      .required(t("validation:password.required")),
  });

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    onSubmit: handleResetPassword,
    validationSchema: validationSchema,
  });

  return {
    formik,
    isLoading,
  };
}
