import { ShieldAlert } from "lucide-react";
import { useAllRequestsPage } from "../hooks/useAllRequestsPage";
import { RequestList } from "./RequestList";
import { RequestDetailsPanel } from "./RequestDetailsPanel";

export default function AllRequests() {
  const {
    t,
    requests,
    isLoading,
    selectedId,
    boardRequests,
    selectedRequest,
    criticalCount,
    failedCount,
    searchingCount,
    assignedCount,
    
    queueTone,
    systemState,
    handleReassignAmbulance,
    handleCancelAssignment,
    handleSelectRequest,
    handleViewRequestDetails,
  } = useAllRequestsPage();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/80 bg-bg-card px-4 py-3 shadow-card dark:border-border">
        <p className="text-sm font-semibold text-heading">{t("board.monitoring.title")}</p>
        <p className="mt-1 text-xs text-muted">{t("board.monitoring.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <section className="rounded-2xl border border-border/80 bg-background-second/75 p-4 shadow-card dark:border-border dark:bg-background-second/50">
          <header className="mb-3 flex items-center justify-between border-b border-border/80 pb-3 dark:border-border">
            <div>
              <h3 className="text-base font-semibold text-heading">{t("board.list.title")}</h3>
              <p className="text-xs text-muted">{t("board.list.subtitle", { count: boardRequests.length })}</p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full border border-border/80 bg-surface-muted/70 px-2.5 py-1 text-[11px] text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                {t("board.summary.critical", { count: criticalCount })}
              </span>
              <span className="rounded-full border border-border/80 bg-surface-muted/70 px-2.5 py-1 text-[11px] text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                {t("board.summary.assigned", { count: assignedCount })}
              </span>
              <span className="rounded-full border border-border/80 bg-surface-muted/70 px-2.5 py-1 text-[11px] text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                {t("board.summary.searching", { count: searchingCount })}
              </span>
              <span className="rounded-full border border-border/80 bg-surface-muted/70 px-2.5 py-1 text-[11px] text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                {t("board.summary.failed", { count: failedCount })}
              </span>
             
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-muted/70 px-3 py-1 text-xs text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                <span className={`h-2 w-2 rounded-full ${queueTone}`} />
                {t(`board.systemState.${systemState}`)}
              </div>
            </div>
          </header>

          <RequestList
            requests={boardRequests}
            selectedId={selectedId}
            isLoading={isLoading}
            onSelect={handleSelectRequest}
          />
        </section>

        <RequestDetailsPanel
          request={selectedRequest}
          onViewDetails={handleViewRequestDetails}
          onReassignAmbulance={handleReassignAmbulance}
          onCancelAssignment={handleCancelAssignment}
        />
      </div>

      {!isLoading && requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-surface-muted/65 px-4 py-6 text-center dark:border-border dark:bg-surface-muted/30">
          <ShieldAlert className="mx-auto h-7 w-7 text-body dark:text-muted" />
          <p className="mt-2 text-sm font-medium text-heading">{t("empty.title")}</p>
          <p className="mt-1 text-xs text-muted">{t("empty.description")}</p>
        </div>
      ) : null}
    </div>
  );
}