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
        className="w-full rounded-2xl overflow-hidden border border-white/6"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(10,16,30,0.98) 100%)",
          boxShadow:
            "0 25px 60px -12px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        {/* ── Card top accent line ── */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />

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
            {/* Email */}
            <div>
              <label htmlFor="rp-email" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t("auth:signIn.emailLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  id="rp-email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("auth:signIn.emailPlaceholder")}
                  className="login-input w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl text-sm text-slate-200 bg-white/3 border border-white/7 transition-all duration-200 outline-none"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.email}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="rp-newPassword" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t("auth:forgotPassword.newPasswordLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="rp-newPassword"
                  name="newPassword"
                  value={formik.values.newPassword}
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
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">{formik.errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="rp-confirmPassword" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t("auth:forgotPassword.confirmPasswordLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="rp-confirmPassword"
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

        {/* ── Back to sign in ── */}
        <div className="mx-7 my-5 pt-5 border-t border-white/6 text-center">
          <p className="text-slate-500 text-[13px]">
            {t("auth:forgotPassword.rememberPassword")}{" "}
            <Link
              to="/signin"
              className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
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
