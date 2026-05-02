import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import type { HospitalRequestItem } from "@/features/requests/types/request-ui.types";
import type { RequestPriority, RequestStatus } from "@/features/requests/types/request.types";

type AnyRecord = Record<string, unknown>;

type HospitalRequestApiItem = {
  id?: number | string;
  description?: string | null;
  address?: string | null;
  requestStatus?: string | number | null;
  createdAt?: string | null;
  patientName?: string | null;
  assignedAmbulancePlate?: string | null;
};

const PAYLOAD_KEYS = ["data", "result", "items", "requests", "value"];

function buildHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function extractArrayFromPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const root = payload as AnyRecord;

  for (const key of PAYLOAD_KEYS) {
    const value = root[key];

    if (Array.isArray(value)) {
      return value as T[];
    }

    if (!value || typeof value !== "object") {
      continue;
    }

    const nested = value as AnyRecord;

    for (const nestedKey of PAYLOAD_KEYS) {
      const nestedValue = nested[nestedKey];

      if (Array.isArray(nestedValue)) {
        return nestedValue as T[];
      }
    }
  }

  return [];
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function normalizeStatus(value: unknown): RequestStatus {
  if (typeof value === "number") {
    switch (value) {
      case 1:
        return "assigned";
      case 2:
        return "enRoute";
      case 3:
        return "completed";
      case 4:
        return "cancelled";
      default:
        return "pending";
    }
  }

  const normalized = toStringValue(value).toLowerCase().replace(/[-\s]/g, "");

  if (normalized === "assigned") {
    return "assigned";
  }

  if (normalized === "enroute") {
    return "enRoute";
  }

  if (normalized === "completed") {
    return "completed";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "cancelled";
  }

  return "pending";
}

function normalizePriority(status: RequestStatus): RequestPriority {
  if (status === "cancelled") {
    return "critical";
  }

  if (status === "assigned" || status === "enRoute") {
    return "high";
  }

  if (status === "completed") {
    return "low";
  }

  return "medium";
}

function formatTimestamp(value: unknown): string {
  const raw = toStringValue(value);

  if (!raw) {
    return "-";
  }

  const createdAt = new Date(raw);

  if (Number.isNaN(createdAt.getTime())) {
    return raw;
  }

  return createdAt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export async function fetchHospitalActiveRequestsApi(
  token: string,
  hospitalId: string,
): Promise<HospitalRequestApiItem[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.ACTIVE_REQUESTS(Number(hospitalId))),
    { headers: buildHeaders(token) },
  );

  return extractArrayFromPayload<HospitalRequestApiItem>(response.data);
}

export async function fetchHospitalRequestsApi(
  token: string,
  hospitalId: string,
): Promise<HospitalRequestApiItem[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_REQUESTS(hospitalId)),
    { headers: buildHeaders(token) },
  );

  return extractArrayFromPayload<HospitalRequestApiItem>(response.data);
}

export async function fetchHospitalWeeklyStatsApi(
  token: string,
  hospitalId: string,
): Promise<Record<string, unknown> | null> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.WEEKLY_STATS(hospitalId)),
    { headers: buildHeaders(token) },
  );

  const payload = response.data;

  if (payload && typeof payload === "object") {
    return payload as Record<string, unknown>;
  }

  return null;
}

export function mapHospitalRequestItem(raw: HospitalRequestApiItem): HospitalRequestItem {
  const status = normalizeStatus(raw.requestStatus);

  return {
    id: raw.id == null ? "-" : `#${String(raw.id)}`,
    userName: toStringValue(raw.patientName) || "-",
    userPhone: toStringValue(raw.assignedAmbulancePlate) || "-",
    location: toStringValue(raw.address) || "-",
    priority: normalizePriority(status),
    status,
    timestamp: formatTimestamp(raw.createdAt),
  };
}
