import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faCheckCircle, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";


export default function SecuritySidebar(){

  const { t } = useTranslation("settings");
  return (
    <div className="bg-surface-card rounded-card p-6 shadow-card border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
        <h3 className="text-lg font-bold text-heading">{t("security.header")}</h3>
      </div>

      <div className="space-y-4">
        {/* Verification Status */}
        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-success mt-0.5 text-lg" 
            />
            <div>
              <p className="text-sm font-semibold text-heading mb-1">
                {t("security.verified")}
              </p>
              <p className="text-xs text-muted">
                {t("security.verifiedDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-muted text-xs" />
            </div>
            <div>
              <p className="text-xs text-muted">{t("security.lastLogin")}</p>
              <p className="font-medium text-body">Today at 2:30 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendar} className="text-muted text-xs" />
            </div>
            <div>
              <p className="text-xs text-muted">{t("security.accountCreated")}</p>
              <p className="font-medium text-body">Jan 15, 2024</p>
            </div>
          </div>
        </div>

        {/* Security Tip */}
        <div className="p-4 bg-surface-muted rounded-lg border border-border mt-4">
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-body">{t("security.tipTitle", "Security Tip:")}</strong> {t("security.tip")}
          </p>
        </div>
      </div>
    </div>
  );
}