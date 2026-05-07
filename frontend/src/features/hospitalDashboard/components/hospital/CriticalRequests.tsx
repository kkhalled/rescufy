import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Request } from "@/features/requests/types/request.types";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type CriticalRequestsProps = {
  requests: Request[];
};

function getAgeLabel(createdAt: string | null, t: (key: string, options?: Record<string, unknown>) => string) {
  if (!createdAt) return t("recentRequests.designModeHint");
  const ms = Date.now() - new Date(createdAt).getTime();
  if (Number.isNaN(ms) || ms < 0) return t("recentRequests.designModeHint");
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 1) return t("activityFeed.minutesAgo", { count: 0 });
  return t("activityFeed.minutesAgo", { count: minutes });
}

export default function CriticalRequests({ requests }: CriticalRequestsProps) {
  const { t } = useTranslation("dashboard");
  const shouldReduceMotion = useReducedMotion();
  const criticalRequests = requests
    .filter((request) => {
      const priority = request.priority?.toLowerCase();
      const status = request.status?.toLowerCase();
      return (
        priority === "critical" ||
        priority === "high" ||
        status === "failed" ||
        status === "searching"
      );
    })
    .sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime();
      const bTime = new Date(b.createdAt ?? 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 18,
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.section
      className="relative overflow-hidden rounded-lg border border-red-500/20 px-1 py-2 text-heading shadow-[0_0_60px_rgba(230,57,70,0.15)] md:rounded-2xl md:px-3 md:py-6"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {!shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl border border-red-500/30"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.008, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-0.5 w-20 bg-linear-to-r from-transparent via-red-500/90 to-transparent"
            animate={{ x: [-90, 420] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
        </>
      )}

      <div className="relative">
        <header className="mb-4 flex items-center gap-2 border-b border-red-500/20 py-3 rtl:space-x-reverse md:mb-6 md:py-1">
          <motion.span
            animate={shouldReduceMotion ? undefined : { rotate: [0, -12, 10, -7, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          >
            <FontAwesomeIcon icon={faBell} style={{ color: "#E63946" }} />
          </motion.span>

          {!shouldReduceMotion && (
            <motion.span
              aria-hidden
              className="h-2 w-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
            />
          )}

          <span className="text-sm font-medium md:text-base">{t("criticalRequests.title")}</span>
        </header>

        {criticalRequests.length === 0 ? (
          <div className="rounded-xl border border-border/70 bg-surface-card/70 p-4 text-sm text-muted">
            No high-priority active requests right now.
          </div>
        ) : (
          <motion.div
            className="grid space-y-2"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {criticalRequests.map((request) => (
              <motion.article
                key={request.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-red-500/20 bg-bg-card/85 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted">
                  <span>#{request.id}</span>
                  <StatusBadge priority={request.priority || undefined} />
                </div>
                <p className="truncate text-sm font-semibold text-heading">
                  {request.patientName || "-"}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {request.description || request.location || "-"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-red-400">
                    {getAgeLabel(request.createdAt, t)}
                  </span>
                  <StatusBadge status={request.status || undefined} />
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
        <div className="mt-3 text-right">
          <Link to="/hospital/requests" className="text-xs font-medium text-primary transition hover:opacity-80">
            {t("recentRequests.viewAll")}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}