import { StatCard } from "./StatCard";
import { PhoneCall, AlertTriangle, Bed, Activity } from "lucide-react";
import HospitalRecentRequests from "./HospitalRecentRequests";
import { useTranslation } from "react-i18next";
import { useGetMyHospital } from "@/features/hospitals_management/hooks/useGetMyHospital";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, useReducedMotion } from "framer-motion";

export default function HospitalDashboardContent() {
  const { t } = useTranslation("dashboard");
  const { hospital, isLoading, fetchMyHospital } = useGetMyHospital();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetchMyHospital();
  }, []);

  // Real data from API, with fallbacks
  const totalBeds = hospital?.bedCapacity ?? 0;
  const availableBeds = hospital?.availableBeds ?? 0;
  const occupancyPercentage = totalBeds > 0
    ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100)
    : 0;

  // These stats still need their own API endpoints - using placeholders for now
  const assignedRequests = 0;
  const newAssigned = 0;
  const completedRecently = 0;
  const criticalCases = 0;
  const avgCriticalResponseTime = "-- min";
  const activeCases = 0;
  const inTransit = 0;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary text-2xl" />
      </div>
    );
  }

  return (
    <section className="relative isolate">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Assigned Requests Count */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
          <StatCard
            title={t("hospital.assignedRequests")}
            value={assignedRequests}
            icon={PhoneCall}
            badge={t("stats.live")}
            subtitle={
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-success">
                  <span className="text-lg">↑</span> {newAssigned}{" "}
                  {t("hospital.newAssigned")}
                </span>
                <span className="opacity-40">•</span>
                <span className="flex items-center gap-1 text-muted">
                  <span className="text-lg">↓</span> {completedRecently}{" "}
                  {t("hospital.completedRecently")}
                </span>
              </div>
            }
            variant="default"
          />
        </motion.div>

        {/* 2. Critical Cases */}
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

        {/* 3. Available Beds */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
          <StatCard
            title={t("hospital.availableBeds")}
            value={availableBeds}
            icon={Bed}
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
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
                  />
                </div>
              </div>
            }
            variant={occupancyPercentage > 85 ? "warning" : "default"}
          />
        </motion.div>

        {/* 4. Active Cases */}
        <motion.div
          variants={cardVariants}
          whileHover={
            shouldReduceMotion ? undefined : { y: -8, scale: 1.01, transition: { duration: 0.24 } }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
        >
          <StatCard
            title={t("hospital.activeCases")}
            value={activeCases}
            icon={Activity}
            subtitle={t("hospital.inTransit", { count: inTransit })}
            variant="success"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
      >
        <HospitalRecentRequests />
      </motion.div>
    </section>
  );
}
