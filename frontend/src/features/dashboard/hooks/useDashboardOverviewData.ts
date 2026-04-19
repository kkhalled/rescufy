import { useTranslation } from "react-i18next";
import type { DispatchActivityEvent } from "../components/DispatchActivityFeed";
import type { DashboardAlert } from "../components/AlertsPanel";
import type { SystemHealthStatus } from "../components/SystemHealthSection";

export function useDashboardOverviewData() {
  const { t } = useTranslation("dashboard");

  const avgDispatchMinutes = 4.1;
  const successRate = 93.6;
  const failedAssignments = 6;
  const delayedHandOffs = 2;
  const overloadedHospitals = 3;

  const availableAmbulances = 23;
  const totalAmbulances = 45;

  const healthStatus: SystemHealthStatus =
    failedAssignments >= 10 || avgDispatchMinutes > 6
      ? "critical"
      : failedAssignments >= 5 || avgDispatchMinutes > 4.5 || successRate < 92
        ? "warning"
        : "healthy";

  const activityEvents: DispatchActivityEvent[] = [
    {
      id: "ev-1",
      requestId: "REQ-2026-091",
      patientName: "Khaled Mahmoud",
      type: "requestReceived",
      minutesAgo: 1,
    },
    {
      id: "ev-2",
      requestId: "REQ-2026-091",
      patientName: "Khaled Mahmoud",
      type: "ambulanceAssigned",
      minutesAgo: 1,
      ambulanceName: "AMB-14",
    },
    {
      id: "ev-3",
      requestId: "REQ-2026-089",
      patientName: "Lama Othman",
      type: "etaUpdated",
      minutesAgo: 3,
      etaMinutes: 6,
    },
    {
      id: "ev-4",
      requestId: "REQ-2026-083",
      patientName: "Yasser Adel",
      type: "completed",
      minutesAgo: 5,
      ambulanceName: "AMB-22",
    },
  ];

  const alerts: DashboardAlert[] = [
    {
      id: "alert-1",
      severity: "critical",
      title: t("alerts.items.noAmbulance.title"),
      description: t("alerts.items.noAmbulance.description"),
      zone: t("alerts.zones.westSector"),
      minutesAgo: 2,
      recommendation: t("alerts.items.noAmbulance.recommendation"),
    },
    {
      id: "alert-2",
      severity: "warning",
      title: t("alerts.items.dispatchDelay.title"),
      description: t("alerts.items.dispatchDelay.description", {
        value: delayedHandOffs,
      }),
      zone: t("alerts.zones.centralDistrict"),
      minutesAgo: 6,
      recommendation: t("alerts.items.dispatchDelay.recommendation"),
    },
    {
      id: "alert-3",
      severity: "info",
      title: t("alerts.items.hospitalLoad.title"),
      description: t("alerts.items.hospitalLoad.description", {
        value: overloadedHospitals,
      }),
      zone: t("alerts.zones.cityWide"),
      minutesAgo: 9,
      recommendation: t("alerts.items.hospitalLoad.recommendation"),
    },
  ];

  
  return {
    avgDispatchMinutes,
    successRate,
    failedAssignments,
    availableAmbulances,
    totalAmbulances,
    healthStatus,
    activityEvents,
    alerts,
    
  };
}
