import InputFiled from "../../../../shared/ui/FormInput/InputFiled";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function SignUpForm() {
  const { t } = useTranslation(["auth", "validation"]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10">
          <faUser className="hidden" />
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t("auth:signUp.title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Start your emergency response journey today
        </p>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
        >
          <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
        >
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          OR
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Form */}
      <form className="space-y-1">
        {/* Full Name - Full Width */}
        <InputFiled
          label={t("auth:signUp.fullNameLabel")}
          id="fullName"
          name="fullName"
          icon={faUser}
          placeholder={t("auth:signUp.fullNamePlaceholder")}
          type="text"
        />

        {/* Email & Phone - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <InputFiled
            label={t("auth:signUp.emailLabel")}
            id="email"
            name="email"
            icon={faEnvelope}
            placeholder={t("auth:signUp.emailPlaceholder")}
            type="email"
          />
          <InputFiled
            label={t("auth:signUp.phoneLabel")}
            id="phone"
            name="phone"
            icon={faPhone}
            placeholder={t("auth:signUp.phonePlaceholder")}
            type="tel"
          />
        </div>

        {/* Password & Confirm - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <InputFiled
            label={t("auth:signUp.passwordLabel")}
            id="password"
            name="password"
            icon={faLock}
            placeholder={t("auth:signUp.passwordPlaceholder")}
            type="password"
          />
          <InputFiled
            label={t("auth:signUp.confirmPasswordLabel")}
            id="confirmPassword"
            name="confirmPassword"
            icon={faLock}
            placeholder={t("auth:signUp.confirmPasswordPlaceholder")}
            type="password"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2.5 pt-2 pb-4">
          <input
            type="checkbox"
            id="terms"
            className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 cursor-pointer accent-primary"
          />
          <label
            htmlFor="terms"
            className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer"
          >
            {t("auth:signUp.termsAgree")}{" "}
            <a href="#" className="text-primary font-semibold hover:underline">
              {t("auth:signUp.termsLink")}
            </a>{" "}
            {t("auth:signUp.and")}{" "}
            <a href="#" className="text-primary font-semibold hover:underline">
              {t("auth:signUp.privacyLink")}
            </a>
          </label>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="
            group/btn w-full
            bg-primary hover:bg-primary/90
            text-white
            py-3.5
            rounded-xl
            font-bold text-sm
            shadow-lg shadow-primary/20
            hover:shadow-xl hover:shadow-primary/30
            active:scale-[0.98]
            transition-all duration-300
            flex items-center justify-center gap-2
          "
        >
          {t("auth:signUp.submitButton")}
          <svg
            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("auth:signUp.hasAccount")}{" "}
          <Link
            to="/signin"
            className="text-primary font-bold hover:underline transition-colors"
          >
            {t("auth:signUp.signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
