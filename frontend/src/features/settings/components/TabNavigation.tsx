import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import type { ActiveTab } from "../types/settings.types";
import { useTranslation } from "react-i18next";

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps){

  const { t } = useTranslation("settings");
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onTabChange("profile")}
        className={`
          flex items-center gap-2 px-5 py-3 font-semibold rounded-lg transition-all
          ${
            activeTab === "profile"
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-surface-card text-muted hover:text-body hover:bg-surface-muted border border-border"
          }
        `}
      >
        <FontAwesomeIcon icon={faUser} className="text-sm" />
        <span className="hidden sm:inline">{t("tabs.profile")}</span>
        <span className="sm:hidden">{t("tabs.profile")}</span>
      </button>
      
      <button
        onClick={() => onTabChange("password")}
        className={`
          flex items-center gap-2 px-5 py-3 font-semibold rounded-lg transition-all
          ${
            activeTab === "password"
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-surface-card text-muted hover:text-body hover:bg-surface-muted border border-border"
          }
        `}
      >
        <FontAwesomeIcon icon={faShieldAlt} className="text-sm" />
        <span className="hidden sm:inline">{t("tabs.password")}</span>
        <span className="sm:hidden">{t("tabs.password")}</span>
      </button>
    </div>
  );
}