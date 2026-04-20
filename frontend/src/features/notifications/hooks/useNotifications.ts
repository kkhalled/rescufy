import { useCallback, useEffect, useMemo, useState } from "react";
import { notificationSeed } from "../data/notification.seed";
import type {
  AppNotification,
  NotificationFilter,
} from "../types/notification.types";

const STORAGE_KEY = "rescufy_notifications";

function sortByNewest(items: AppNotification[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function getInitialNotifications(): AppNotification[] {
  if (typeof window === "undefined") {
    return sortByNewest(notificationSeed);
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return sortByNewest(notificationSeed);

    const parsed = JSON.parse(saved) as AppNotification[];
    if (!Array.isArray(parsed)) return sortByNewest(notificationSeed);

    return sortByNewest(parsed);
  } catch {
    return sortByNewest(notificationSeed);
  }
}

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(getInitialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const criticalCount = useMemo(
    () => notifications.filter((item) => item.level === "critical").length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }

    if (activeFilter === "critical") {
      return notifications.filter((item) => item.level === "critical");
    }

    return notifications;
  }, [activeFilter, notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true }))
    );
  }, []);

  const toggleReadState = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearRead = useCallback(() => {
    setNotifications((current) => current.filter((item) => !item.isRead));
  }, []);

  return {
    activeFilter,
    setActiveFilter,
    notifications,
    filteredNotifications,
    unreadCount,
    criticalCount,
    markAllAsRead,
    toggleReadState,
    dismissNotification,
    clearRead,
  };
}
