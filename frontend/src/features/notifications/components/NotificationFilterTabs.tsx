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
                ? "rounded-lg bg-primary text-white px-2 py-1.5 text-xs font-semibold transition-colors"
                : "rounded-lg text-xs text-muted hover:text-heading px-2 py-1.5 transition-colors"
            }
          >
            <span>{t(`tabs.${filter}`)}</span>
            <span className={isActive ? "ms-1 text-white/90" : "ms-1 text-muted"}>
              {filterMeta[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
