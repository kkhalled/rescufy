import { useAuth } from "@/app/provider/AuthContext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JwtPayload } from "../types/auth.types";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLanguage } from "@/i18n/useLanguage";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { setAuthToken } from "../utils/auth.utils";

export default function useSignIn() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation(["auth", "validation"]);
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
function changeRole(
  selectedRole: string
) {
  const email =
    selectedRole === "admin"
      ? "superadmin@mohayaa.com"
      : "admin1@hospital.com";

  formik.setValues({
    email,
    password: "P@ssword12",
  });
}

  type SignInFormValues = {
    email: string;
    password: string;
  };

  async function handleSubmit(values: SignInFormValues) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(data);

      const decoded = jwtDecode<JwtPayload>(data.token);
      console.log(decoded);

      if (decoded.Role) {
        // Handle Role as array or string
        const roles = Array.isArray(decoded.Role) ? decoded.Role : [decoded.Role];
        
        // Determine primary role (SuperAdmin > Admin > HospitalAdmin)
        let primaryRole: "SuperAdmin" | "Admin" | "hospitaladmin";
        if (roles.includes("SuperAdmin")) {
          primaryRole = "SuperAdmin";
        } else if (roles.includes("Admin")) {
          primaryRole = "Admin";
        } else if (roles.includes("HospitalAdmin")) {
          primaryRole = "hospitaladmin";
        } else {
          primaryRole = "hospitaladmin"; // fallback
        }

        // Store the token in cookie
        setAuthToken(data.token, decoded.exp);

        // Store user data in context
        setUser({
          id: decoded.Id || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          FullName: decoded.FullName,
          PicUrl: decoded.PicUrl,
          Email: decoded.Email,
          UserName: decoded.UserName,
          Role: primaryRole,
          HospitalId: decoded.HospitalId, // Extract hospital ID from JWT
          SecurityStamp: decoded.SecurityStamp,
          aud: decoded.aud,
          exp: decoded.exp,
          iss: decoded.iss,
          jti: decoded.jti,
        });

        toast.success(t("auth:signIn.success"), {
          position: isRTL ? "top-left" : "top-right",
        });

        // Navigate based on primary role
        let roleRoute;
        if (primaryRole === "SuperAdmin" || primaryRole === "Admin") {
          roleRoute = "/";
        } else {
          roleRoute = "/";
        }
        navigate(roleRoute);
      } else {
        toast.error(t("auth:signIn.roleNotFound"), {
          position: isRTL ? "top-left" : "top-right",
        });
        console.error("Role claim not found in token");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different error scenarios
      const toastPosition = isRTL ? "top-left" : "top-right";


      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.invalidCredentials"), {
          position: toastPosition,
        });
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || t("auth:signIn.badRequest");
        toast.error(errorMessage, {
          position: toastPosition,
        });
      } else if (error.response?.status === 429) {
        toast.error(t("auth:signIn.tooManyAttempts"), {
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
          error.response?.data?.message || t("auth:signIn.genericError"),
          {
            position: toastPosition,
          },
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("validation:email.invalid"))
      .required(t("validation:email.required")),
    password: yup
      .string()
      .min(6, t("validation:password.minLength", { min: 6 }))
      .required(t("validation:password.required")),
  });

  const formik = useFormik({
    initialValues: {
      
      email: "",
      password: "",
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
  });

  return {
    formik,
    isLoading,
    changeRole
  };
}
