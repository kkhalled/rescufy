import type { TFunction } from "i18next";

export function formatNotificationTime(createdAt: string, t: TFunction): string {
  const timestamp = new Date(createdAt).getTime();

  if (Number.isNaN(timestamp)) {
    return t("common:time.now");
  }

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));

  if (minutes < 1) return t("common:time.now");
  if (minutes < 60) return t("common:time.minutesAgo", { count: minutes });

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("common:time.hoursAgo", { count: hours });

  const days = Math.floor(hours / 24);
  return t("common:time.daysAgo", { count: days });
}
