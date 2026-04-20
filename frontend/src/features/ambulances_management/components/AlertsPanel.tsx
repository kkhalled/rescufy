import { memo, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RadioTower,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import type {
  AmbulanceConnectionState,
  AmbulanceRealtimeAlert,
  AmbulanceRealtimeSeverity,
} from "../types/ambulances.types";

type AlertsPanelProps = {
  alerts: AmbulanceRealtimeAlert[];
  heartbeatSecondsAgo: number;
  connectionState: AmbulanceConnectionState;
  nowTs: number;
  criticalCount: number;
};

type SeverityTheme = {
  icon: ComponentType<{ className?: string }>;
  textClass: string;
  borderClass: string;
  dotClass: string;
};

const SEVERITY_THEME: Record<AmbulanceRealtimeSeverity, SeverityTheme> = {
  critical: {
    icon: Wrench,
    textClass: "text-red-700 dark:text-red-300",
    borderClass: "border-red-500/35",
    dotClass: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-500/35",
    dotClass: "bg-amber-400",
  },
  info: {
    icon: Info,
    textClass: "text-cyan-700 dark:text-cyan-300",
    borderClass: "border-cyan-500/35",
    dotClass: "bg-cyan-400",
  },
  success: {
    icon: CheckCircle2,
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-500/35",
    dotClass: "bg-emerald-400",
  },
};

function getConnectionTone(state: AmbulanceConnectionState) {
  if (state === "connected") {
    return {
      dot: "bg-emerald-400",
      text: "text-emerald-700 dark:text-emerald-300",
      labelKey: "controlCenter.connection.connected",
    };
  }

  if (state === "reconnecting") {
    return {
      dot: "bg-amber-400",
      text: "text-amber-700 dark:text-amber-300",
      labelKey: "controlCenter.connection.reconnecting",
    };
  }

  if (state === "disconnected") {
    return {
      dot: "bg-red-400",
      text: "text-red-700 dark:text-red-300",
      labelKey: "controlCenter.connection.disconnected",
    };
  }

  return {
    dot: "bg-cyan-400",
    text: "text-cyan-700 dark:text-cyan-300",
    labelKey: "controlCenter.connection.simulation",
  };
}

function toStatusTranslationKey(value: string) {
  const normalized = value.trim().toUpperCase();

  if (normalized === "AVAILABLE") {
    return "available";
  }

  if (normalized === "IN_TRANSIT") {
    return "inTransit";
  }

  if (normalized === "BUSY") {
    return "busy";
  }

  if (normalized === "MAINTENANCE") {
    return "maintenance";
  }

  return null;
}

function formatAlertMessage(message: string, t: (key: string, options?: any) => string) {
  if (!message.includes("->")) {
    return message;
  }

  const [rawFrom, rawTo] = message.split("->").map((part) => part.trim());
  const fromKey = toStatusTranslationKey(rawFrom);
  const toKey = toStatusTranslationKey(rawTo);

  if (!fromKey || !toKey) {
    return message;
  }

  return t("controlCenter.alerts.statusChanged", {
    from: t(`status.${fromKey}`),
    to: t(`status.${toKey}`),
  });
}

export const AlertsPanel = memo(function AlertsPanel({
  alerts,
  heartbeatSecondsAgo,
  connectionState,
  nowTs,
  criticalCount,
}: AlertsPanelProps) {
  const { t } = useTranslation("ambulances");
  const tone = getConnectionTone(connectionState);

  return (
    <aside className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card xl:sticky xl:top-4 h-fit">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-heading">{t("controlCenter.alerts.title")}</h3>
          <p className="mt-1 text-xs text-muted">{t("controlCenter.alerts.subtitle")}</p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted">
          <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
          <span className={tone.text}>{t(tone.labelKey)}</span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.08em] text-red-700/90 dark:text-red-300/80">
            {t("controlCenter.alerts.critical")}
          </p>
          <p className="mt-1 text-lg font-semibold text-red-700 dark:text-red-200">{criticalCount}</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.08em] text-cyan-700/90 dark:text-cyan-300/80">
            {t("controlCenter.alerts.heartbeat")}
          </p>
          <p className="mt-1 text-lg font-semibold text-cyan-700 dark:text-cyan-200">
            {t("controlCenter.alerts.seconds", { value: heartbeatSecondsAgo })}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 max-h-[55vh] overflow-auto pr-1">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface-muted/40 px-3 py-4 text-center text-xs text-muted">
            {t("controlCenter.alerts.empty")}
          </div>
        ) : (
          alerts.map((alert) => {
            const theme = SEVERITY_THEME[alert.severity];
            const Icon = theme.icon;
            const secondsAgo = Math.max(0, Math.floor((nowTs - alert.occurredAt) / 1000));

            return (
              <article
                key={alert.id}
                className={`rounded-xl border ${theme.borderClass} bg-surface-muted/35 px-3 py-3`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 rounded-md p-1 ${theme.textClass} bg-bg-card border border-border/60`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`truncate text-xs font-semibold ${theme.textClass}`}>
                        {alert.title}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <span className={`h-1.5 w-1.5 rounded-full ${theme.dotClass}`} />
                        {secondsAgo}s
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-body">
                      {formatAlertMessage(alert.message, t)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {t("controlCenter.alerts.unitLabel", {
                        unit: alert.ambulanceLabel,
                      })}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-muted/35 px-3 py-2 text-xs text-body">
        <p className="flex items-center gap-1.5">
          <RadioTower className="h-3.5 w-3.5 text-info" />
          {t("controlCenter.signalReady")}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-muted">
          <ShieldAlert className="h-3.5 w-3.5 text-warning" />
          {t("controlCenter.signalHint")}
        </p>
      </div>
    </aside>
  );
});
