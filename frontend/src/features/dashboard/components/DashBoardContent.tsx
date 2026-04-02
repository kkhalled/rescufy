import { StatCard } from "./StatCard";
import { Radio, AlertTriangle, Ambulance, Building2 } from "lucide-react";
import RecentRequests from "./RecentRequests";
import { useTranslation } from "react-i18next";

export default function DashBoardContent() {
  const { t } = useTranslation("dashboard");

  // Mock data - replace with real data from your API/store
  const activeRequests = 47;
  const newRequests = 8; // new in last 10 mins
  const resolvedRequests = 5; // resolved recently

  const criticalCases = 12;
  const avgCriticalResponseTime = "4.2 min";

  const availableAmbulances = 23;
  const totalAmbulances = 45;
  const busyPercentage = Math.round(
    ((totalAmbulances - availableAmbulances) / totalAmbulances) * 100,
  );
  const availabilityPercentage = Math.round(
    (availableAmbulances / totalAmbulances) * 100,
  );

  const totalBeds = 850;
  const availableBeds = 127;
  const occupancyPercentage = Math.round(
    ((totalBeds - availableBeds) / totalBeds) * 100,
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        
        {/* 1. Active Emergency Requests (Live Count) */}
        <StatCard
          title={t("stats.activeEmergencyRequests")}
          value={activeRequests}
          icon={Radio}
          badge={t("stats.live")}
          subtitle={
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-success">
                <span className="text-lg">↑</span> {newRequests}{" "}
                {t("stats.newInLastTenMinutes")}
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 text-muted">
                <span className="text-lg">↓</span> {resolvedRequests}{" "}
                {t("stats.resolvedRecently")}
              </span>
            </div>
          }
          variant="default"
        />

        {/* 2. Critical Cases (Severity = High / Critical) */}
        <StatCard
          title={t("stats.criticalCases")}
          value={criticalCases}
          icon={AlertTriangle}
          subtitle={t("stats.avgResponseTime", {
            time: avgCriticalResponseTime,
          })}
          variant="critical"
        />

        {/* 3. Available Ambulances */}
        <StatCard
          title={t("stats.availableAmbulances")}
          value={availableAmbulances}
          icon={Ambulance}
          subtitle={
            <div className="space-y-2">
              <div className="text-xs">
                {t("stats.fleetBusy", { percent: busyPercentage })}
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-white/20 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    availabilityPercentage < 30
                      ? "bg-red-500"
                      : availabilityPercentage < 50
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${availabilityPercentage}%` }}
                />
              </div>
            </div>
          }
          variant={availabilityPercentage < 30 ? "warning" : "success"}
        />

        {/* 4. Hospital Capacity Overview */}
        <StatCard
          title={t("stats.hospitalCapacity")}
          value={availableBeds}
          icon={Building2}
          subtitle={
            <div className="space-y-2">
              <div className="text-xs">
                {t("stats.occupancyRate", { percent: occupancyPercentage })}
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-white/20 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    occupancyPercentage > 85
                      ? "bg-red-500"
                      : occupancyPercentage > 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>
          }
          variant={occupancyPercentage > 85 ? "warning" : "default"}
        />
      </div>
      <RecentRequests />
    </>
  );
}
