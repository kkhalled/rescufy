import { useFormik } from "formik";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/useLanguage";
import { changePasswordSchema } from "../schemas/settingsSchemas";
import type { ChangePasswordRequest } from "../types/settings.types";

export default function usePasswordChange() {
  const { isRTL } = useLanguage();

  const toastPosition = isRTL ? "top-left" : "top-right";

  async function handleChangePassword(values: ChangePasswordRequest) {
    try {
      // TODO: Implement API call
      console.log("Changing password:", values);
      
      toast.success("Password changed successfully!", {
        position: toastPosition,
      });
      
      // Reset form after successful change
      formik.resetForm();
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error("Failed to change password. Please try again.", {
        position: toastPosition,
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: handleChangePassword,
  });

  return {
    formik,
  };
}