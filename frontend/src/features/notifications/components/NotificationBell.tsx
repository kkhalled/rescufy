import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import NotificationPanel from "./NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationBell() {
  const { t } = useTranslation(["common", "notifications"]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    activeFilter,
    setActiveFilter,
    notifications,
    filteredNotifications,
    unreadCount,
    criticalCount,
    isLoading,
    isMutating,
    markAllAsRead,
    markAsRead,
    dismissNotification,
    clearRead,
  } = useNotifications();

  const hasUnread = unreadCount > 0;

  const displayUnreadCount = useMemo(() => {
    if (unreadCount > 99) return "99+";
    return String(unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = () => {
    if (!hasUnread) return;
    void markAllAsRead();
    toast.success(t("notifications:toasts.markedAllRead"));
  };

  const handleClearRead = () => {
    void clearRead();
    toast.success(t("notifications:toasts.clearedRead"));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={
          isOpen
            ? "relative rounded-xl bg-primary/10 p-2 text-primary transition-colors"
            : "relative rounded-xl p-2 text-heading hover:bg-muted transition-colors"
        }
        aria-label={t("common:aria.notifications")}
        aria-expanded={isOpen}
      >
        <Bell size={18} />

        {hasUnread && (
          <>
            <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {displayUnreadCount}
            </span>
            <span className="absolute top-1 right-1 rtl:right-auto rtl:left-1 h-2 w-2 rounded-full bg-danger animate-ping" />
          </>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        allCount={notifications.length}
        notifications={filteredNotifications}
        activeFilter={activeFilter}
        unreadCount={unreadCount}
        criticalCount={criticalCount}
        onFilterChange={setActiveFilter}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearRead={handleClearRead}
        onToggleReadState={(id) => {
          void markAsRead(id);
        }}
        onDismiss={(id) => {
          void dismissNotification(id);
        }}
        isLoading={isLoading}
        isMutating={isMutating}
      />
    </div>
  );
}
