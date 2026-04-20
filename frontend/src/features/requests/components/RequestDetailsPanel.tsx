import {
  Ban,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useRequestDetailsPanelView } from "../hooks/useRequestDetailsPanelView";
import type { RequestDetailsPanelProps } from "../types/request-ui.types";

export function RequestDetailsPanel({
  request,
  onViewDetails,
  onReassignAmbulance,
  onCancelAssignment,
}: RequestDetailsPanelProps) {
  const { t, view } = useRequestDetailsPanelView(request);

  if (!request || !view) {
    return (
      <aside className="rounded-2xl border border-border bg-bg-card p-5 shadow-card xl:sticky xl:top-4 h-fit">
        <h3 className="text-sm font-semibold text-heading">
          {t("board.details.title")}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {t("board.details.noSelection")}
        </p>
      </aside>
    );
  }

  const {
    severityBorder,
    dispatchTheme,
    description,
    etaLabel,
    selectedAmbulanceLabel,
    dispatchStateLabel,
    priorityLabel,
    userName,
    address,
    waitingLabel,
  } = view;

  return (
    <aside
      className={`h-fit rounded-2xl border bg-bg-card p-5 shadow-card xl:sticky xl:top-4 ${severityBorder}`}
    >
      <h3 className="text-sm font-semibold text-heading">
        {t("board.details.title")}
      </h3>
      <p className="mt-1 text-xs text-muted">
        {t("board.details.subtitle")}
      </p>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-border/80 bg-surface-muted/70 px-3 py-2.5 dark:border-border/60 dark:bg-surface-muted/35">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.08em] text-muted">
              {t("board.details.dispatchState")}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${dispatchTheme.badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${dispatchTheme.dot}`}
              />
              {dispatchStateLabel}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-heading">
            {waitingLabel}
          </p>
          <p className="mt-1 text-xs text-muted">{priorityLabel}</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface-muted/70 px-3 py-2.5 dark:border-border/60 dark:bg-surface-muted/35">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">
            {t("board.details.requestContext")}
          </p>
          <p className="mt-1 text-sm font-semibold text-heading">
            {userName}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-body">
            <MapPin className="h-3.5 w-3.5 text-muted" />
            <span>{address}</span>
          </p>
          <p className="mt-2 text-sm text-body line-clamp-3">{description}</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface-muted/70 px-3 py-2.5 dark:border-border/60 dark:bg-surface-muted/35">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">
            {t("board.details.selectedAmbulance")}
          </p>
          <p className="mt-1 text-sm font-semibold text-heading">
            {selectedAmbulanceLabel}
          </p>
          <p className="mt-1 text-xs text-body">{t("board.item.eta")} {etaLabel}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/80 bg-surface-muted/65 p-3 dark:border-border/70 dark:bg-surface-muted/30">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          {t("board.actions.title")}
        </p>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-heading transition hover:bg-surface-muted"
          >
            {t("actions.view")}
          </button>

          <button
            type="button"
            onClick={() => onReassignAmbulance(request.id)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            {t("board.actions.reassignAmbulance")}
          </button>

          <button
            type="button"
            onClick={() => onCancelAssignment(request.id)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:border-red-500/35 dark:bg-red-500/12 dark:text-red-300 dark:hover:bg-red-500/18"
          >
            <Ban className="h-4 w-4" />
            {t("board.actions.cancelAssignment")}
          </button>
        </div>
      </div>
    </aside>
  );
}
