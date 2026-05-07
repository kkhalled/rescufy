import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api.config";

type AnyRecord = Record<string, unknown>;

export type HospitalFeedbackApiItem = {
  id?: number | string;
  userId?: string | null;
  userName?: string | null;
  comment?: string | null;
  hospitalId?: number | string | null;
  ambulanceId?: number | string | null;
  rating?: number | string | null;
  createdAt?: string | null;
};

export type HospitalFeedbackItem = {
  id: string;
  userName: string;
  comment: string;
  rating: number | null;
  createdAt: string;
};

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
  const keys = ["data", "result", "items", "feedbacks", "value"];

  for (const key of keys) {
    const value = root[key];
    if (Array.isArray(value)) {
      return value as T[];
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

export async function fetchHospitalFeedbackApi(
  token: string,
  hospitalId: string,
): Promise<HospitalFeedbackApiItem[]> {
  const response = await axios.get(
    getApiUrl(API_CONFIG.ENDPOINTS.FEEDBACK.GET_HOSPITAL(hospitalId)),
    { headers: buildHeaders(token) },
  );

  return extractArrayFromPayload<HospitalFeedbackApiItem>(response.data);
}

export function mapHospitalFeedbackItem(raw: HospitalFeedbackApiItem): HospitalFeedbackItem {
  const ratingValue = typeof raw.rating === "number" ? raw.rating : Number(raw.rating);

  return {
    id: raw.id == null ? "-" : String(raw.id),
    userName: toStringValue(raw.userName) || "-",
    comment: toStringValue(raw.comment) || "-",
    rating: Number.isFinite(ratingValue) ? ratingValue : null,
    createdAt: toStringValue(raw.createdAt),
  };
}
