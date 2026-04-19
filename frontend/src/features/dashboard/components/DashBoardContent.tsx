import { motion, useReducedMotion } from "framer-motion";
import { DispatchActivityFeed } from "./DispatchActivityFeed";
import { SystemHealthSection } from "./SystemHealthSection";
import { AlertsPanel } from "./AlertsPanel";
import { DashboardAmbientDecor } from "./DashboardAmbientDecor";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";

export default function DashBoardContent() {
  const shouldReduceMotion = !!useReducedMotion();
  const {
    totalRequests,
    completedRequests,
    failedCancelledRequests,
    completionRate,
    failedCancelledRate,
  } = useDashboardStats();
  const {
    avgDispatchMinutes,
    successRate,
    failedAssignments,
    availableAmbulances,
    totalAmbulances,
    healthStatus,
    activityEvents,
    alerts,
  } = useDashboardOverviewData();

  return (
    <section className="relative isolate">
      <DashboardAmbientDecor shouldReduceMotion={shouldReduceMotion} />

      <DashboardStatsGrid
        shouldReduceMotion={shouldReduceMotion}
        totalRequests={totalRequests}
        completedRequests={completedRequests}
        failedCancelledRequests={failedCancelledRequests}
        completionRate={completionRate}
        failedCancelledRate={failedCancelledRate}
        availableAmbulances={availableAmbulances}
        totalAmbulances={totalAmbulances}
      />

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

    </section>
  );
}
