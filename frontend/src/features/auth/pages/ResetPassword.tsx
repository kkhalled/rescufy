import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useResetPasswordPage from "../hooks/useResetPasswordPage";
import AuthPageLayout from "../components/AuthPageLayout";
import LoadingSpinner from "../components/AuthForm/LoadingSpinner";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation("auth");
  const { formik, isLoading } = useResetPasswordPage(token || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthPageLayout subtitle={t("forgotPassword.resetTitle", "Reset Password")}>
      <div
        className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_25px_60px_-12px_rgba(15,23,42,0.12)] dark:border-white/6 dark:bg-white/3 dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.05)_inset]"
      >
        {/* ── Card top accent line ── */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <form className="text-sm" onSubmit={formik.handleSubmit}>
          {/* ── Header ── */}
          <div className="px-7 pt-7 pb-2">
            <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-slate-900 dark:text-white">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary/15 bg-primary/10">
                <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-primary" />
              </span>
              {t("auth:forgotPassword.resetTitle")}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-500 ltr:ml-9.5 rtl:mr-9.5">
              {t("auth:forgotPassword.resetSubtitle")}
            </p>
          </div>

          {/* ── Form fields ── */}
          <div className="px-7 pt-5 pb-3 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="rp-email" className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("auth:signIn.emailLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-600" />
                </div>
                <input
                  type="email"
                  id="rp-email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("auth:signIn.emailPlaceholder")}
                  className="login-input w-full rounded-xl border border-slate-200 bg-white/90 py-3 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 dark:border-white/7 dark:bg-white/3 dark:text-slate-200"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.email}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="rp-newPassword" className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("auth:forgotPassword.newPasswordLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="h-3.5 w-3.5 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="rp-newPassword"
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("auth:forgotPassword.newPasswordPlaceholder")}
                  className="login-input w-full rounded-xl border border-slate-200 bg-white/90 py-3 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 ltr:pl-10 ltr:pr-11 rtl:pr-10 rtl:pl-11 dark:border-white/7 dark:bg-white/3 dark:text-slate-200"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3.5 rtl:pl-3.5 flex items-center cursor-pointer text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="rp-confirmPassword" className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("auth:forgotPassword.confirmPasswordLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="h-3.5 w-3.5 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-600" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="rp-confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("auth:forgotPassword.confirmPasswordPlaceholder")}
                  className="login-input w-full rounded-xl border border-slate-200 bg-white/90 py-3 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 ltr:pl-10 ltr:pr-11 rtl:pr-10 rtl:pl-11 dark:border-white/7 dark:bg-white/3 dark:text-slate-200"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3.5 rtl:pl-3.5 flex items-center cursor-pointer text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
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
                  focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#0a101e] transition-all duration-300
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

        {/* ── Back to sign in ── */}
        <div className="mx-7 my-5 border-t border-slate-200 pt-5 text-center dark:border-white/6">
          <p className="text-[13px] text-slate-600 dark:text-slate-500">
            {t("auth:forgotPassword.rememberPassword")}{" "}
            <Link
              to="/signin"
              className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
            >
              {t("auth:forgotPassword.backToSignIn")}
            </Link>
          </p>
        </div>

        {/* ── Card bottom accent line ── */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/3 to-transparent" />
      </div>
    </AuthPageLayout>
  );
}
