export type NotificationLevel = "critical" | "warning" | "info" | "success";

export type NotificationCategory =
  | "request"
  | "hospital"
  | "ambulance"
  | "user"
  | "system";

export type NotificationFilter = "all" | "unread" | "critical";

export interface AppNotification {
  id: string;
  titleKey?: string;
  messageKey?: string;
  title?: string;
  message?: string;
  level: NotificationLevel;
  category: NotificationCategory;
  createdAt: string;
  isRead: boolean;
}
