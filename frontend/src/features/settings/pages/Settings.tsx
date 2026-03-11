
import { useTranslation } from "react-i18next";
import useSettingsTabs from "../hooks/useSettingsTabs";
import TabNavigation from "../components/TabNavigation";
import ProfileSection from "../components/ProfileSection";
import PasswordSection from "../components/PasswordSection";
import SecuritySidebar from "../components/SecuritySidebar";

export default function Settings() {

  const { t } = useTranslation(["settings"]);
  const { activeTab, setActiveTab } = useSettingsTabs();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
            {t("title")}
          </h1>
          <p className="text-body text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          {/* Main Content */}
          <div>
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "password" && <PasswordSection />}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <SecuritySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

