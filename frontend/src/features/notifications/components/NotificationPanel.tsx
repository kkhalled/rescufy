import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Eraser } from "lucide-react";
import { useTranslation } from "react-i18next";
import NotificationEmptyState from "./NotificationEmptyState";
import NotificationFilterTabs from "./NotificationFilterTabs";
import NotificationItemCard from "./NotificationItemCard";
import type {
  AppNotification,
  NotificationFilter,
} from "../types/notification.types";

type NotificationPanelProps = {
  isOpen: boolean;
  allCount: number;
  notifications: AppNotification[];
  activeFilter: NotificationFilter;
  unreadCount: number;
  criticalCount: number;
  onFilterChange: (filter: NotificationFilter) => void;
  onMarkAllAsRead: () => void;
  onClearRead: () => void;
  onToggleReadState: (id: string) => void;
  onDismiss: (id: string) => void;
};

export default function NotificationPanel({
  isOpen,
  allCount,
  notifications,
  activeFilter,
  unreadCount,
  criticalCount,
  onFilterChange,
  onMarkAllAsRead,
  onClearRead,
  onToggleReadState,
  onDismiss,
}: NotificationPanelProps) {
  const { t } = useTranslation("notifications");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="absolute top-12 rtl:left-0 ltr:right-0 z-50 w-[22.5rem] max-w-[92vw] overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl"
        >
          <div className="border-b border-border bg-linear-to-br from-primary/15 via-primary/5 to-transparent px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-heading">{t("title")}</h3>
                <p className="mt-1 text-xs text-muted">{t("subtitle")}</p>
              </div>
              <span className="rounded-full bg-background px-2 py-1 text-[11px] font-semibold text-primary">
                {t("unreadCounter", { count: unreadCount })}
              </span>
            </div>

            <NotificationFilterTabs
              activeFilter={activeFilter}
              onChange={onFilterChange}
              counts={{
                all: allCount,
                unread: unreadCount,
                critical: criticalCount,
              }}
            />
          </div>

          <div className="max-h-[24rem] space-y-2 overflow-y-auto p-3">
            {notifications.length === 0 ? (
              <NotificationEmptyState isCriticalView={activeFilter === "critical"} />
            ) : (
              notifications.map((item) => (
                <NotificationItemCard
                  key={item.id}
                  notification={item}
                  onToggleReadState={onToggleReadState}
                  onDismiss={onDismiss}
                />
              ))
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border bg-background-second/60 p-3">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-heading hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={unreadCount === 0}
            >
              <CheckCheck size={14} />
              <span>{t("actions.markAllRead")}</span>
            </button>

            <button
              type="button"
              onClick={onClearRead}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:bg-background hover:text-heading transition-colors"
            >
              <Eraser size={14} />
              <span>{t("actions.clearRead")}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
