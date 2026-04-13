import { BellOff } from "lucide-react";
import { useTranslation } from "react-i18next";

type NotificationEmptyStateProps = {
  isCriticalView: boolean;
};

export default function NotificationEmptyState({
  isCriticalView,
}: NotificationEmptyStateProps) {
  const { t } = useTranslation("notifications");

  return (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BellOff size={20} />
      </div>
      <h4 className="text-sm font-semibold text-heading">
        {isCriticalView ? t("empty.criticalTitle") : t("empty.title")}
      </h4>
      <p className="mt-1 text-xs text-muted">{t("empty.description")}</p>
    </div>
  );
}
