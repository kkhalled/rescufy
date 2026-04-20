import { Activity, AlertTriangle, CheckCircle2, Clock3, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";

export type SystemHealthStatus = "healthy" | "warning" | "critical";

type SystemHealthSectionProps = {
  status: SystemHealthStatus;
  avgDispatchMinutes: number;
  successRate: number;
  failedAssignments: number;
};

const STATUS_THEME: Record<
  SystemHealthStatus,
  {
    badge: string;
    icon: typeof CheckCircle2;
    surface: string;
    border: string;
  }
> = {
  healthy: {
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35",
    icon: CheckCircle2,
    surface: "bg-emerald-500/8",
    border: "border-emerald-500/20",
  },
  warning: {
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35",
    icon: AlertTriangle,
    surface: "bg-amber-500/10",
    border: "border-amber-500/25",
  },
  critical: {
    badge: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/35",
    icon: Siren,
    surface: "bg-red-500/12",
    border: "border-red-500/25",
  },
};

export function SystemHealthSection({
  status,
  avgDispatchMinutes,
  successRate,
  failedAssignments,
}: SystemHealthSectionProps) {
  const { t } = useTranslation("dashboard");
  const theme = STATUS_THEME[status];
  const StatusIcon = theme.icon;

  return (
    <section className={`rounded-2xl border ${theme.border} ${theme.surface} p-4 md:p-5 shadow-card`}>
      <div className="flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-heading">{t("monitoring.systemHealth.title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("monitoring.systemHealth.description")}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] md:self-auto">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${theme.badge}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {t(`monitoring.systemHealth.${status}`)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-border/70 bg-bg-card px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-muted">
            <Clock3 className="h-3.5 w-3.5" />
            {t("monitoring.systemHealth.avgDispatchTime")}
          </p>
          <p className="mt-1 text-xl font-semibold text-heading">{avgDispatchMinutes.toFixed(1)} min</p>
        </article>

        <article className="rounded-xl border border-border/70 bg-bg-card px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-muted">
            <Activity className="h-3.5 w-3.5" />
            {t("monitoring.systemHealth.successRate")}
          </p>
          <p className="mt-1 text-xl font-semibold text-heading">{successRate.toFixed(1)}%</p>
        </article>

        <article className="rounded-xl border border-border/70 bg-bg-card px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-muted">
            <Siren className="h-3.5 w-3.5" />
            {t("monitoring.systemHealth.failedAssignments")}
          </p>
          <p className="mt-1 text-xl font-semibold text-heading">{failedAssignments}</p>
        </article>
      </div>
    </section>
  );
}
