import { motion } from "framer-motion";
import { Activity, AlertTriangle, Ambulance, Radio } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard } from "./StatCard";

type DashboardStatsGridProps = {
  shouldReduceMotion: boolean;
  totalRequests: number;
  completedRequests: number;
  failedCancelledRequests: number;
  completionRate: number;
  failedCancelledRate: number;
  availableAmbulances: number;
  totalAmbulances: number;
};

export function DashboardStatsGrid({
  shouldReduceMotion,
  totalRequests,
  completedRequests,
  failedCancelledRequests,
  completionRate,
  failedCancelledRate,
  availableAmbulances,
  totalAmbulances,
}: DashboardStatsGridProps) {
  const { t } = useTranslation("dashboard");

  const availabilityPercentage =
    totalAmbulances > 0
      ? Math.round((availableAmbulances / totalAmbulances) * 100)
      : 0;

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
  <>
    {/* Mobile Overview */}
    <section className="mb-6 md:hidden">
      <div
        className="
          rounded-3xl
          border border-border/60
          bg-bg-card/95

          p-4

          shadow-card
          backdrop-blur-sm
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-heading">
              {t("stats.overview")}
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

              border border-primary/20
              bg-primary/10

              text-primary
            "
          >
            <Radio className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Total */}
          <div className="rounded-2xl bg-surface-muted/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
              {t("stats.totalRequests")}
            </p>

            <p className="mt-2 text-2xl font-bold text-heading">
              {totalRequests}
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-emerald-300">
              {t("stats.completedRequests")}
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-300">
              {completedRequests}
            </p>
          </div>

          {/* Failed */}
          <div className="rounded-2xl bg-amber-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-amber-300">
              {t("stats.failedCancelledRequests")}
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-300">
              {failedCancelledRequests}
            </p>
          </div>

          {/* Fleet */}
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-cyan-300">
              {t("kpi.fleetReadiness.title")}
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-300">
              {availabilityPercentage}%
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Desktop Grid */}
    <motion.div
      className="
        relative z-10
        hidden md:grid

        grid-cols-2
        lg:grid-cols-4

        gap-4 lg:gap-6

        mb-6 md:mb-8
      "
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total Requests */}
      <motion.div
        className="h-full"
        variants={cardVariants}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                scale: 1.01,
                transition: { duration: 0.24 },
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : { scale: 0.998 }
        }
      >
        <StatCard
          title={t("stats.totalRequests")}
          value={totalRequests}
          icon={Radio}
          badge={t("stats.live")}
          subtitle={
            <div className="text-xs">
              <p className="text-muted">
                {t("stats.completedRequests")}:
                {" "}
                {completedRequests}
                {" • "}
                {t("stats.failedCancelledRequests")}:
                {" "}
                {failedCancelledRequests}
              </p>
            </div>
          }
          variant="default"
        />
      </motion.div>

      {/* Completed */}
      <motion.div
        className="h-full"
        variants={cardVariants}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                scale: 1.01,
                transition: { duration: 0.24 },
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : { scale: 0.998 }
        }
      >
        <StatCard
          title={t("stats.completedRequests")}
          value={completedRequests}
          icon={Activity}
          subtitle={
            <div className="text-xs">
              <p className="text-success">
                {t("stats.ofTotalRequests", {
                  percent: completionRate.toFixed(1),
                })}
              </p>
            </div>
          }
          chart={
            <div className="h-2 w-full overflow-hidden rounded-full bg-success/15">
              <motion.div
                className="h-full rounded-full bg-success"
                style={{
                  width: `${completionRate}%`,
                  transformOrigin: "0% 50%",
                }}
                initial={
                  shouldReduceMotion
                    ? undefined
                    : { scaleX: 0 }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : { scaleX: 1 }
                }
                viewport={{ once: true, amount: 0.7 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: 0.12,
                }}
              />
            </div>
          }
          variant="success"
        />
      </motion.div>

      {/* Failed */}
      <motion.div
        className="h-full"
        variants={cardVariants}
      >
        <StatCard
          title={t("stats.failedCancelledRequests")}
          value={failedCancelledRequests}
          icon={AlertTriangle}
          subtitle={
            <div className="text-xs">
              <p className="text-info">
                {t("stats.ofTotalRequests", {
                  percent: failedCancelledRate.toFixed(1),
                })}
              </p>
            </div>
          }
          variant="warning"
        />
      </motion.div>

      {/* Fleet */}
      <motion.div
        className="h-full"
        variants={cardVariants}
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
                style={{
                  width: `${availabilityPercentage}%`,
                  transformOrigin: "0% 50%",
                }}
                initial={
                  shouldReduceMotion
                    ? undefined
                    : { scaleX: 0 }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : { scaleX: 1 }
                }
                viewport={{ once: true, amount: 0.7 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: 0.2,
                }}
              />
            </div>
          }
          variant="info"
        />
      </motion.div>
    </motion.div>
  </>
);
}
