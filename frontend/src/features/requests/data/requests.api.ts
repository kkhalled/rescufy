import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import type { ApiRequest } from "../types/request.types";

export type AdminStreamTimeline = {
  requestedAt?: string | null;
  searchingAt?: string | null;
  assignedAt?: string | null;
  arrivedAt?: string | null;
};

export type AdminStreamItem = {
  id: number;
  patientName?: string | null;
  description?: string | null;
  priority?: string | null;
  location?: string | null;
  createdAt?: string | null;
  status?: string | null;
  ambulanceId?: string | number | null;
  eta?: number | null;
  timeline?: AdminStreamTimeline | null;
  isSearching?: boolean;
  isAssigned?: boolean;
};

type AnyRecord = Record<string, unknown>;

const PAYLOAD_KEYS = ["data", "result", "items", "requests", "value"];

function extractMessageFromPayload(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  const root = payload as AnyRecord;

  if (typeof root.message === "string") {
    return root.message;
  }

  for (const key of PAYLOAD_KEYS) {
    const value = root[key];

    if (!value || typeof value !== "object") {
      continue;
    }

    const nested = value as AnyRecord;

    if (typeof nested.message === "string") {
      return nested.message;
    }
  }

  return "";
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

function buildHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchRequestsApi(token: string): Promise<ApiRequest[]> {
  const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.GET_ALL), {
    headers: buildHeaders(token),
  });

  return extractArrayFromPayload<ApiRequest>(response.data);
}

export async function fetchAdminStreamApi(token: string): Promise<AdminStreamItem[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.GET_ADMIN_STREAM),
    {
      headers: buildHeaders(token),
    },
  );

  return extractArrayFromPayload<AdminStreamItem>(response.data);
}

export async function cancelRequestApi(
  token: string,
  requestId: number,
): Promise<string> {
  const endpoint = API_CONFIG.ENDPOINTS.REQUESTS.CANCEL_REQUEST(
    String(requestId),
  );

  try {
    const response = await axios.put(getApiUrl(endpoint), {}, {
      headers: buildHeaders(token),
    });

    return extractMessageFromPayload(response.data);
  } catch (error: any) {
    if (error?.response?.status !== 405) {
      throw error;
    }

    const fallbackResponse = await axios.post(getApiUrl(endpoint), {}, {
      headers: buildHeaders(token),
    });

    return extractMessageFromPayload(fallbackResponse.data);
  }
}
