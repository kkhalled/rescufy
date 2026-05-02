import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { onNotification, startConnection } from "@/services/signalrService";
import type {
  AppNotification,
  NotificationFilter,
} from "../types/notification.types";
import {
  deleteNotificationApi,
  fetchNotificationsApi,
  fetchUnreadCountApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../data/notifications.api";

function sortByNewest(items: AppNotification[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCountFromApi, setUnreadCountFromApi] = useState(0);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const refreshFromApi = useCallback(async (silent = false) => {
    const token = getAuthToken();

    if (!token) {
      setNotifications([]);
      setUnreadCountFromApi(0);
      return;
    }

    if (!silent) {
      setIsLoading(true);
    }

    try {
      const [items, unreadCount] = await Promise.all([
        fetchNotificationsApi(token),
        fetchUnreadCountApi(token),
      ]);

      setNotifications(sortByNewest(items));
      setUnreadCountFromApi(unreadCount);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setNotifications([]);
      setUnreadCountFromApi(0);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const guardedRefresh = async () => {
      if (cancelled) {
        return;
      }

      await refreshFromApi();
    };

    void guardedRefresh();

    const timer = window.setInterval(() => {
      void refreshFromApi(true);
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [refreshFromApi]);

  useEffect(() => {
    let unsubscribeNotification = () => {};
    let cancelled = false;

    const setupRealtime = async () => {
      try {
        await startConnection();

        if (cancelled) {
          return;
        }

        unsubscribeNotification = onNotification(() => {
          void refreshFromApi(true);
        });
      } catch (error) {
        console.error("Notifications SignalR setup failed:", error);
      }
    };

    void setupRealtime();

    return () => {
      cancelled = true;
      unsubscribeNotification();
    };
  }, [refreshFromApi]);

  const unreadCountLocal = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const unreadCount = Math.max(unreadCountFromApi, unreadCountLocal);

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

  const markAllAsRead = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    setIsMutating(true);

    try {
      await markAllNotificationsReadApi(token);

      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
      setUnreadCountFromApi(0);
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
    } finally {
      setIsMutating(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const target = notifications.find((item) => item.id === id);

    if (!target || target.isRead) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      return;
    }

    setIsMutating(true);

    try {
      await markNotificationReadApi(token, id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
      setUnreadCountFromApi((current) => Math.max(0, current - 1));
    } catch (error) {
      console.error("Mark notification as read error:", error);
    } finally {
      setIsMutating(false);
    }
  }, [notifications]);

  const dismissNotification = useCallback(async (id: string) => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    const target = notifications.find((item) => item.id === id);

    setIsMutating(true);

    try {
      await deleteNotificationApi(token, id);
      setNotifications((current) => current.filter((item) => item.id !== id));

      if (target && !target.isRead) {
        setUnreadCountFromApi((current) => Math.max(0, current - 1));
      }
    } catch (error) {
      console.error("Delete notification error:", error);
    } finally {
      setIsMutating(false);
    }
  }, [notifications]);

  const clearRead = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    const readIds = notifications.filter((item) => item.isRead).map((item) => item.id);

    if (readIds.length === 0) {
      return;
    }

    setIsMutating(true);

    try {
      await Promise.all(readIds.map((id) => deleteNotificationApi(token, id)));
      setNotifications((current) => current.filter((item) => !item.isRead));
    } catch (error) {
      console.error("Clear read notifications error:", error);
    } finally {
      setIsMutating(false);
    }
  }, [notifications]);

  return {
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
  };
}
