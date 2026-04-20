import type {
  ApiRequest,
  DispatchState,
  Request,
  RequestPriority,
  RequestStatus,
} from "../types/request.types";
import { REQUEST_STATUS_MAP } from "../types/request.types";
import type { AdminStreamItem } from "../data/requests.api";

type AnyRecord = Record<string, unknown>;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toPriority(priority: string): RequestPriority {
  const normalized = priority.toLowerCase();

  if (
    normalized === "low" ||
    normalized === "medium" ||
    normalized === "high" ||
    normalized === "critical"
  ) {
    return normalized;
  }

  return "medium";
}

function toAdminDispatchState(item: AdminStreamItem): DispatchState {
  const status = asString(item.status).toLowerCase();

  if (item.isSearching || status.includes("search")) {
    return "SEARCHING";
  }

  if (item.isAssigned || status.includes("assign")) {
    return "ASSIGNED";
  }

  if (
    status.includes("notdelivered") ||
    status.includes("failed") ||
    status.includes("cancel")
  ) {
    return "FAILED";
  }

  if (status.includes("arriv")) {
    return "ARRIVING";
  }

  if (status.includes("complete") || status === "delivered") {
    return "COMPLETED";
  }

  return "RECEIVED";
}

function toDispatchStatus(state: DispatchState): Request["dispatchStatus"] {
  if (state === "FAILED") {
    return "failed";
  }

  if (state === "ASSIGNED" || state === "ARRIVING" || state === "COMPLETED") {
    return "assigned";
  }

  return "searching";
}

function toRequestStatus(state: DispatchState): RequestStatus {
  if (state === "ASSIGNED") {
    return "assigned";
  }

  if (state === "ARRIVING") {
    return "enRoute";
  }

  if (state === "COMPLETED") {
    return "completed";
  }

  if (state === "FAILED") {
    return "cancelled";
  }

  return "pending";
}

function locationLatitude(location: string): number {
  const match = location.match(/latitude\s*[:=]?\s*(-?\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) || 0 : 0;
}

function locationLongitude(location: string): number {
  const match = location.match(/longitude\s*[:=]?\s*(-?\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) || 0 : 0;
}

export function mapApiRequest(raw: ApiRequest): Request {
  const statusCode = Number(raw.requestStatus ?? 0);

  const firstAssignment =
    Array.isArray(raw.assignments) && raw.assignments.length > 0
      ? (raw.assignments[0] as AnyRecord)
      : null;

  const assignedAmbulanceName = firstAssignment
    ? asString(firstAssignment.ambulanceName)
    : "";

  const dispatchEtaMinutes = firstAssignment
    ? asNumber(firstAssignment.etaMinutes)
    : null;

  const dispatchDistanceKm = firstAssignment
    ? asNumber(firstAssignment.distanceKm)
    : null;

  return {
    id: raw.id,
    userId: raw.userId,
    userName: raw.applicationUser?.name ?? "",
    userPhone: raw.applicationUser?.phoneNumber ?? "",
    address: raw.address ?? "",
    status: REQUEST_STATUS_MAP[statusCode] ?? "pending",
    timestamp: raw.createdAt,
    description: raw.description ?? "",
    latitude: raw.latitude,
    longitude: raw.longitude,
    numberOfPeopleAffected: raw.numberOfPeopleAffected,
    isSelfCase: raw.isSelfCase,
    dispatchStatus:
      statusCode === 4
        ? "failed"
        : assignedAmbulanceName
          ? "assigned"
          : "searching",
    assignedAmbulanceName: assignedAmbulanceName || null,
    dispatchEtaMinutes,
    dispatchDistanceKm,
    dispatchAlternatives: [],
    applicationUser: raw.applicationUser,
  };
}

export function mapAdminStreamItem(item: AdminStreamItem): Request {
  const createdAt =
    asString(item.createdAt) ||
    asString(item.timeline?.requestedAt) ||
    new Date().toISOString();

  const dispatchState = toAdminDispatchState(item);
  const location = asString(item.location);
  const ambulanceId =
    item.ambulanceId == null ? "" : String(item.ambulanceId).trim();
  const assignedAmbulanceName = ambulanceId ? `AMB-${ambulanceId}` : null;
  const eta = asNumber(item.eta);

  const logs: NonNullable<Request["logs"]> = [
    {
      state: "RECEIVED",
      timestamp: asString(item.timeline?.requestedAt) || createdAt,
      note: "Request received by admin stream.",
    },
  ];

  if (asString(item.timeline?.searchingAt)) {
    logs.push({
      state: "SEARCHING",
      timestamp: asString(item.timeline?.searchingAt),
      note: "Searching for available ambulances.",
    });
  }

  if (asString(item.timeline?.assignedAt)) {
    logs.push({
      state: "ASSIGNED",
      timestamp: asString(item.timeline?.assignedAt),
      note: "Ambulance assignment confirmed.",
    });
  }

  if (asString(item.timeline?.arrivedAt)) {
    logs.push({
      state: "ARRIVING",
      timestamp: asString(item.timeline?.arrivedAt),
      note: "Assigned ambulance is arriving.",
    });
  }

  if (dispatchState === "FAILED") {
    logs.push({
      state: "FAILED",
      timestamp: createdAt,
      note: "Request marked as not delivered.",
    });
  }

  return {
    id: Number(item.id) || 0,
    userId: "",
    userName: asString(item.patientName),
    userPhone: "",
    address: location,
    status: toRequestStatus(dispatchState),
    timestamp: createdAt,
    description: asString(item.description),
    latitude: locationLatitude(location),
    longitude: locationLongitude(location),
    numberOfPeopleAffected: 1,
    isSelfCase: false,
    priority: toPriority(asString(item.priority)),
    dispatchStatus: toDispatchStatus(dispatchState),
    dispatchState,
    assignedAmbulanceName,
    dispatchEtaMinutes: eta,
    dispatchDistanceKm: null,
    dispatchAlternatives: [],
    assignedAmbulance: assignedAmbulanceName
      ? {
          id: ambulanceId,
          name: assignedAmbulanceName,
          distanceKm: 0,
          etaMinutes: eta ?? 0,
        }
      : null,
    eta,
    logs,
    selectionReasons: [],
    createdAt,
    applicationUser: null,
  };
}
