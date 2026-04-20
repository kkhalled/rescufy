import { StatCard } from "./StatCard";
import { Activity, Ambulance, Clock3, Radio } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  DispatchActivityFeed,
  type DispatchActivityEvent,
} from "./DispatchActivityFeed";
import { SystemHealthSection, type SystemHealthStatus } from "./SystemHealthSection";
import { AlertsPanel, type DashboardAlert } from "./AlertsPanel";
import {
  SystemDecisionInsights,
  type DecisionInsight,
} from "./SystemDecisionInsights";

export default function DashBoardContent() {
  const { t } = useTranslation("dashboard");
  const shouldReduceMotion = useReducedMotion();

  // Dashboard design-mode data until backend metrics stream is connected.
  const activeRequests = 47;
  const newRequests = 8;
  const resolvedRequests = 5;
  const avgDispatchMinutes = 4.1;
  const successRate = 93.6;
  const failedAssignments = 6;
  const delayedHandOffs = 2;
  const overloadedHospitals = 3;

  const availableAmbulances = 23;
  const totalAmbulances = 45;
  const availabilityPercentage = Math.round(
    (availableAmbulances / totalAmbulances) * 100,
  );

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
      description: t("alerts.items.dispatchDelay.description", { value: delayedHandOffs }),
      zone: t("alerts.zones.centralDistrict"),
      minutesAgo: 6,
      recommendation: t("alerts.items.dispatchDelay.recommendation"),
    },
    {
      id: "alert-3",
      severity: "info",
      title: t("alerts.items.hospitalLoad.title"),
      description: t("alerts.items.hospitalLoad.description", { value: overloadedHospitals }),
      zone: t("alerts.zones.cityWide"),
      minutesAgo: 9,
      recommendation: t("alerts.items.hospitalLoad.recommendation"),
    },
  ];

  const decisionInsights: DecisionInsight[] = [
    {
      id: "insight-1",
      requestId: "REQ-2026-091",
      selectedAmbulance: "AMB-14",
      etaMinutes: 5,
      distanceKm: 3.7,
      confidence: 96,
      alternativesCount: 2,
      reasoning: t("decisionInsights.items.fastestCorridor"),
    },
    {
      id: "insight-2",
      requestId: "REQ-2026-089",
      selectedAmbulance: "AMB-07",
      etaMinutes: 6,
      distanceKm: 4.4,
      confidence: 91,
      alternativesCount: 3,
      reasoning: t("decisionInsights.items.bestHospitalMatch"),
    },
    {
      id: "insight-3",
      requestId: "REQ-2026-083",
      selectedAmbulance: "AMB-22",
      etaMinutes: 4,
      distanceKm: 2.9,
      confidence: 94,
      alternativesCount: 1,
      reasoning: t("decisionInsights.items.loadBalanced"),
    },
  ];

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.975,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative isolate">
      {!shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-primary/20 blur-xl"
            animate={{
              x: [0, 22, 0],
              y: [0, -14, 0],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{ duration: 8.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-20 right-8 h-32 w-32 rounded-full bg-cyan-500/20 blur-xl"
            animate={{
              x: [0, -18, 0],
              y: [0, 12, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{ duration: 9.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
        </>
      )}

      <motion.div
        className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6 mb-6 md:mb-8"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.998 }}
        >
          <StatCard
            title={t("kpi.activeQueue.title")}
            value={activeRequests}
            icon={Radio}
            badge={t("stats.live")}
            subtitle={
              <div className="text-xs">
                <p className="text-muted">
                  {newRequests} {t("stats.newInLastTenMinutes")} • {resolvedRequests} {t("stats.resolvedRecently")}
                </p>
              </div>
            }
            variant="default"
          />
        </motion.div>

        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.998 }}
        >
          <StatCard
            title={t("kpi.successRate.title")}
            value={`${successRate.toFixed(1)}%`}
            icon={Activity}
            subtitle={
              <div className="text-xs">
                <p className="text-success">{t("kpi.successRate.context", { value: failedAssignments })}</p>
              </div>
            }
            chart={
              <div className="h-2 w-full overflow-hidden rounded-full bg-success/15">
                <motion.div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${successRate}%`, transformOrigin: "0% 50%" }}
                  initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
                  whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.12 }}
                />
              </div>
            }
            variant="success"
          />
        </motion.div>

        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.998 }}
        >
          <StatCard
            title={t("kpi.dispatchTime.title")}
            value={`${avgDispatchMinutes.toFixed(1)} min`}
            icon={Clock3}
            subtitle={
              <div className="text-xs">
                <p className="text-info">
                  {t("kpi.dispatchTime.context", { count: delayedHandOffs })}
                </p>
              </div>
            }
            variant="warning"
          />
        </motion.div>

        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.998 }}
        >
          <StatCard
            title={t("kpi.fleetReadiness.title")}
            value={`${availabilityPercentage}%`}
            icon={Ambulance}
            subtitle={
              <div className="text-xs">
                <p className="text-info">
                  {t("kpi.fleetReadiness.context", {
                    available: availableAmbulances,
                    total: totalAmbulances,
                  })}
                </p>
              </div>
            }
            chart={
              <div className="h-2 w-full overflow-hidden rounded-full bg-cyan-500/15">
                <motion.div
                  className="h-full rounded-full bg-cyan-500"
                  style={{ width: `${availabilityPercentage}%`, transformOrigin: "0% 50%" }}
                  initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
                  whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
                />
              </div>
            }
            variant="info"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
      >
        <SystemHealthSection
          status={healthStatus}
          avgDispatchMinutes={avgDispatchMinutes}
          successRate={successRate}
          failedAssignments={failedAssignments}
        />
      </motion.div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <motion.div
          className="lg:col-span-8"
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <DispatchActivityFeed events={activityEvents} />
        </motion.div>

        <motion.div
          className="lg:col-span-4"
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.05 }}
        >
          <AlertsPanel alerts={alerts} />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mt-6"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 }}
      >
        <SystemDecisionInsights insights={decisionInsights} />
      </motion.div>
    </section>
  );
}
