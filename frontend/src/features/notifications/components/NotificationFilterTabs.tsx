import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { NotificationFilter } from "../types/notification.types";

type NotificationFilterTabsProps = {
  activeFilter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  counts: {
    all: number;
    unread: number;
    critical: number;
  };
};

const filters: NotificationFilter[] = ["all", "unread", "critical"];

export default function NotificationFilterTabs({
  activeFilter,
  onChange,
  counts,
}: NotificationFilterTabsProps) {
  const { t } = useTranslation("notifications");

  const filterMeta = useMemo(
    () => ({
      all: counts.all,
      unread: counts.unread,
      critical: counts.critical,
    }),
    [counts.all, counts.critical, counts.unread]
  );

  return (
    <div className="mt-3 grid grid-cols-3 rounded-xl bg-background/70 p-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={
              isActive
                ? "flex min-w-0 flex-col items-center justify-center rounded-lg bg-primary px-1.5 py-1.5 text-[11px] font-semibold leading-tight text-white transition-colors sm:flex-row sm:gap-1 sm:px-2 sm:text-xs"
                : "flex min-w-0 flex-col items-center justify-center rounded-lg px-1.5 py-1.5 text-[11px] leading-tight text-muted transition-colors hover:text-heading sm:flex-row sm:gap-1 sm:px-2 sm:text-xs"
            }
          >
            <span className="truncate">{t(`tabs.${filter}`)}</span>
            <span className={isActive ? "text-white/90 sm:ms-1" : "text-muted sm:ms-1"}>
              {filterMeta[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
