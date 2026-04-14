import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { QueueRequestItem } from "./RequestItem";

type RequestDetailsPanelProps = {
  request: QueueRequestItem | null;
  onReassignAmbulance: (requestId: number) => void;
  onCancelAssignment: (requestId: number) => void;
};

const SEVERITY_THEME: Record<
  QueueRequestItem["severity"],
  { border: string }
> = {
  critical: {
    border: "border-red-500/35",
  },
  high: {
    border: "border-orange-500/30",
  },
  medium: {
    border: "border-amber-500/25",
  },
  low: {
    border: "border-cyan-500/25",
  },
};

const DISPATCH_THEME: Record<
  QueueRequestItem["dispatchState"],
  { badge: string; dot: string }
> = {
  RECEIVED: {
    badge: "border-slate-500/35 bg-slate-500/12 text-slate-300",
    dot: "bg-slate-400",
  },
  SEARCHING: {
    badge: "border-amber-500/35 bg-amber-500/12 text-amber-300",
    dot: "bg-amber-500",
  },
  ASSIGNED: {
    badge: "border-emerald-500/35 bg-emerald-500/12 text-emerald-300",
    dot: "bg-emerald-500",
  },
  ARRIVING: {
    badge: "border-cyan-500/35 bg-cyan-500/12 text-cyan-300",
    dot: "bg-cyan-500",
  },
  COMPLETED: {
    badge: "border-emerald-500/35 bg-emerald-500/12 text-emerald-300",
    dot: "bg-emerald-500",
  },
  FAILED: {
    badge: "border-red-500/35 bg-red-500/12 text-red-300",
    dot: "bg-red-500",
  },
};

export function RequestDetailsPanel({
  request,
  onReassignAmbulance,
  onCancelAssignment,
}: RequestDetailsPanelProps) {
  const { t } = useTranslation("requests");

  if (!request) {
    return (
      <aside className="rounded-2xl border border-border bg-bg-card p-5 shadow-card xl:sticky xl:top-4 h-fit">
        <h3 className="text-sm font-semibold text-heading">{t("board.details.title")}</h3>
        <p className="mt-2 text-sm text-muted">{t("board.details.noSelection")}</p>
      </aside>
    );
  }

  const theme = SEVERITY_THEME[request.severity];
  const dispatchTheme = DISPATCH_THEME[request.dispatchState];
  const description = request.description?.trim() || t("board.item.descriptionFallback");
  const etaLabel = request.eta !== null
    ? t("board.item.etaMinutes", { count: request.eta })
    : t("board.item.etaUnknown");

  const distanceLabel = request.assignedAmbulance
    ? t("board.details.distanceKm", { value: request.assignedAmbulance.distanceKm.toFixed(1) })
    : t("board.details.notAvailable");

  const selectedAmbulanceLabel = request.assignedAmbulance?.name || t("board.item.searchingUnits");
  const dispatchStateLabel = t(`board.dispatchStateLabels.${request.dispatchState}`);
  const sortedLogs = [...request.logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <aside className={`h-fit rounded-2xl border bg-bg-card p-5 shadow-card xl:sticky xl:top-4 ${theme.border}`}>
      <h3 className="text-sm font-semibold text-heading">{t("board.details.title")}</h3>
      <p className="mt-1 text-xs text-muted">{t("board.details.subtitleRefined")}</p>

      <div className="mt-4 space-y-3">
        {request.interventionRequired ? (
          <div className="rounded-xl border border-red-500/35 bg-red-500/12 px-3 py-2.5">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-300">
              <AlertTriangle className="h-4 w-4" />
              {t("board.intervention.title")}
            </p>
            <p className="mt-1 text-xs text-red-200">{request.interventionReason}</p>
          </div>
        ) : null}

        <div className="rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("board.details.dispatchState")}</p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${dispatchTheme.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dispatchTheme.dot}`} />
              {dispatchStateLabel}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-heading">
            {request.waitingLabel}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("board.details.selectedAmbulance")}</p>
          <p className="mt-1 text-sm font-semibold text-heading">{selectedAmbulanceLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-body">
            <span className="rounded-full border border-border px-2 py-0.5">
              {t("board.item.eta")} {etaLabel}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5">
              {t("board.details.distance")}: {distanceLabel}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("board.details.reasoning")}</p>
          {request.selectionReasons.length === 0 ? (
            <p className="mt-1 text-sm text-muted">{t("board.details.reasoningFallback")}</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {request.selectionReasons.map((reason, index) => (
                <li key={`${request.id}-reason-${index}`} className="text-sm text-body">
                  • {reason}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("board.details.alternatives")}</p>
          {request.dispatchAlternatives.length === 0 ? (
            <p className="mt-1 text-sm text-muted">{t("board.details.noAlternatives")}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {request.dispatchAlternatives.map((alternative, index) => (
                <li
                  key={`${alternative.ambulanceName}-${index}`}
                  className="rounded-lg border border-border/70 bg-bg-card/60 px-2.5 py-2"
                >
                  <p className="text-sm font-medium text-heading">{alternative.ambulanceName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {t("board.details.alternativeMeta", {
                      eta:
                        alternative.etaMinutes !== null
                          ? t("board.item.etaMinutes", { count: alternative.etaMinutes })
                          : t("board.item.etaUnknown"),
                      distance:
                        alternative.distanceKm !== null
                          ? t("board.details.distanceKm", { value: alternative.distanceKm.toFixed(1) })
                          : t("board.details.notAvailable"),
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("board.details.requestContext")}</p>
          <p className="mt-1 text-sm font-semibold text-heading">{request.userName || "-"}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-body">
            <MapPin className="h-3.5 w-3.5 text-muted" />
            <span>{request.address}</span>
          </p>
          <p className="mt-1 text-sm text-body">{description}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("board.details.timelineTitle")}</p>
          <ul className="mt-2 space-y-2">
            {sortedLogs.map((log, index) => (
              <li key={`${request.id}-log-${index}`} className="rounded-lg border border-border/70 bg-bg-card/60 px-2.5 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-heading">{t(`board.timeline.${log.state}`)}</p>
                  <p className="inline-flex items-center gap-1 text-[11px] text-muted">
                    <Clock3 className="h-3.5 w-3.5" />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p className="mt-1 text-xs text-body">{log.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-surface-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{t("board.actions.titleRefined")}</p>
        <p className="mt-1 text-xs text-muted">{t("board.actions.subtitleRefined")}</p>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => onReassignAmbulance(request.id)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            {t("board.actions.forceReevaluation")}
          </button>

          <button
            type="button"
            onClick={() => onCancelAssignment(request.id)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-500/35 bg-red-500/12 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/18"
          >
            <Ban className="h-4 w-4" />
            {t("board.actions.markAsFailed")}
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border/70 bg-surface-muted/25 px-3 py-2.5 text-xs text-muted">
        <p className="inline-flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5" />
          {t("board.actions.auditNote")}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-border/70 bg-surface-muted/25 px-3 py-2.5 text-xs text-muted">
        <p className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t("board.details.systemDecisionInfoRefined")}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-border/70 bg-surface-muted/25 px-3 py-2.5 text-xs text-muted">
        <p className="inline-flex items-center gap-1.5">
          <Siren className="h-3.5 w-3.5" />
          {t("board.details.interventionHint")}
        </p>
      </div>
    </aside>
  );
}
