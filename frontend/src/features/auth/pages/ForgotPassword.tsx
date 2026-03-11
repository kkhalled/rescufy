import ForgotPasswordForm from "../components/AuthForm/ForgotPasswordForm";
import AuthPageLayout from "../components/AuthPageLayout";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation("auth");

  return (
    <AuthPageLayout subtitle={t("forgotPassword.title", "Forgot Password")}>
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
