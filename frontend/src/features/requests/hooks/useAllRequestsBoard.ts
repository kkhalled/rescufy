import { useEffect, useMemo, useState } from "react";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import axios from "axios";
import type { UseAllRequestsBoardParams } from "../types/request-ui.types";
import { formatWaitingTime, getWaitingMinutes } from "../utils/dispatch.helpers";

export function useAllRequestsBoard({
  requests,
  setRequests,
  fetchAdminStreamRequests,
}: UseAllRequestsBoardParams) {
  // This hook prepares a UI-friendly view of the admin requests "board".
  // Responsibilities:
  // - Keep a ticking timer to refresh derived labels (waiting time labels) without refetching data.
  // - Ensure initial stream load is executed once.
  // - Expose derived metrics (critical/failed/assigned/searching counts) and actions that
  //   mutate local state immediately (reassign/fail) to reflect admin actions optimistically.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    // Tick every 30s to update `waitingLabel` and other time-derived values shown on the board.
    const timer = window.setInterval(() => {
      setTimeTick((current) => current + 1);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (hasFetchedInitial) return;
    setHasFetchedInitial(true);
    void fetchAdminStreamRequests();
  }, [fetchAdminStreamRequests, hasFetchedInitial]);

  const queueRequests = useMemo(() => {
    return requests.map((request) => {
      const waitingMinutes = getWaitingMinutes(request.createdAt ?? "");
      return {
        ...request,
        waitingMinutes,
        waitingLabel: formatWaitingTime(request.createdAt ?? ""),
      };
    });
  }, [requests, timeTick]);

  const boardRequests = queueRequests;

  useEffect(() => {
    if (boardRequests.length === 0) {
      setSelectedId(null);
      return;
    }
    const stillExists = selectedId ? boardRequests.some((r) => r.id === selectedId) : false;
    if (!stillExists) {
      setSelectedId(boardRequests[0].id);
    }
  }, [boardRequests, selectedId]);

  const selectedRequest = useMemo(
    () => boardRequests.find((r) => r.id === selectedId) ?? null,
    [boardRequests, selectedId],
  );

  const criticalCount = useMemo(
    () => boardRequests.filter((r) => r.priority?.toLowerCase() === "critical").length,
    [boardRequests],
  );
  const failedCount = useMemo(
    () => boardRequests.filter((r) => r.status?.toLowerCase() === "failed").length,
    [boardRequests],
  );
  const searchingCount = useMemo(
    () => boardRequests.filter((r) => r.isSearching).length,
    [boardRequests],
  );
  const assignedCount = useMemo(
    () => boardRequests.filter((r) => r.isAssigned).length,
    [boardRequests],
  );

  const queueTone = failedCount > 0 ? "bg-red-500" : "bg-emerald-500";
  const systemState = failedCount > 0 ? "degraded" : searchingCount > 0 ? "searching" : "stable";

  const reassignRequest = async (requestId: number) => {
    try {
      // Send reassign command to the API (admin-only action). If successful, update local state
      // optimistically so the UI shows this request as searching again.
      const token = getAuthToken();
      if (!token) throw new Error("Token missing");

      await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.REASSIGN_REQUEST(String(requestId))),
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                // Mark as searching/unassigned locally so the board reflects the admin action.
                isSearching: true,
                isAssigned: false,
                status: "searching",
                intervention: "Force reevaluated by admin",
              }
            : r,
        ),
      );
    } catch (error) {
      console.error(`Failed to reassign request ${requestId}:`, error);
    }
  };

  const failRequest = (requestId: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "failed",
              isSearching: false,
              isAssigned: false,
              intervention: "Cancelled by admin",
            }
          : r,
      ),
    );
  };

  return {
    boardRequests,
    selectedId,
    setSelectedId,
    selectedRequest,
    criticalCount,
    failedCount,
    searchingCount,
    assignedCount,
    queueTone,
    systemState,
    reassignRequest,
    failRequest,
  };
}
