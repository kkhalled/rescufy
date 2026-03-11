import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import useSignIn from "../../hooks/useSignIn";

export default function SignInForm() {
  const { formik, isLoading } = useSignIn();
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/6"
      style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(10,16,30,0.98) 100%)", boxShadow: "0 25px 60px -12px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.05) inset" }}
    >
      {/* ── Card top accent line ── */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <form onSubmit={formik.handleSubmit} autoComplete="off">
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-2">
          <h2 className="text-[17px] font-semibold text-white flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/15">
              <FontAwesomeIcon icon={faArrowRightToBracket} className="w-3 h-3 text-primary" />
            </span>
            {t("auth:signIn.title")}
          </h2>
          <p className="text-slate-500 text-[13px] mt-2 leading-relaxed ltr:ml-9.5 rtl:mr-9.5">
            {t("auth:signIn.subtitle")}
          </p>
        </div>

        {/* ── Form fields ── */}
        <div className="px-7 pt-5 pb-3 space-y-4">

          {/* Email Field */}
          <div>
            <label htmlFor="signin-email" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t("auth:signIn.emailLabel")}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <input
                type="email"
                id="signin-email"
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

          {/* Password Field */}
          <div>
            <label htmlFor="signin-password" className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t("auth:signIn.passwordLabel")}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="signin-password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("auth:signIn.passwordPlaceholder")}
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-[12px] text-slate-500 hover:text-primary transition-colors duration-200 font-medium"
            >
              {t("auth:signIn.forgotPassword")}
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-1 pb-2">
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="
                login-btn-shimmer
                cursor-pointer
                w-full
                bg-primary
                text-white
                py-3
                rounded-xl
                font-semibold
                text-sm
                hover:shadow-[0_0_30px_rgba(101,77,255,0.2)]
                focus:outline-none
                focus:ring-2
                focus:ring-primary/30
                focus:ring-offset-2
                focus:ring-offset-[#0a101e]
                transition-all
                duration-300
                disabled:opacity-30
                disabled:cursor-not-allowed
                disabled:hover:shadow-none
                flex
                items-center
                justify-center
                gap-2.5
                relative
                overflow-hidden
              "
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t("auth:signIn.loggingIn")}</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className="w-3.5 h-3.5" />
                  <span>{t("auth:signIn.submitButton")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── Card bottom accent line ── */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/3 to-transparent" />
    </div>
  );
}
