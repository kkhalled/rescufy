import {
  Ambulance,
  Building2,
  CircleCheck,
  CircleX,
  Info,
  MailCheck,
  MailOpen,
  PhoneCall,
  Settings2,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AppNotification } from "../types/notification.types";
import { formatNotificationTime } from "../utils/formatNotificationTime";

type NotificationItemCardProps = {
  notification: AppNotification;
  onToggleReadState: (id: string) => void;
  onDismiss: (id: string) => void;
};

const levelStyles: Record<AppNotification["level"], string> = {
  critical: "bg-danger/10 text-danger border-danger/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  info: "bg-info/10 text-info border-info/30",
  success: "bg-success/10 text-success border-success/30",
};

const dotStyles: Record<AppNotification["level"], string> = {
  critical: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
  success: "bg-success",
};

const levelIcons = {
  critical: TriangleAlert,
  warning: Info,
  info: Info,
  success: CircleCheck,
};

const categoryIcons = {
  request: PhoneCall,
  hospital: Building2,
  ambulance: Ambulance,
  user: UserRound,
  system: Settings2,
};

export default function NotificationItemCard({
  notification,
  onToggleReadState,
  onDismiss,
}: NotificationItemCardProps) {
  const { t } = useTranslation(["notifications", "common"]);

  const LevelIcon = levelIcons[notification.level];
  const CategoryIcon = categoryIcons[notification.category];

  return (
    <article
      className={
        notification.isRead
          ? "group rounded-xl border border-border/70 bg-background-second/40 p-3 transition-colors"
          : "group rounded-xl border border-primary/35 bg-primary/5 p-3 transition-colors"
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className={`mt-0.5 rounded-lg border p-1.5 ${levelStyles[notification.level]}`}>
            <LevelIcon size={14} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-heading">
              {t(`notifications:${notification.titleKey}`)}
            </h4>
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted">
              {t(`notifications:${notification.messageKey}`)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
              <CategoryIcon size={12} />
              <span>{t(`notifications:categories.${notification.category}`)}</span>
              <span>•</span>
              <span>{formatNotificationTime(notification.createdAt, t)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleReadState(notification.id)}
            className="rounded-md p-1.5 text-muted hover:bg-background hover:text-heading transition-colors"
            aria-label={
              notification.isRead
                ? t("notifications:actions.markUnread")
                : t("notifications:actions.markRead")
            }
            title={
              notification.isRead
                ? t("notifications:actions.markUnread")
                : t("notifications:actions.markRead")
            }
          >
            {notification.isRead ? <MailOpen size={14} /> : <MailCheck size={14} />}
          </button>

          <button
            type="button"
            onClick={() => onDismiss(notification.id)}
            className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition-colors"
            aria-label={t("notifications:actions.dismiss")}
            title={t("notifications:actions.dismiss")}
          >
            <CircleX size={14} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span
          className={
            notification.isRead
              ? "inline-flex items-center gap-1 text-[11px] text-muted"
              : "inline-flex items-center gap-1 text-[11px] font-medium text-primary"
          }
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[notification.level]}`} />
          {notification.isRead
            ? t("notifications:status.read")
            : t("notifications:status.unread")}
        </span>
      </div>
    </article>
  );
}
