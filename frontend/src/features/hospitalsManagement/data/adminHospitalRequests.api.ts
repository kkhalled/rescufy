import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import type { Request } from "@/features/requests/types/request.types";

type AnyRecord = Record<string, unknown>;

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

export async function fetchHospitalActiveRequestsApi(
  token: string,
  hospitalId: string,
): Promise<Request[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.ACTIVE_REQUESTS(Number(hospitalId))),
    { headers: buildHeaders(token) },
  );

  return extractArrayFromPayload<Request>(response.data);
}

export async function fetchHospitalRequestsApi(
  token: string,
  hospitalId: string,
): Promise<Request[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_REQUESTS(hospitalId)),
    { headers: buildHeaders(token) },
  );

  return extractArrayFromPayload<Request>(response.data);
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
    // If the response is an array, take the first object
    if (Array.isArray(payload)) {
      return (payload[0] as Record<string, unknown>) || null;
    }

    const p = payload as Record<string, unknown>;

    // If there's a nested array under common keys, take its first element
    for (const key of ["data", "result", "items", "value"]) {
      if (Array.isArray(p[key])) {
        return (p[key] as Record<string, unknown>[])[0] || null;
      }
    }

    // If there's a nested object under common keys, use it
    for (const key of ["data", "result", "value"]) {
      if (p[key] && typeof p[key] === "object" && !Array.isArray(p[key])) {
        return p[key] as Record<string, unknown>;
      }
    }

    // Otherwise, return the payload as-is
    return p;
  }

  return null;
}
