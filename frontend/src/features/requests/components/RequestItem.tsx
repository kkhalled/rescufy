import { AlertTriangle, CheckCircle2, Loader2, MapPin, Radar } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  DispatchState,
  DispatchAlternative,
  MockDispatchRequest,
  RequestPriority,
} from "../types/request.types";

export type QueueRequestItem = MockDispatchRequest & {
  waitingMinutes: number;
  waitingLabel: string;
  interventionRequired: boolean;
  interventionReason: string | null;
  dispatchAlternatives: DispatchAlternative[];
};

type RequestItemProps = {
  request: QueueRequestItem;
  isSelected: boolean;
  onSelect: () => void;
};

const SEVERITY_THEME: Record<
  RequestPriority,
  { accent: string; badge: string; waiting: string; row: string }
> = {
  critical: {
    accent: "bg-red-500",
    badge: "border-red-300 bg-red-100 text-red-700 dark:border-red-500/45 dark:bg-red-500/18 dark:text-red-300",
    waiting: "text-red-700 dark:text-red-300",
    row: "hover:bg-red-100/80 dark:hover:bg-red-500/8",
  },
  high: {
    accent: "bg-orange-500",
    badge: "border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/18 dark:text-orange-300",
    waiting: "text-orange-700 dark:text-orange-300",
    row: "hover:bg-orange-100/80 dark:hover:bg-orange-500/8",
  },
  medium: {
    accent: "bg-amber-500",
    badge: "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/18 dark:text-amber-300",
    waiting: "text-amber-700 dark:text-amber-300",
    row: "hover:bg-amber-100/80 dark:hover:bg-amber-500/8",
  },
  low: {
    accent: "bg-cyan-500",
    badge: "border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-500/35 dark:bg-cyan-500/16 dark:text-cyan-300",
    waiting: "text-cyan-700 dark:text-cyan-300",
    row: "hover:bg-cyan-100/80 dark:hover:bg-cyan-500/8",
  },
};

const STATE_ORDER: DispatchState[] = ["RECEIVED", "SEARCHING", "ASSIGNED", "ARRIVING"];

const DISPATCH_THEME: Record<
  DispatchState,
  { badge: string; dot: string; row: string }
> = {
  RECEIVED: {
    badge: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/35 dark:bg-slate-500/12 dark:text-slate-300",
    dot: "bg-slate-500 dark:bg-slate-400",
    row: "",
  },
  SEARCHING: {
    badge: "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/12 dark:text-amber-300",
    dot: "bg-amber-500",
    row: "ring-1 ring-amber-300/80 dark:ring-amber-500/20",
  },
  ASSIGNED: {
    badge: "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
    dot: "bg-emerald-500",
    row: "",
  },
  ARRIVING: {
    badge: "border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-500/35 dark:bg-cyan-500/12 dark:text-cyan-300",
    dot: "bg-cyan-500",
    row: "",
  },
  COMPLETED: {
    badge: "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
    dot: "bg-emerald-500",
    row: "",
  },
  FAILED: {
    badge: "border-red-300 bg-red-100 text-red-700 dark:border-red-500/35 dark:bg-red-500/12 dark:text-red-300",
    dot: "bg-red-500",
    row: "ring-1 ring-red-300/80 dark:ring-red-500/25",
  },
};

function formatTimelineTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RequestItem({ request, isSelected, onSelect }: RequestItemProps) {
  const { t } = useTranslation("requests");
  const theme = SEVERITY_THEME[request.severity];
  const dispatchTheme = DISPATCH_THEME[request.dispatchState];
  const previewDescription = request.description?.trim() || t("board.item.descriptionFallback");

  const statusLabel = t(`board.dispatchStateLabels.${request.dispatchState}`);
  const etaLabel = request.eta !== null ? t("board.item.etaMinutes", { count: request.eta }) : t("board.item.etaUnknown");
  const assignedAmbulanceLabel = request.assignedAmbulance?.name || t("board.item.searchingUnits");

  const timelineMap = request.logs.reduce<Record<DispatchState, string>>((accumulator, log) => {
    accumulator[log.state] = log.timestamp;
    return accumulator;
  }, {} as Record<DispatchState, string>);

  const statusIcon =
    request.dispatchState === "SEARCHING" ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : request.dispatchState === "FAILED" ? (
      <AlertTriangle className="h-3.5 w-3.5" />
    ) : request.dispatchState === "COMPLETED" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : (
      <Radar className="h-3.5 w-3.5" />
    );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full items-start gap-4 border-b border-border/80 px-4 py-3 text-left transition dark:border-border/60 ${theme.row} ${
        isSelected ? "bg-primary/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]" : "bg-transparent"
      } ${dispatchTheme.row} ${
        request.dispatchState === "FAILED" ? "bg-red-50 dark:bg-red-500/6" : ""
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${theme.accent}`} aria-hidden />

      <div className="w-28 shrink-0 pl-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${theme.badge}`}
        >
          {t(`priority.${request.severity}`)}
        </span>
        <p className={`mt-2 text-sm font-semibold ${theme.waiting}`}>
          {request.waitingLabel}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-heading">{request.userName || "-"}</p>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${dispatchTheme.badge}`}
          >
            <span className={`inline-flex h-3.5 w-3.5 items-center justify-center ${dispatchTheme.dot} rounded-full text-white dark:text-background-second`}>
              {statusIcon}
            </span>
            {statusLabel}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-body">{previewDescription}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{request.address}</span>
          </p>
          <span className="rounded-full border border-border/80 bg-surface-muted/80 px-2 py-0.5 text-[11px] text-body dark:border-border dark:bg-surface-muted/50">
            {t("board.item.assignedAmbulance")}: {assignedAmbulanceLabel}
          </span>
          <span className="rounded-full border border-border/80 bg-surface-muted/80 px-2 py-0.5 text-[11px] text-body dark:border-border dark:bg-surface-muted/50">
            {t("board.item.eta")} {etaLabel}
          </span>
        </div>

        {request.interventionRequired ? (
          <div className="mt-2 rounded-lg border border-red-300 bg-red-50 px-2.5 py-2 text-xs text-red-700 dark:border-red-500/35 dark:bg-red-500/10 dark:text-red-300">
            <p className="font-semibold">{t("board.intervention.title")}</p>
            <p className="mt-0.5 text-red-600 dark:text-red-200">{request.interventionReason}</p>
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {STATE_ORDER.map((state) => {
            const logTimestamp = timelineMap[state];
            const reached = Boolean(logTimestamp);
            const active = request.dispatchState === state;

            return (
              <div
                key={`${request.id}-${state}`}
                className={`rounded-md border px-2 py-1.5 ${
                  reached
                    ? "border-primary/35 bg-primary/12 dark:border-primary/25 dark:bg-primary/8"
                    : "border-border/80 bg-surface-muted/60 dark:border-border/60 dark:bg-surface-muted/25"
                }`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${active ? "text-primary" : "text-muted"}`}>
                  {t(`board.timeline.${state}`)}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {logTimestamp ? formatTimelineTime(logTimestamp) : "--:--"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
