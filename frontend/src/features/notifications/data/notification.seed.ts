import type { AppNotification } from "../types/notification.types";

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

export const notificationSeed: AppNotification[] = [
  {
    id: "notif-1",
    titleKey: "items.criticalRequest.title",
    messageKey: "items.criticalRequest.message",
    level: "critical",
    category: "request",
    createdAt: minutesAgo(2),
    isRead: false,
  },
  {
    id: "notif-2",
    titleKey: "items.newHospitalAdmin.title",
    messageKey: "items.newHospitalAdmin.message",
    level: "info",
    category: "user",
    createdAt: minutesAgo(8),
    isRead: false,
  },
  {
    id: "notif-3",
    titleKey: "items.ambulanceBackOnline.title",
    messageKey: "items.ambulanceBackOnline.message",
    level: "success",
    category: "ambulance",
    createdAt: minutesAgo(16),
    isRead: true,
  },
  {
    id: "notif-4",
    titleKey: "items.hospitalCapacityWarning.title",
    messageKey: "items.hospitalCapacityWarning.message",
    level: "warning",
    category: "hospital",
    createdAt: minutesAgo(34),
    isRead: false,
  },
  {
    id: "notif-5",
    titleKey: "items.systemMaintenance.title",
    messageKey: "items.systemMaintenance.message",
    level: "info",
    category: "system",
    createdAt: minutesAgo(95),
    isRead: true,
  },
  {
    id: "notif-6",
    titleKey: "items.requestCompleted.title",
    messageKey: "items.requestCompleted.message",
    level: "success",
    category: "request",
    createdAt: minutesAgo(140),
    isRead: false,
  },
];
