import { MapPin } from "lucide-react";
import { useRequestItemView } from "../hooks/useRequestItemView";
import type { RequestItemProps } from "../types/request-ui.types";

export function RequestItem({
  request,
  isSelected,
  onSelect,
}: RequestItemProps) {
  const {
    t,
    theme,
    dispatchTheme,
    previewDescription,
    statusLabel,
    etaLabel,
    assignedAmbulanceLabel,
    timelineEntries,
    statusIcon,
    isFailed,
  } = useRequestItemView(request);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full items-start gap-4 border-b border-border/80 px-4 py-3 text-left transition dark:border-border/60 ${theme.row} ${
        isSelected
          ? "bg-primary/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
          : "bg-transparent"
      } ${dispatchTheme.row} ${isFailed ? "bg-red-50 dark:bg-red-500/6" : ""}`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${theme.accent}`}
        aria-hidden
      />

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
          <p className="truncate text-sm font-semibold text-heading">
            {request.userName || "-"}
          </p>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${dispatchTheme.badge}`}
          >
            <span
              className={`inline-flex h-3.5 w-3.5 items-center justify-center ${dispatchTheme.dot} rounded-full text-white dark:text-background-second`}
            >
              {statusIcon}
            </span>
            {statusLabel}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-body">
          {previewDescription}
        </p>

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

        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {timelineEntries.map((entry) => {
            return (
              <div
                key={`${request.id}-${entry.key}`}
                className={`rounded-md border px-2 py-1.5 ${
                  entry.reached
                    ? "border-primary/35 bg-primary/12 dark:border-primary/25 dark:bg-primary/8"
                    : "border-border/80 bg-surface-muted/60 dark:border-border/60 dark:bg-surface-muted/25"
                }`}
              >
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${entry.active ? "text-primary" : "text-muted"}`}
                >
                  {entry.label}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {entry.time}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
