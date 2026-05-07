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
  hospitalId: number,
): Promise<Request[]> {
  const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.ACTIVE_REQUESTS(hospitalId)), {
    headers: buildHeaders(token),
  });

  return extractArrayFromPayload<Request>(response.data);
}