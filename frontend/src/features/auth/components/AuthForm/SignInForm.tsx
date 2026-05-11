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
  const { formik, isLoading, changeRole } = useSignIn();
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="w-full overflow-hidden rounded-xl text-slate-900 dark:text-white"
      
    >
      {/* ── Card top accent line ── */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <form onSubmit={formik.handleSubmit} autoComplete="off">
        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-2">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold text-slate-900 dark:text-white">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-primary/15 bg-primary/10">
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                className="w-3 h-3 text-primary"
              />
            </span>
            {t("auth:signIn.title")}
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 dark:text-slate-500 ltr:ml-8 rtl:mr-8">
            {t("auth:signIn.subtitle")}
          </p>
        </div>

        {/* ── Form fields ── */}
        <div className="px-6 pt-4 pb-2 space-y-3.5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="signin-email"
              className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {t("auth:signIn.emailLabel")}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-3.5 w-3.5 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-600"
                />
              </div>
              <input
                type="email"
                id="signin-email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("auth:signIn.emailPlaceholder")}
                className="login-input w-full rounded-lg border border-slate-200 bg-white/90 py-2.5 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 dark:border-white/7 dark:bg-white/3 dark:text-slate-200"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="signin-password"
              className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {t("auth:signIn.passwordLabel")}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-3.5 w-3.5 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-600"
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="signin-password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("auth:signIn.passwordPlaceholder")}
                className="login-input w-full rounded-lg border border-slate-200 bg-white/90 py-2.5 text-sm text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400 ltr:pl-10 ltr:pr-11 rtl:pr-10 rtl:pl-11 dark:border-white/7 dark:bg-white/3 dark:text-slate-200"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3.5 rtl:pl-3.5 flex items-center cursor-pointer text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="w-3.5 h-3.5"
                />
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1.5 ltr:ml-1 rtl:mr-1 text-[11px] text-red-400/90 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-[12px] font-medium text-slate-500 transition-colors duration-200 hover:text-primary dark:text-slate-500"
            >
              {t("auth:signIn.forgotPassword")}
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-1 pb-1">
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="
                login-btn-shimmer
                cursor-pointer
                w-full
                bg-primary
                text-white
                py-2.5
                rounded-lg
                font-semibold
                text-sm
                hover:shadow-[0_0_30px_rgba(101,77,255,0.2)]
                focus:outline-none
                focus:ring-2
                focus:ring-primary/30
                focus:ring-offset-2
                focus:ring-offset-slate-50
                dark:focus:ring-offset-[#0a101e]
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
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t("auth:signIn.loggingIn")}</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faArrowRightToBracket}
                    className="w-3.5 h-3.5"
                  />
                  <span>{t("auth:signIn.submitButton")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="flex gap-2 p-3">
        <button
          type="button"
          onClick={() => changeRole("admin")}
          className="
      flex-1 rounded-xl
      border border-cyan-500/15
      bg-cyan-50
      px-3 py-1.5
      text-xs text-cyan-700

      dark:border-cyan-500/18
      dark:bg-cyan-500/6
      dark:text-cyan-300/90
    "
        >
          Admin Demo
        </button>

        <button
          type="button"
          onClick={() => changeRole("hospital")}
          className="
      flex-1 rounded-xl
      border border-emerald-500/15
      bg-emerald-50
      px-3 py-1.5
      text-xs text-emerald-700

      dark:border-emerald-500/18
      dark:bg-emerald-500/6
      dark:text-emerald-300/90
    "
        >
          Hospital Demo
        </button>
      </div>

      {/* ── Card bottom accent line ── */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/3 to-transparent" />
    </div>
  );
}
