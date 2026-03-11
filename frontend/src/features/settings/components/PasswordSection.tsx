import InputFiled from "@/shared/ui/FormInput/InputFiled";
import { faLock, faKey, faShieldAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePasswordChange from "../hooks/usePasswordChange";
import { useTranslation } from "react-i18next";
 
export default function PasswordSection(){
  const { formik } = usePasswordChange();
  const { t } = useTranslation("settings");

  return (
    <div className="bg-surface-card rounded-card p-6 sm:p-8 shadow-card border border-border">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <h2 className="text-2xl font-bold text-heading mb-2">{t("password.header")}</h2>
        <p className="text-muted text-sm">
          {t("password.description")}
        </p>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <InputFiled
          label={t("password.currentPassword")}
          id="currentPassword"
          name="currentPassword"
          icon={faLock}
          placeholder={t("password.currentPasswordPlaceholder", "Enter your current password")}
          type="password"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.currentPassword && formik.errors.currentPassword
              ? formik.errors.currentPassword
              : undefined
          }
        />
        
        <InputFiled
          label={t("password.newPassword")}
          id="newPassword"
          name="newPassword"
          icon={faKey}
          placeholder={t("password.newPasswordPlaceholder", "Enter your new password")}
          type="password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.newPassword && formik.errors.newPassword
              ? formik.errors.newPassword
              : undefined
          }
        />
        
        <InputFiled
          label={t("password.confirmPassword")}
          id="confirmPassword"
          name="confirmPassword"
          icon={faKey}
          placeholder={t("password.confirmPasswordPlaceholder", "Confirm your new password")}
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
        />

        {/* Password Requirements */}
        <div className="bg-info/10 rounded-xl p-4 border border-info/20">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faShieldAlt} className="text-info mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-heading mb-2">
                {t("password.requirements")}
              </h4>
              <ul className="text-sm text-body space-y-1.5">
                {(t("password.requirementList", { returnObjects: true }) as string[]).map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-info text-xs" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
            {t("password.updatePassword")}
          </button>
          
          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="px-6 py-3 bg-surface-muted text-body font-semibold rounded-lg hover:bg-surface-muted/80 transition-all border border-border"
          >
            {t("password.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}