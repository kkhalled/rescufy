import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequestItem, type QueueRequestItem } from "./RequestItem";

type RequestListProps = {
  requests: QueueRequestItem[];
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (requestId: number) => void;
};

export function RequestList({ requests, selectedId, isLoading, onSelect }: RequestListProps) {
  const { t } = useTranslation("requests");

  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-surface-muted/65 px-4 py-8 text-center dark:border-border dark:bg-surface-muted/30">
        <ShieldAlert className="mx-auto h-7 w-7 text-body dark:text-muted" />
        <p className="mt-3 text-sm font-medium text-heading">{t("board.loading")}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-surface-muted/65 px-4 py-8 text-center dark:border-border dark:bg-surface-muted/30">
        <ShieldAlert className="mx-auto h-7 w-7 text-body dark:text-muted" />
        <p className="mt-3 text-sm font-medium text-heading">{t("board.list.emptyTitle")}</p>
        <p className="mt-1 text-xs text-muted">{t("board.list.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-bg-card">
      <div className="max-h-[72vh] overflow-y-auto">
        {requests.map((request) => (
          <RequestItem
            key={request.id}
            request={request}
            isSelected={selectedId === request.id}
            onSelect={() => onSelect(request.id)}
          />
        ))}
      </div>
    </div>
  );
}
