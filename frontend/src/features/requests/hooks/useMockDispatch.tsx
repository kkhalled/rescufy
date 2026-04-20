import { useEffect, useMemo, useState } from "react";
import {
  type AssignedAmbulance,
  type DispatchLogEntry,
  type DispatchState,
  type MockDispatchRequest,
} from "../types/request.types";
import { getWaitingMinutes } from "../utils/dispatch.helpers";

const STATE_ORDER: DispatchState[] = [
  "RECEIVED",
  "SEARCHING",
  "ASSIGNED",
  "ARRIVING",
  "COMPLETED",
];

function minutesAgoIso(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

function toNote(state: DispatchState): string {
  if (state === "RECEIVED") return "Request received by auto-dispatch.";
  if (state === "SEARCHING") return "Searching for available units.";
  if (state === "ASSIGNED") return "Best candidate ambulance assigned.";
  if (state === "ARRIVING") return "Assigned ambulance is en route.";
  if (state === "COMPLETED") return "Patient handoff completed.";
  return "Dispatch failed and requires intervention.";
}

function hasStateLog(logs: DispatchLogEntry[], state: DispatchState) {
  return logs.some((log) => log.state === state);
}

function pushLog(logs: DispatchLogEntry[], state: DispatchState, note?: string) {
  if (hasStateLog(logs, state)) {
    return logs;
  }

  return [
    ...logs,
    {
      state,
      timestamp: new Date().toISOString(),
      note: note || toNote(state),
    },
  ];
}

function pickAmbulance(request: MockDispatchRequest): AssignedAmbulance {
  const preferred = request.alternatives[0];

  if (preferred) {
    return {
      id: `AMB-${request.id}-01`,
      name: preferred.ambulanceName,
      etaMinutes: preferred.etaMinutes ?? 7,
      distanceKm: preferred.distanceKm ?? 3.5,
    };
  }

  return {
    id: `AMB-${request.id}-fallback`,
    name: "AMB-Dispatch-Unit",
    etaMinutes: 8,
    distanceKm: 4.2,
  };
}

function createMockRequests(): MockDispatchRequest[] {
  return [
    {
      id: 1201,
      severity: "critical",
      createdAt: minutesAgoIso(6),
      dispatchState: "SEARCHING",
      assignedAmbulance: null,
      eta: null,
      logs: [
        { state: "RECEIVED", timestamp: minutesAgoIso(6), note: toNote("RECEIVED") },
        { state: "SEARCHING", timestamp: minutesAgoIso(5), note: toNote("SEARCHING") },
      ],
      userName: "Khaled Mahmoud",
      userPhone: "+966501234567",
      address: "King Fahd Rd, Riyadh",
      description: "Severe chest pain with shortness of breath.",
      latitude: 24.7136,
      longitude: 46.6753,
      numberOfPeopleAffected: 1,
      isSelfCase: true,
      selectionReasons: ["Closest unit", "Available", "Best ETA"],
      alternatives: [
        { ambulanceName: "AMB-21", etaMinutes: 6, distanceKm: 3.1, score: 92 },
        { ambulanceName: "AMB-17", etaMinutes: 8, distanceKm: 4.5, score: 85 },
      ],
    },
    {
      id: 1202,
      severity: "high",
      createdAt: minutesAgoIso(12),
      dispatchState: "ASSIGNED",
      assignedAmbulance: {
        id: "AMB-14",
        name: "AMB-14",
        etaMinutes: 5,
        distanceKm: 3.4,
      },
      eta: 5,
      logs: [
        { state: "RECEIVED", timestamp: minutesAgoIso(12), note: toNote("RECEIVED") },
        { state: "SEARCHING", timestamp: minutesAgoIso(11), note: toNote("SEARCHING") },
        { state: "ASSIGNED", timestamp: minutesAgoIso(10), note: toNote("ASSIGNED") },
      ],
      userName: "Hanan Alqahtani",
      userPhone: "+966509944221",
      address: "Al Olaya District, Riyadh",
      description: "Road traffic collision with multiple injuries.",
      latitude: 24.7013,
      longitude: 46.6750,
      numberOfPeopleAffected: 3,
      isSelfCase: false,
      selectionReasons: ["Closest unit", "Advanced crew available", "Best ETA"],
      alternatives: [
        { ambulanceName: "AMB-06", etaMinutes: 7, distanceKm: 4.0, score: 83 },
        { ambulanceName: "AMB-11", etaMinutes: 9, distanceKm: 5.4, score: 77 },
      ],
    },
    {
      id: 1203,
      severity: "medium",
      createdAt: minutesAgoIso(72),
      dispatchState: "FAILED",
      assignedAmbulance: null,
      eta: null,
      logs: [
        { state: "RECEIVED", timestamp: minutesAgoIso(72), note: toNote("RECEIVED") },
        { state: "SEARCHING", timestamp: minutesAgoIso(70), note: toNote("SEARCHING") },
        { state: "FAILED", timestamp: minutesAgoIso(68), note: toNote("FAILED") },
      ],
      userName: "Mona Abdullah",
      userPhone: "+966508885441",
      address: "Al Murabba, Riyadh",
      description: "Patient collapse with unstable vitals.",
      latitude: 24.6476,
      longitude: 46.7169,
      numberOfPeopleAffected: 1,
      isSelfCase: true,
      selectionReasons: ["Closest unit", "Available", "Best ETA"],
      alternatives: [
        { ambulanceName: "AMB-09", etaMinutes: null, distanceKm: 9.5, score: 51 },
      ],
    },
    {
      id: 1204,
      severity: "low",
      createdAt: minutesAgoIso(4),
      dispatchState: "ARRIVING",
      assignedAmbulance: {
        id: "AMB-22",
        name: "AMB-22",
        etaMinutes: 2,
        distanceKm: 1.4,
      },
      eta: 2,
      logs: [
        { state: "RECEIVED", timestamp: minutesAgoIso(4), note: toNote("RECEIVED") },
        { state: "SEARCHING", timestamp: minutesAgoIso(4), note: toNote("SEARCHING") },
        { state: "ASSIGNED", timestamp: minutesAgoIso(3), note: toNote("ASSIGNED") },
        { state: "ARRIVING", timestamp: minutesAgoIso(2), note: toNote("ARRIVING") },
      ],
      userName: "Nasser Ahmed",
      userPhone: "+966507776601",
      address: "Prince Mohammed Bin Abdulaziz Rd, Riyadh",
      description: "Minor injury and dizziness after a fall.",
      latitude: 24.7110,
      longitude: 46.6827,
      numberOfPeopleAffected: 1,
      isSelfCase: true,
      selectionReasons: ["Closest unit", "Available", "Best ETA"],
      alternatives: [
        { ambulanceName: "AMB-18", etaMinutes: 4, distanceKm: 2.2, score: 79 },
      ],
    },
    {
      id: 1205,
      severity: "critical",
      createdAt: minutesAgoIso(2),
      dispatchState: "RECEIVED",
      assignedAmbulance: null,
      eta: null,
      logs: [{ state: "RECEIVED", timestamp: minutesAgoIso(2), note: toNote("RECEIVED") }],
      userName: "Aisha Suleiman",
      userPhone: "+966504442210",
      address: "Al Malaz, Riyadh",
      description: "Unconscious patient reported in a public area.",
      latitude: 24.6681,
      longitude: 46.7375,
      numberOfPeopleAffected: 1,
      isSelfCase: false,
      selectionReasons: ["Closest unit", "Available", "Best ETA"],
      alternatives: [
        { ambulanceName: "AMB-03", etaMinutes: 7, distanceKm: 3.8, score: 88 },
        { ambulanceName: "AMB-04", etaMinutes: 9, distanceKm: 5.0, score: 80 },
      ],
    },
  ];
}

function moveToNextState(request: MockDispatchRequest): MockDispatchRequest {
  if (request.dispatchState === "FAILED" || request.dispatchState === "COMPLETED") {
    return request;
  }

  if (request.dispatchState === "RECEIVED") {
    return {
      ...request,
      dispatchState: "SEARCHING",
      logs: pushLog(request.logs, "SEARCHING"),
    };
  }

  if (request.dispatchState === "SEARCHING") {
    const waitingMinutes = getWaitingMinutes(request.createdAt);

    if (request.severity === "critical" && waitingMinutes > 8) {
      return {
        ...request,
        dispatchState: "FAILED",
        assignedAmbulance: null,
        eta: null,
        logs: pushLog(request.logs, "FAILED"),
      };
    }

    const selectedAmbulance = pickAmbulance(request);

    return {
      ...request,
      dispatchState: "ASSIGNED",
      assignedAmbulance: selectedAmbulance,
      eta: selectedAmbulance.etaMinutes,
      logs: pushLog(request.logs, "ASSIGNED"),
    };
  }

  if (request.dispatchState === "ASSIGNED") {
    const nextEta = Math.max(1, (request.eta ?? 6) - 2);

    return {
      ...request,
      dispatchState: "ARRIVING",
      eta: nextEta,
      assignedAmbulance: request.assignedAmbulance
        ? {
            ...request.assignedAmbulance,
            etaMinutes: nextEta,
          }
        : null,
      logs: pushLog(request.logs, "ARRIVING"),
    };
  }

  const finalEta = Math.max(0, (request.eta ?? 2) - 2);

  return {
    ...request,
    dispatchState: finalEta === 0 ? "COMPLETED" : "ARRIVING",
    eta: finalEta,
    assignedAmbulance: request.assignedAmbulance
      ? {
          ...request.assignedAmbulance,
          etaMinutes: finalEta,
        }
      : null,
    logs:
      finalEta === 0
        ? pushLog(request.logs, "COMPLETED")
        : request.logs,
  };
}

export function useMockDispatch() {
  const [requests, setRequests] = useState<MockDispatchRequest[]>(() => createMockRequests());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 450);

    return () => {
      window.clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRequests((previous) => {
        const nextIndex = previous.findIndex(
          (request) =>
            request.dispatchState === "RECEIVED" ||
            request.dispatchState === "SEARCHING" ||
            request.dispatchState === "ASSIGNED" ||
            request.dispatchState === "ARRIVING",
        );

        if (nextIndex === -1) {
          return previous;
        }

        return previous.map((request, index) =>
          index === nextIndex ? moveToNextState(request) : request,
        );
      });
    }, 12000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const requestIntervention = (requestId: number) => {
    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        const refreshedLogs = pushLog(
          request.logs,
          "SEARCHING",
          "Manual intervention triggered: re-running assignment search.",
        );

        return {
          ...request,
          dispatchState: "SEARCHING",
          assignedAmbulance: null,
          eta: null,
          logs: refreshedLogs,
        };
      }),
    );
  };

  const markDispatchFailed = (requestId: number) => {
    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        return {
          ...request,
          dispatchState: "FAILED",
          assignedAmbulance: null,
          eta: null,
          logs: pushLog(
            request.logs,
            "FAILED",
            "Intervention marked this request as failed for supervisor escalation.",
          ),
        };
      }),
    );
  };

  const activeStates = useMemo(() => new Set(STATE_ORDER), []);

  return {
    requests,
    isLoading,
    requestIntervention,
    markDispatchFailed,
    activeStates,
  };
}
