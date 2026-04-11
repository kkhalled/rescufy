import { StatCard } from "./StatCard";
import { Radio, AlertTriangle, Ambulance, Building2 } from "lucide-react";
import RecentRequests from "./RecentRequests";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

export default function DashBoardContent() {
  const { t } = useTranslation("dashboard");
  const shouldReduceMotion = useReducedMotion();

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
            className="pointer-events-none absolute -top-10 left-1/4 h-36 w-36 rounded-full bg-primary/20"
            animate={{
              x: [0, 22, 0],
              y: [0, -14, 0],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{ duration: 8.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-20 right-8 h-28 w-28 rounded-full bg-info/20"
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
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 1. Active Emergency Requests (Live Count) */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
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
        </motion.div>

        {/* 2. Critical Cases (Severity = High / Critical) */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
          <StatCard
            title={t("stats.criticalCases")}
            value={criticalCases}
            icon={AlertTriangle}
            subtitle={t("stats.avgResponseTime", {
              time: avgCriticalResponseTime,
            })}
            variant="critical"
          />
        </motion.div>

        {/* 3. Available Ambulances */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
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
                  <motion.div
                    className={`h-full rounded-full ${
                      availabilityPercentage < 30
                        ? "bg-red-500"
                        : availabilityPercentage < 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${availabilityPercentage}%`,
                      transformOrigin: "0% 50%",
                    }}
                    initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
                    whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
                  />
                </div>
              </div>
            }
            variant={availabilityPercentage < 30 ? "warning" : "success"}
          />
        </motion.div>

        {/* 4. Hospital Capacity Overview */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
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
                  <motion.div
                    className={`h-full rounded-full ${
                      occupancyPercentage > 85
                        ? "bg-red-500"
                        : occupancyPercentage > 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${occupancyPercentage}%`,
                      transformOrigin: "0% 50%",
                    }}
                    initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
                    whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.24 }}
                  />
                </div>
              </div>
            }
            variant={occupancyPercentage > 85 ? "warning" : "default"}
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
        <RecentRequests />
      </motion.div>
    </section>
  );
}
