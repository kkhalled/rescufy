import type {
  AssignedAmbulance,
  DispatchState,
  RequestPriority,
} from "../types/request.types";

type InterventionInput = {
  severity: RequestPriority;
  dispatchState: DispatchState;
  assignedAmbulance: AssignedAmbulance | null;
  waitingMinutes: number;
};

export function getWaitingMinutes(createdAt: string | Date): number {
  const createdAtDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const createdAtMs = createdAtDate.getTime();

  if (Number.isNaN(createdAtMs)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - createdAtMs) / 60000));
}

export function formatWaitingTime(createdAt: string | Date): string {
  const waitingMinutes = getWaitingMinutes(createdAt);

  if (waitingMinutes >= 60) {
    return "> 1h";
  }

  return `${Math.max(1, waitingMinutes)} min`;
}

export function getInterventionReason({
  severity,
  dispatchState,
  assignedAmbulance,
  waitingMinutes,
}: InterventionInput): string | null {
  if (dispatchState === "FAILED") {
    return "Dispatch failed - no unit could be confirmed.";
  }

  if (severity === "critical" && !assignedAmbulance) {
    return "Critical request delayed: no ambulance assigned after 60 sec.";
  }

  if (waitingMinutes > 5 && !assignedAmbulance && dispatchState !== "COMPLETED") {
    return "No ambulance assigned after 5+ minutes.";
  }

  return null;
}
