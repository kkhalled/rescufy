import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AssignedAmbulance,
  DispatchLogEntry,
  DispatchState,
  RequestPriority,
} from "../types/request.types";
import type {
  QueueRequestItem,
  UseAllRequestsBoardParams,
} from "../types/request-ui.types";
import {
  formatWaitingTime,
  getInterventionReason,
  getWaitingMinutes,
} from "../utils/dispatch.helpers";

export function useAllRequestsBoard({
  requests,
  setRequests,
  fetchAdminStreamRequests,
}: UseAllRequestsBoardParams) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeTick((current) => current + 1);
    }, 30_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (hasFetchedInitial) {
      return;
    }

    setHasFetchedInitial(true);
    void fetchAdminStreamRequests();
  }, [fetchAdminStreamRequests, hasFetchedInitial]);

  const queueRequests = useMemo<QueueRequestItem[]>(() => {
    return requests.map((request) => {
      const createdAt = request.createdAt ?? request.timestamp ?? new Date().toISOString();

      const requestSeverity: RequestPriority = request.priority ?? "medium";

      const dispatchState: DispatchState =
        request.dispatchState ??
        (request.dispatchStatus === "failed"
          ? "FAILED"
          : request.dispatchStatus === "assigned"
            ? "ASSIGNED"
            : "SEARCHING");

      const assignedAmbulance: AssignedAmbulance | null =
        request.assignedAmbulance ??
        (request.assignedAmbulanceName
          ? {
              id: request.assignedAmbulanceName,
              name: request.assignedAmbulanceName,
              distanceKm: request.dispatchDistanceKm ?? 0,
              etaMinutes: request.dispatchEtaMinutes ?? request.eta ?? 0,
            }
          : null);

      const logs: DispatchLogEntry[] =
        request.logs && request.logs.length > 0
          ? request.logs
          : [
              {
                state: "RECEIVED",
                timestamp: createdAt,
                note: "Request received by admin stream.",
              },
            ];

      const selectionReasons =
        request.selectionReasons && request.selectionReasons.length > 0
          ? request.selectionReasons
          : request.dispatchReasoning
            ? [request.dispatchReasoning]
            : [];

      const alternatives = request.dispatchAlternatives ?? [];
      const waitingMinutes = getWaitingMinutes(createdAt);

      const interventionReason = getInterventionReason({
        severity: requestSeverity,
        dispatchState,
        assignedAmbulance,
        waitingMinutes,
      });

      return {
        id: request.id,
        severity: requestSeverity,
        createdAt,
        dispatchState,
        assignedAmbulance,
        eta:
          request.eta ??
          request.dispatchEtaMinutes ??
          assignedAmbulance?.etaMinutes ??
          null,
        logs,
        userName: request.userName || request.applicationUser?.name || "-",
        userPhone: request.userPhone || request.applicationUser?.phoneNumber || "",
        address: request.address || "",
        description: request.description || "",
        latitude: request.latitude ?? 0,
        longitude: request.longitude ?? 0,
        numberOfPeopleAffected: request.numberOfPeopleAffected ?? 1,
        isSelfCase: request.isSelfCase ?? false,
        selectionReasons,
        alternatives,
        waitingMinutes,
        waitingLabel: formatWaitingTime(createdAt),
        interventionReason,
        dispatchAlternatives: alternatives,
      };
    });
  }, [requests, timeTick]);

  const boardRequests = queueRequests;

  useEffect(() => {
    if (boardRequests.length === 0) {
      setSelectedId(null);
      return;
    }

    const stillExists = selectedId
      ? boardRequests.some((request) => request.id === selectedId)
      : false;

    if (!stillExists) {
      setSelectedId(boardRequests[0].id);
    }
  }, [boardRequests, selectedId]);

  const selectedRequest = useMemo(() => {
    if (!selectedId) {
      return null;
    }

    return boardRequests.find((request) => request.id === selectedId) ?? null;
  }, [boardRequests, selectedId]);

  const counters = boardRequests.reduce(
    (accumulator, request) => {
      if (request.severity === "critical") {
        accumulator.criticalCount += 1;
      }

      if (request.dispatchState === "FAILED") {
        accumulator.failedCount += 1;
      }

      if (request.dispatchState === "RECEIVED" || request.dispatchState === "SEARCHING") {
        accumulator.searchingCount += 1;
      }

      if (request.dispatchState === "ASSIGNED" || request.dispatchState === "ARRIVING") {
        accumulator.assignedCount += 1;
      }

      if (request.interventionReason) {
        accumulator.interventionCount += 1;
      }

      return accumulator;
    },
    {
      criticalCount: 0,
      failedCount: 0,
      searchingCount: 0,
      assignedCount: 0,
      interventionCount: 0,
    },
  );

  const {
    criticalCount,
    failedCount,
    searchingCount,
    assignedCount,
    interventionCount,
  } = counters;

  const queueTone =
    interventionCount > 0
      ? "bg-red-500"
      : searchingCount > 0
        ? "bg-amber-500"
        : "bg-emerald-500";

  const systemState =
    interventionCount > 0
      ? "degraded"
      : searchingCount > 0
        ? "searching"
        : "stable";

  const reassignRequest = (requestId: number) => {
    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        return {
          ...request,
          dispatchState: "SEARCHING",
          assignedAmbulance: null,
          assignedAmbulanceName: null,
          eta: null,
          dispatchEtaMinutes: null,
          logs: [
            ...(request.logs ?? []),
            {
              state: "SEARCHING",
              timestamp: new Date().toISOString(),
              note: "Manual intervention triggered: re-running assignment search.",
            },
          ],
        };
      }),
    );
  };

  const failRequest = (requestId: number) => {
    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        return {
          ...request,
          dispatchState: "FAILED",
          assignedAmbulance: null,
          assignedAmbulanceName: null,
          eta: null,
          dispatchEtaMinutes: null,
          logs: [
            ...(request.logs ?? []),
            {
              state: "FAILED",
              timestamp: new Date().toISOString(),
              note: "Intervention marked this request as failed for supervisor escalation.",
            },
          ],
        };
      }),
    );
  };

  return {
    selectedId,
    setSelectedId,
    boardRequests,
    selectedRequest,
    criticalCount,
    failedCount,
    searchingCount,
    assignedCount,
    interventionCount,
    queueTone,
    systemState,
    reassignRequest,
    failRequest,
  };
}
