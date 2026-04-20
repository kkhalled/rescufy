import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";
import { useMockDispatch } from "../hooks/useMockDispatch";
import type { DispatchState, RequestPriority } from "../types/request.types";
import { FiltersBar } from "./FiltersBar";
import { RequestList } from "./RequestList";
import { RequestDetailsPanel } from "./RequestDetailsPanel";
import type { QueueRequestItem } from "./RequestItem";
import {
  formatWaitingTime,
  getInterventionReason,
  getWaitingMinutes,
} from "../utils/dispatch.helpers";

type RequestSort = "newest" | "longestWaiting";

export default function AllRequests() {
  const { t } = useTranslation("requests");
  const navigate = useNavigate();
  const { requests, isLoading, requestIntervention, markDispatchFailed } = useMockDispatch();

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<RequestPriority | "all">("all");
  const [status, setStatus] = useState<DispatchState | "all">("all");
  const [sortBy, setSortBy] = useState<RequestSort>("newest");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const queueRequests = useMemo<QueueRequestItem[]>(() => {
    return requests.map((request) => {
      const waitingMinutes = getWaitingMinutes(request.createdAt);
      const interventionReason = getInterventionReason({
        severity: request.severity,
        dispatchState: request.dispatchState,
        assignedAmbulance: request.assignedAmbulance,
        waitingMinutes,
      });

      return {
        ...request,
        waitingMinutes,
        waitingLabel: formatWaitingTime(request.createdAt),
        interventionRequired: Boolean(interventionReason),
        interventionReason,
        dispatchAlternatives: request.alternatives,
      };
    });
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = queueRequests.filter((request) => {
      const matchesSearch =
        !q ||
        request.userName.toLowerCase().includes(q) ||
        request.address.toLowerCase().includes(q) ||
        String(request.id).includes(q) ||
        request.description.toLowerCase().includes(q);

      const matchesSeverity = severity === "all" || request.severity === severity;
      const matchesStatus = status === "all" || request.dispatchState === status;

      return matchesSearch && matchesSeverity && matchesStatus;
    });

    const sorted = [...filtered];

    if (sortBy === "longestWaiting") {
      sorted.sort((a, b) => b.waitingMinutes - a.waitingMinutes);
      return sorted;
    }

    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return dateB - dateA;
    });

    return sorted;
  }, [queueRequests, search, severity, status, sortBy]);

  useEffect(() => {
    if (filteredRequests.length === 0) {
      setSelectedId(null);
      return;
    }

    const stillExists = selectedId
      ? filteredRequests.some((request) => request.id === selectedId)
      : false;

    if (!stillExists) {
      setSelectedId(filteredRequests[0].id);
    }
  }, [filteredRequests, selectedId]);

  const selectedRequest = useMemo(() => {
    if (!selectedId) {
      return null;
    }

    return filteredRequests.find((request) => request.id === selectedId) ?? null;
  }, [filteredRequests, selectedId]);

  const criticalCount = filteredRequests.filter((request) => request.severity === "critical").length;
  const failedCount = filteredRequests.filter((request) => request.dispatchState === "FAILED").length;
  const searchingCount = filteredRequests.filter(
    (request) => request.dispatchState === "RECEIVED" || request.dispatchState === "SEARCHING",
  ).length;
  const assignedCount = filteredRequests.filter(
    (request) => request.dispatchState === "ASSIGNED" || request.dispatchState === "ARRIVING",
  ).length;
  const interventionCount = filteredRequests.filter((request) => request.interventionRequired).length;

  const queueTone = interventionCount > 0 ? "bg-red-500" : searchingCount > 0 ? "bg-amber-500" : "bg-emerald-500";
  const systemState = interventionCount > 0 ? "degraded" : searchingCount > 0 ? "searching" : "stable";

  const handleReassignAmbulance = (requestId: number) => {
    requestIntervention(requestId);
    toast.success(t("board.actions.forceReevaluationToast"));
  };

  const handleCancelAssignment = (requestId: number) => {
    markDispatchFailed(requestId);
    toast.success(t("board.actions.markAsFailedToast"));
  };

  const handleOpenRequestDetails = (requestId: number) => {
    setSelectedId(requestId);
    navigate(`/admin/request_details/${requestId}`);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/80 bg-bg-card px-4 py-3 shadow-card dark:border-border">
        <p className="text-sm font-semibold text-heading">{t("board.monitoring.title")}</p>
        <p className="mt-1 text-xs text-muted">{t("board.monitoring.subtitle")}</p>
      </div>

      <FiltersBar
        search={search}
        severity={severity}
        status={status}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onSeverityChange={setSeverity}
        onStatusChange={setStatus}
        onSortChange={setSortBy}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <section className="rounded-2xl border border-border/80 bg-background-second/75 p-4 shadow-card dark:border-border dark:bg-background-second/50">
          <header className="mb-3 flex items-center justify-between border-b border-border/80 pb-3 dark:border-border">
            <div>
              <h3 className="text-base font-semibold text-heading">{t("board.list.title")}</h3>
              <p className="text-xs text-muted">{t("board.list.subtitle", { count: filteredRequests.length })}</p>
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
              <span className="rounded-full border border-border/80 bg-surface-muted/70 px-2.5 py-1 text-[11px] text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                {t("board.summary.intervention", { count: interventionCount })}
              </span>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-muted/70 px-3 py-1 text-xs text-body dark:border-border dark:bg-surface-muted/45 dark:text-muted">
                <span className={`h-2 w-2 rounded-full ${queueTone}`} />
                {t(`board.systemState.${systemState}`)}
              </div>
            </div>
          </header>

          <RequestList
            requests={filteredRequests}
            selectedId={selectedId}
            isLoading={isLoading}
            onSelect={handleOpenRequestDetails}
          />
        </section>

        <RequestDetailsPanel
          request={selectedRequest}
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