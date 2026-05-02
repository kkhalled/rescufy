import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import type {
  AppNotification,
  NotificationCategory,
  NotificationLevel,
} from "../types/notification.types";

type AnyRecord = Record<string, unknown>;

type ApiNotification = {
  id?: number | string;
  title?: string | null;
  message?: string | null;
  content?: string | null;
  body?: string | null;
  level?: string | null;
  severity?: string | null;
  category?: string | null;
  type?: string | null;
  createdAt?: string | null;
  isRead?: boolean | null;
  read?: boolean | null;
};

const PAYLOAD_KEYS = ["data", "result", "items", "notifications", "value"];

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

function extractCountFromPayload(payload: unknown): number {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return 0;
  }

  const root = payload as AnyRecord;
  const candidates = [root.count, root.unreadCount, root.totalUnread, root.value];

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }

  return 0;
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

function toLevel(value: unknown): NotificationLevel {
  const normalized = toStringValue(value).toLowerCase();

  if (normalized === "critical") {
    return "critical";
  }

  if (normalized === "warning") {
    return "warning";
  }

  if (normalized === "success") {
    return "success";
  }

  return "info";
}

function toCategory(value: unknown): NotificationCategory {
  const normalized = toStringValue(value).toLowerCase();

  if (
    normalized === "request" ||
    normalized === "hospital" ||
    normalized === "ambulance" ||
    normalized === "user" ||
    normalized === "system"
  ) {
    return normalized;
  }

  return "system";
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value > 0;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
}

export function mapApiNotification(raw: ApiNotification): AppNotification {
  return {
    id: toStringValue(raw.id) || crypto.randomUUID(),
    title: toStringValue(raw.title) || "Notification",
    message:
      toStringValue(raw.message) ||
      toStringValue(raw.content) ||
      toStringValue(raw.body) ||
      "",
    level: toLevel(raw.level ?? raw.severity),
    category: toCategory(raw.category ?? raw.type),
    createdAt: toStringValue(raw.createdAt) || new Date().toISOString(),
    isRead: toBoolean(raw.isRead ?? raw.read),
  };
}

export async function fetchNotificationsApi(token: string): Promise<AppNotification[]> {
  const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_ALL), {
    headers: buildHeaders(token),
  });

  return extractArrayFromPayload<ApiNotification>(response.data).map(mapApiNotification);
}

export async function fetchUnreadCountApi(token: string): Promise<number> {
  const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT), {
    headers: buildHeaders(token),
  });

  return extractCountFromPayload(response.data);
}

export async function markNotificationReadApi(token: string, id: string): Promise<void> {
  await axios.post(
    getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
    {},
    { headers: buildHeaders(token) },
  );
}

export async function markAllNotificationsReadApi(token: string): Promise<void> {
  await axios.post(
    getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
    {},
    { headers: buildHeaders(token) },
  );
}

export async function deleteNotificationApi(token: string, id: string): Promise<void> {
  await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE(id)), {
    headers: buildHeaders(token),
  });
}