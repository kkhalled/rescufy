import { useAuth } from "@/app/provider/AuthContext";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/useLanguage";
import { profileUpdateSchema } from "../schemas/settingsSchemas";
import type { UpdateProfileRequest } from "../types/settings.types";

export default function useProfileUpdate() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();

  const toastPosition = isRTL ? "top-left" : "top-right";

  async function handleUpdateProfile(values: UpdateProfileRequest) {
    try {
      // TODO: Implement API call
      console.log("Updating profile:", values);
      
      toast.success("Profile updated successfully!", {
        position: toastPosition,
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.", {
        position: toastPosition,
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      fullName: user?.FullName || "",
      userName: user?.UserName || "",
      email: user?.Email || "",
    },
    validationSchema: profileUpdateSchema,
    onSubmit: handleUpdateProfile,
    enableReinitialize: true,
  });

  return {
    formik,
    user,
  };
}