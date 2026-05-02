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
  isLoading: boolean;
  isMutating: boolean;
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
  isLoading,
  isMutating,
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
          className="fixed inset-x-2 top-16 z-50 max-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl sm:absolute sm:top-12 sm:inset-x-auto sm:max-h-none sm:w-[24rem] sm:max-w-[92vw] sm:ltr:right-0 sm:rtl:left-0"
        >
          <div className="border-b border-border bg-linear-to-br from-primary/15 via-primary/5 to-transparent px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-heading">{t("title")}</h3>
                <p className="mt-1 text-xs text-muted">{t("subtitle")}</p>
              </div>
              <span className="shrink-0 rounded-full bg-background px-2 py-1 text-[11px] font-semibold text-primary">
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

          <div className="max-h-[calc(100vh-15rem)] space-y-2 overflow-y-auto p-3 sm:max-h-96">
            {isLoading ? (
              <div className="rounded-xl border border-dashed border-border/70 bg-background-second/50 px-4 py-8 text-center text-sm text-muted">
                {t("subtitle")}
              </div>
            ) : notifications.length === 0 ? (
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

          <div className="flex flex-col gap-2 border-t border-border bg-background-second/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-heading transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:justify-start"
              disabled={unreadCount === 0 || isMutating}
            >
              <CheckCheck size={14} />
              <span>{t("actions.markAllRead")}</span>
            </button>

            <button
              type="button"
              onClick={onClearRead}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-background hover:text-heading disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:justify-start"
              disabled={isMutating}
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
