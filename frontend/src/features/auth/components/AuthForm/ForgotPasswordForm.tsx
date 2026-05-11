import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import useForgotPassword from "../../hooks/useForgotPassword";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import ResetPasswordStep from "./ResetPasswordStep";

export default function ForgotPasswordForm() {
  const {
    step,
    email,
    emailFormik,
    emailLoading,
    otpFormik,
    otpLoading,
    resetFormik,
    resetLoading,
    resendOtp,
    goBackToEmail,
  } = useForgotPassword();
  const { t } = useTranslation("auth");

  return (
    <div
      className="
        w-full max-w-md mx-auto
        
        
        py-4
        rounded-2xl
        shadow-xl
      
        text-sm
        text-slate-900 dark:text-white
      "
    >
      {step === "email" && (
        <EmailStep formik={emailFormik} isLoading={emailLoading} />
      )}

      {step === "otp" && (
        <OtpStep
          formik={otpFormik}
          isLoading={otpLoading}
          onResendOtp={resendOtp}
          onGoBack={goBackToEmail}
        />
      )}

      {step === "reset" && (
        <ResetPasswordStep
          formik={resetFormik}
          email={email}
          isLoading={resetLoading}
        />
      )}

      <div className="mt-6 border-t border-slate-200 px-6 pt-6 text-center dark:border-white/10">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("auth:forgotPassword.rememberPassword")}{" "}
          <Link
            to="/signin"
            className="font-semibold text-primary transition hover:text-primary/80"
          >
            {t("auth:forgotPassword.backToSignIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
