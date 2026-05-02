import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import type { HospitalRequestItem } from "@/features/requests/types/request-ui.types";
import type { RequestPriority, RequestStatus } from "@/features/requests/types/request.types";

type AnyRecord = Record<string, unknown>;

type HospitalActiveRequestApiItem = {
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

  const language =
    typeof document !== "undefined" && document.documentElement.lang
      ? document.documentElement.lang
      : typeof navigator !== "undefined"
        ? navigator.language
        : "en";

  const elapsedMinutes = Math.max(0, Math.round((Date.now() - createdAt.getTime()) / 60000));

  if (elapsedMinutes < 1) {
    return language.startsWith("ar") ? "الآن" : "Just now";
  }

  if (elapsedMinutes < 60) {
    return new Intl.RelativeTimeFormat(language, { numeric: "auto" }).format(-elapsedMinutes, "minute");
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return new Intl.RelativeTimeFormat(language, { numeric: "auto" }).format(-elapsedHours, "hour");
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(createdAt);
}

export async function fetchHospitalActiveRequestsApi(
  token: string,
  hospitalId: number,
): Promise<HospitalActiveRequestApiItem[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.ACTIVE_REQUESTS(hospitalId)),
    {
      headers: buildHeaders(token),
    },
  );

  return extractArrayFromPayload<HospitalActiveRequestApiItem>(response.data);
}

export function mapHospitalActiveRequestItem(
  raw: HospitalActiveRequestApiItem,
): HospitalRequestItem {
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