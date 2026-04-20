import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DispatchState, RequestPriority } from "../types/request.types";
import SelectField from "@/shared/ui/SelectField";

type RequestSort = "newest" | "longestWaiting";

type FiltersBarProps = {
  search: string;
  severity: RequestPriority | "all";
  status: DispatchState | "all";
  sortBy: RequestSort;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: RequestPriority | "all") => void;
  onStatusChange: (value: DispatchState | "all") => void;
  onSortChange: (value: RequestSort) => void;
};

export function FiltersBar({
  search,
  severity,
  status,
  sortBy,
  onSearchChange,
  onSeverityChange,
  onStatusChange,
  onSortChange,
}: FiltersBarProps) {
  const { t } = useTranslation("requests");

  const severityOptions: Array<{ value: RequestPriority | "all"; label: string }> = [
    { value: "all", label: t("priority.all") },
    { value: "critical", label: t("priority.critical") },
    { value: "high", label: t("priority.high") },
    { value: "medium", label: t("priority.medium") },
    { value: "low", label: t("priority.low") },
  ];

  const statusOptions: Array<{ value: DispatchState | "all"; label: string }> = [
    { value: "all", label: t("board.dispatchStateFilter.all") },
    { value: "RECEIVED", label: t("board.dispatchStateFilter.RECEIVED") },
    { value: "SEARCHING", label: t("board.dispatchStateFilter.SEARCHING") },
    { value: "ASSIGNED", label: t("board.dispatchStateFilter.ASSIGNED") },
    { value: "ARRIVING", label: t("board.dispatchStateFilter.ARRIVING") },
    { value: "COMPLETED", label: t("board.dispatchStateFilter.COMPLETED") },
    { value: "FAILED", label: t("board.dispatchStateFilter.FAILED") },
  ];

  return (
    <section className="rounded-2xl border border-border/80 bg-bg-card p-4 shadow-card dark:border-border">
      <div className="mb-4 flex items-center gap-2 text-heading">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">{t("board.filters.title")}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs uppercase tracking-[0.08em] text-body dark:text-muted">
            {t("board.filters.searchLabel")}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body dark:text-muted" />
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("board.filters.searchPlaceholder")}
              className="h-11 w-full rounded-lg border border-border/80 bg-background-second/80 pl-9 pr-3 text-sm text-heading outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-background-second"
            />
          </div>
        </div>

        <div>
          <SelectField
            label={t("board.filters.severityLabel")}
            placeholder={t("board.filters.severityLabel")}
            value={severity}
            onChange={(value) => onSeverityChange(value as RequestPriority | "all")}
            options={severityOptions}
            labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-body dark:text-muted"
            triggerClassName="h-11 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <SelectField
              label={t("board.filters.statusLabel")}
              placeholder={t("board.filters.statusLabel")}
              value={status}
              onChange={(value) => onStatusChange(value as DispatchState | "all")}
              options={statusOptions}
              labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-body dark:text-muted"
              triggerClassName="h-11 rounded-lg text-sm"
            />
          </div>

          <div>
            <SelectField
              label={t("board.filters.sortLabel")}
              placeholder={t("board.filters.sortLabel")}
              value={sortBy}
              onChange={(value) => onSortChange(value as RequestSort)}
              options={[
                { value: "newest", label: t("board.filters.sortNewest") },
                { value: "longestWaiting", label: t("board.filters.sortLongest") },
              ]}
              labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-body dark:text-muted"
              triggerClassName="h-11 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
