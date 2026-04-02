import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";
import type { FormikProps } from "formik";

interface ResetPasswordStepProps {
  formik: FormikProps<{ password: string; confirmPassword: string }>;
  email: string;
  isLoading: boolean;
}

export default function ResetPasswordStep({
  formik,
  email,
  isLoading,
}: ResetPasswordStepProps) {
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form className="text-sm" onSubmit={formik.handleSubmit}>
      {/* ── Header ── */}
      <div className="px-7 pt-7 pb-2">
        <h2 className="text-[17px] font-semibold text-white flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/15">
            <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-primary" />
          </span>
          {t("auth:forgotPassword.resetTitle")}
        </h2>
        <p className="text-slate-500 text-[13px] mt-2 leading-relaxed ltr:ml-9.5 rtl:mr-9.5">
          {t("auth:forgotPassword.resetSubtitle")}
        </p>
      </div>

      {/* ── Form fields ── */}
      <div className="px-7 pt-5 pb-3 space-y-4">
        {/* email */}
        <div>
          <label htmlFor="fp-email" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t("auth:forgotPassword.emailLabel")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              type="email"
              id="fp-email"
              value={email}
              readOnly
              placeholder={t("auth:forgotPassword.emailPlaceholder")}
              className="login-input w-full ltr:pl-10 rtl:pr-10 ltr:pr-11 rtl:pl-11 py-3 rounded-xl text-sm text-slate-200 bg-white/3 border border-white/7 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="fp-password" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t("auth:forgotPassword.newPasswordLabel")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="fp-password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("auth:forgotPassword.newPasswordPlaceholder")}
              className="login-input w-full ltr:pl-10 rtl:pr-10 ltr:pr-11 rtl:pl-11 py-3 rounded-xl text-sm text-slate-200 bg-white/3 border border-white/7 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3.5 rtl:pl-3.5 flex items-center cursor-pointer text-slate-600 hover:text-slate-400 transition-colors"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="fp-confirmPassword" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t("auth:forgotPassword.confirmPasswordLabel")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              id="fp-confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("auth:forgotPassword.confirmPasswordPlaceholder")}
              className="login-input w-full ltr:pl-10 rtl:pr-10 ltr:pr-11 rtl:pl-11 py-3 rounded-xl text-sm text-slate-200 bg-white/3 border border-white/7 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3.5 rtl:pl-3.5 flex items-center cursor-pointer text-slate-600 hover:text-slate-400 transition-colors"
            >
              <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.confirmPassword}</p>
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
                <span>{t("auth:forgotPassword.resetting")}</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRotateRight} className="w-3.5 h-3.5" />
                <span>{t("auth:forgotPassword.resetButton")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
