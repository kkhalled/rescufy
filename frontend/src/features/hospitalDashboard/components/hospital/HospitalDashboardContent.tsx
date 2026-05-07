import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, AlertTriangle, Bed, PhoneCall } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { useGetMyHospital } from "@/features/hospitalProfile/hooks/useGetMyHospital";
import HospitalRecentRequests from "./HospitalRecentRequests";

export default function HospitalDashboardContent() {
  const { t } = useTranslation("dashboard");
  const { hospital, isLoading, fetchMyHospital } = useGetMyHospital();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetchMyHospital();
  }, [fetchMyHospital]);

  const totalBeds = hospital?.bedCapacity ?? 0;
  const availableBeds = hospital?.availableBeds ?? 0;
  const occupancyPercentage =
    totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0;

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
        <FontAwesomeIcon icon={faSpinner} className="text-2xl text-primary animate-spin" />
      </div>
    );
  }

  return (
  <section className="relative isolate">
    {/* Mobile Overview */}
    <section className="mb-6 md:hidden">
      <div
        className="
          rounded-3xl
          border border-white/[0.05]

          bg-bg-card/95

          p-4

          shadow-card
          backdrop-blur-sm
        "
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-heading">
              {t("hospital.overview")}
            </h3>

            <p className="text-xs text-muted">
              {t("stats.live")}
            </p>
          </div>

          <div
            className="
              inline-flex h-10 w-10
              items-center justify-center

              rounded-xl

              border border-cyan-500/15
              bg-cyan-500/10

              text-cyan-300
            "
          >
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Assigned */}
          <div className="rounded-2xl bg-surface-muted/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
              {t("hospital.assignedRequests")}
            </p>

            <p className="mt-2 text-2xl font-bold text-heading">
              {assignedRequests}
            </p>

            <p className="mt-1 text-xs text-cyan-300">
              +{newAssigned} {t("hospital.newAssigned")}
            </p>
          </div>

          {/* Critical */}
          <div className="rounded-2xl bg-red-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-red-300">
              {t("stats.criticalCases")}
            </p>

            <p className="mt-2 text-2xl font-bold text-red-300">
              {criticalCases}
            </p>

            <p className="mt-1 text-xs text-red-200/80">
              {avgCriticalResponseTime}
            </p>
          </div>

          {/* Beds */}
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-emerald-300">
              {t("hospital.availableBeds")}
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-300">
              {availableBeds}
            </p>

            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`
                    h-full rounded-full
                    ${
                      occupancyPercentage > 85
                        ? "bg-red-400"
                        : occupancyPercentage > 70
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }
                  `}
                  style={{
                    width: `${occupancyPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-[11px] text-muted">
                {occupancyPercentage}% {t("stats.occupied")}
              </p>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-cyan-300">
              {t("hospital.activeCases")}
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-300">
              {activeCases}
            </p>

            <p className="mt-1 text-xs text-cyan-200/80">
              {inTransit} {t("hospital.inTransitLabel")}
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Desktop Cards */}
    <motion.div
      className="
        relative z-10

        hidden md:grid

        grid-cols-2
        lg:grid-cols-4

        gap-4 lg:gap-5

        mb-6 md:mb-8
      "
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Assigned Requests */}
      <motion.div
        variants={cardVariants}
        className="h-full"
      >
        <StatCard
          title={t("hospital.assignedRequests")}
          value={assignedRequests}
          icon={PhoneCall}
          badge={t("stats.live")}
          subtitle={
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-success">
                <span className="text-lg">↑</span>

                {newAssigned}
                {" "}
                {t("hospital.newAssigned")}
              </span>

              <span className="opacity-40">•</span>

              <span className="flex items-center gap-1 text-muted">
                <span className="text-lg">↓</span>

                {completedRecently}
                {" "}
                {t("hospital.completedRecently")}
              </span>
            </div>
          }
          variant="default"
        />
      </motion.div>

      {/* Critical Cases */}
      <motion.div
        variants={cardVariants}
        className="h-full"
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

      {/* Beds */}
      <motion.div
        variants={cardVariants}
        className="h-full"
      >
        <StatCard
          title={t("hospital.availableBeds")}
          value={availableBeds}
          icon={Bed}
          subtitle={
            <div className="space-y-2">
              <div className="text-xs">
                {t("stats.occupancyRate", {
                  percent: occupancyPercentage,
                })}
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`
                    h-full rounded-full
                    ${
                      occupancyPercentage > 85
                        ? "bg-red-500"
                        : occupancyPercentage > 70
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }
                  `}
                  style={{
                    width: `${occupancyPercentage}%`,
                  }}
                />
              </div>
            </div>
          }
          variant={
            occupancyPercentage > 85
              ? "warning"
              : "default"
          }
        />
      </motion.div>

      {/* Active Cases */}
      <motion.div
        variants={cardVariants}
        className="h-full"
      >
        <StatCard
          title={t("hospital.activeCases")}
          value={activeCases}
          icon={Activity}
          subtitle={t("hospital.inTransit", {
            count: inTransit,
          })}
          variant="success"
        />
      </motion.div>
    </motion.div>

    {/* Requests */}
    <motion.div
      initial={
        shouldReduceMotion
          ? undefined
          : { opacity: 0, y: 14 }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    >
      <HospitalRecentRequests />
    </motion.div>
  </section>
);
}