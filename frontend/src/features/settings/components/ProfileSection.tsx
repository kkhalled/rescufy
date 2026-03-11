import {
  faUser,
  faEnvelope,
  faUserTag,
  faShieldAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputFiled from "@/shared/ui/FormInput/InputFiled";
import useProfileUpdate from "../hooks/useProfileUpdate";
import { useAuth } from "@/app/provider/AuthContext";
import { useTranslation } from "react-i18next";

export default function ProfileSection() {
  const { formik } = useProfileUpdate();
  const { user } = useAuth();
  const { t } = useTranslation("settings");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to update your account information?"
    );

    if (!confirmed) return;

    await formik.handleSubmit(e);
  };

  if (!user) {
    return (
      <div className="p-10 text-center text-muted">
        Loading account data...
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-card p-6 sm:p-8 shadow-card border border-border">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-heading mb-2">
            {t("profile.header")}
          </h2>
          <p className="text-sm text-muted">
            {t("profile.description")}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-semibold self-start">
          <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
          {t("profile.active")}
        </span>
      </div>

      {/* User Identity Card */}
      <div className="mb-8">
        <div className="flex items-center gap-4 p-4 bg-surface-muted rounded-xl border border-border">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary ring-4 ring-primary/10">
            {user?.FullName?.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-heading truncate">
              {user?.FullName}
            </h3>
            <p className="text-muted text-sm truncate">{user?.Email}</p>
            
            {/* Role Badge */}
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-semibold">
                <FontAwesomeIcon icon={faShieldAlt} className="text-xs" />
                {user?.Role || t("profile.role", "User")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Metadata */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8 p-5 bg-surface-muted rounded-xl border border-border">
        <div>
          <p className="text-xs text-muted mb-1">Last Login</p>
          <p className="text-sm font-semibold text-body">Today at 2:30 PM</p>
        </div>

        <div>
          <p className="text-xs text-muted mb-1">Account Created</p>
          <p className="text-sm font-semibold text-body">Jan 15, 2024</p>
        </div>

        <div>
          <p className="text-xs text-muted mb-1">Email Status</p>
          <p className="text-sm font-semibold text-success flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
            {t("profile.verified")}
          </p>
        </div>
      </div>

      {/* Editable Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <InputFiled
            label={t("profile.fullName")}
            id="fullName"
            name="fullName"
            icon={faUser}
            placeholder={t("profile.fullNamePlaceholder", "Enter your full name")}
            type="text"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.fullName && formik.errors.fullName
                ? formik.errors.fullName
                : undefined
            }
          />

          <InputFiled
            label={t("profile.userName")}
            id="userName"
            name="userName"
            icon={faUserTag}
            placeholder={t("profile.userNamePlaceholder", "Enter your username")}
            type="text"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.userName && formik.errors.userName
                ? formik.errors.userName
                : undefined
            }
          />
        </div>

        <InputFiled
          label={t("profile.email")}
          id="email"
          name="email"
          icon={faEnvelope}
          placeholder={t("profile.emailPlaceholder", "Enter your email address")}
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <button
            type="submit"
            disabled={
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.dirty
            }
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
          >
            {formik.isSubmitting ? t("profile.updating", "Updating...") : t("profile.saveChanges")}
          </button>

          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="px-6 py-3 bg-surface-muted text-body font-semibold rounded-lg hover:bg-surface-muted/80 transition-all border border-border"
          >
            {t("profile.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}