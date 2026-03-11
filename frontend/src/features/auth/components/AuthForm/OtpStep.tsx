import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";
import type { FormikProps } from "formik";

interface OtpStepProps {
  formik: FormikProps<{ otp: string }>;
  isLoading: boolean;
  onResendOtp: () => void;
  onGoBack: () => void;
}

export default function OtpStep({
  formik,
  isLoading,
  onResendOtp,
  onGoBack,
}: OtpStepProps) {
  const { t } = useTranslation("auth");

  return (
    <form className="text-sm" onSubmit={formik.handleSubmit}>
      {/* ── Header ── */}
      <div className="px-7 pt-7 pb-2">
        <h2 className="text-[17px] font-semibold text-white flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/15">
            <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 text-primary" />
          </span>
          {t("auth:forgotPassword.verifyTitle")}
        </h2>
        <p className="text-slate-500 text-[13px] mt-2 leading-relaxed ltr:ml-9.5 rtl:mr-9.5">
          {t("auth:forgotPassword.verifySubtitle")}
        </p>
      </div>

      {/* ── Form fields ── */}
      <div className="px-7 pt-5 pb-3 space-y-4">
        {/* OTP field */}
        <div>
          <label htmlFor="fp-otp" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t("auth:forgotPassword.otpLabel")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faKey} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              type="text"
              id="fp-otp"
              name="otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("auth:forgotPassword.otpPlaceholder")}
              className="login-input w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl text-sm text-slate-200 bg-white/3 border border-white/7 transition-all duration-200 outline-none tracking-[0.25em] font-mono"
            />
          </div>
          {formik.touched.otp && formik.errors.otp && (
            <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.otp}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-1 pb-2">
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className="
              login-btn-shimmer cursor-pointer w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm
              hover:shadow-[0_0_30px_rgba(101,77,255,0.2)] focus:outline-none focus:ring-2 focus:ring-primary/30
              focus:ring-offset-2 focus:ring-offset-[#0a101e] transition-all duration-300
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
              flex items-center justify-center gap-2.5 relative overflow-hidden
            "
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>{t("auth:forgotPassword.verifying")}</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
                <span>{t("auth:forgotPassword.verifyButton")}</span>
              </>
            )}
          </button>
        </div>

        {/* Action links */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onGoBack}
            className="text-slate-500 text-[12px] hover:text-primary transition-colors duration-200 font-medium"
          >
            {t("auth:forgotPassword.changeEmail")}
          </button>
          <button
            type="button"
            onClick={onResendOtp}
            disabled={isLoading}
            className="text-primary text-[12px] font-semibold hover:text-primary/80 transition-colors duration-200 disabled:opacity-50"
          >
            {t("auth:forgotPassword.resendOtp")}
          </button>
        </div>
      </div>
    </form>
  );
}
