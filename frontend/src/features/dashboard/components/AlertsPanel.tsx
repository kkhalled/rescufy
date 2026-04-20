import { AlertTriangle, BellRing, CircleAlert, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";

export type DashboardAlertSeverity = "critical" | "warning" | "info";

export type DashboardAlert = {
  id: string;
  severity: DashboardAlertSeverity;
  title: string;
  description: string;
  zone: string;
  minutesAgo: number;
  recommendation: string;
};

type AlertsPanelProps = {
  alerts: DashboardAlert[];
};

const SEVERITY_THEME: Record<
  DashboardAlertSeverity,
  {
    icon: typeof Siren;
    shell: string;
    badge: string;
  }
> = {
  critical: {
    icon: Siren,
    shell: "border-red-500/35 bg-red-500/8",
    badge: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/35",
  },
  warning: {
    icon: AlertTriangle,
    shell: "border-amber-500/35 bg-amber-500/8",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35",
  },
  info: {
    icon: CircleAlert,
    shell: "border-cyan-500/35 bg-cyan-500/8",
    badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/35",
  },
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const { t } = useTranslation("dashboard");

  return (
    <section className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card">
      <div className="border-b border-border/70 pb-4">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-heading">
          <BellRing className="h-4 w-4 text-danger" />
          <h3 className="text-lg">{t("alerts.title")}</h3>
        </div>
        <p className="mt-1 text-sm text-muted">{t("alerts.subtitle")}</p>
      </div>

      <div className="mt-4">
        {alerts.length === 0 ? (
          <p className="rounded-xl border border-border/70 bg-surface-muted/35 px-3 py-3 text-sm text-muted">
            {t("alerts.noAlerts")}
          </p>
        ) : (
          <div className="max-h-79 space-y-3 overflow-y-auto pe-1">
            {alerts.map((alert) => {
              const theme = SEVERITY_THEME[alert.severity];
              const SeverityIcon = theme.icon;

              return (
                <article key={alert.id} className={`rounded-xl border px-3 py-3 ${theme.shell}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-heading">{alert.title}</p>
                      <p className="mt-1 text-xs text-body">{alert.description}</p>
                    </div>

                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${theme.badge}`}>
                      <SeverityIcon className="h-3.5 w-3.5" />
                      {t(`alerts.severity.${alert.severity}`)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] text-muted">
                    <p>{t("alerts.affectedZone", { zone: alert.zone })}</p>
                    <p>{t("alerts.minutesAgo", { count: alert.minutesAgo })}</p>
                    <p className="text-body">{t("alerts.recommendation", { value: alert.recommendation })}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
