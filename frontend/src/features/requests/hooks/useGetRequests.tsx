import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type {
  ApiRequest,
  DispatchAlternative,
  DispatchStatus,
  Request,
} from "../types/request.types";
import { REQUEST_STATUS_MAP } from "../types/request.types";
import { useLanguage } from "@/i18n/useLanguage";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

/** Query-parameter filters matching GET /api/Request */
export interface RequestFilters {
  UserId?: string;
  RequestStatus?: number | "";
  IsSelfCase?: boolean | "";
  StartDate?: string;
  EndDate?: string;
}

type ApiRecord = Record<string, unknown>;

type DispatchCandidate = {
  ambulanceName: string | null;
  etaMinutes: number | null;
  distanceKm: number | null;
  score: number | null;
  notes: string | null;
  status: number | null;
  isPrimary: boolean;
};

function asRecord(value: unknown): ApiRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiRecord;
}

function toNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : null;
  }

  return null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}

function pickFirstString(record: ApiRecord | null, keys: string[]): string | null {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = toNonEmptyString(record[key]);

    if (value) {
      return value;
    }
  }

  return null;
}

function pickFirstNumber(record: ApiRecord | null, keys: string[]): number | null {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = toFiniteNumber(record[key]);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

function extractReasoning(aiAnalysis: unknown): string | null {
  const record = asRecord(aiAnalysis);

  return pickFirstString(record, [
    "summary",
    "reasoning",
    "selectionReason",
    "whySelected",
    "notes",
    "explanation",
  ]);
}

function parseDispatchCandidate(value: unknown): DispatchCandidate | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const ambulanceRecord = asRecord(record.ambulance);

  const ambulanceName =
    pickFirstString(record, ["ambulanceName", "assignedAmbulance", "vehicle"]) ??
    pickFirstString(ambulanceRecord, ["name", "vehicleInfo"]);

  const etaMinutes = pickFirstNumber(record, ["etaMinutes", "estimatedArrivalMinutes", "eta"]);
  const distanceKm = pickFirstNumber(record, ["distanceKm", "ambulanceDistanceKm", "hospitalDistanceKm"]);
  const score = pickFirstNumber(record, ["assignmentScore", "score", "rankScore"]);
  const notes = pickFirstString(record, ["notes", "reasoning", "selectionReason", "whySelected"]);
  const status = pickFirstNumber(record, ["status", "assignmentStatus"]);

  const isPrimary = toBoolean(record.isPrimary) || toBoolean(record.isSelected) || toBoolean(record.selected);

  if (!ambulanceName && etaMinutes === null && distanceKm === null && !notes) {
    return null;
  }

  return {
    ambulanceName,
    etaMinutes,
    distanceKm,
    score,
    notes,
    status,
    isPrimary,
  };
}

function parseDispatchCandidates(assignments: unknown): DispatchCandidate[] {
  if (!Array.isArray(assignments)) {
    return [];
  }

  return assignments
    .map(parseDispatchCandidate)
    .filter((candidate): candidate is DispatchCandidate => candidate !== null);
}

function pickSelectedCandidate(candidates: DispatchCandidate[]): DispatchCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  const preferred = candidates.find((candidate) => candidate.isPrimary && candidate.ambulanceName);

  if (preferred) {
    return preferred;
  }

  const activeCandidate = candidates.find(
    (candidate) =>
      candidate.ambulanceName &&
      candidate.status !== 3 &&
      candidate.status !== 4,
  );

  if (activeCandidate) {
    return activeCandidate;
  }

  const firstNamed = candidates.find((candidate) => candidate.ambulanceName);

  return firstNamed ?? candidates[0];
}

function toDispatchAlternatives(
  candidates: DispatchCandidate[],
  selected: DispatchCandidate | null,
): DispatchAlternative[] {
  return candidates
    .filter((candidate) => candidate !== selected)
    .map((candidate) => {
      if (!candidate.ambulanceName) {
        return null;
      }

      return {
        ambulanceName: candidate.ambulanceName,
        etaMinutes: candidate.etaMinutes,
        distanceKm: candidate.distanceKm,
        score: candidate.score,
      };
    })
    .filter((candidate): candidate is DispatchAlternative => candidate !== null);
}

function deriveDispatchStatus(
  normalizedStatus: number,
  selected: DispatchCandidate | null,
): DispatchStatus {
  if (selected?.ambulanceName) {
    return "assigned";
  }

  if (normalizedStatus === 4) {
    return "failed";
  }

  if (normalizedStatus === 1 || normalizedStatus === 2 || normalizedStatus === 3) {
    return "assigned";
  }

  return "searching";
}

function extractApiRequests(payload: unknown): ApiRequest[] {
  if (Array.isArray(payload)) {
    return payload as ApiRequest[];
  }

  const record = asRecord(payload);

  if (!record) {
    return [];
  }

  const candidateKeys = ["requests", "items", "data", "result", "value"];

  for (const key of candidateKeys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value as ApiRequest[];
    }

    const nestedRecord = asRecord(value);

    if (!nestedRecord) {
      continue;
    }

    for (const nestedKey of candidateKeys) {
      const nestedValue = nestedRecord[nestedKey];

      if (Array.isArray(nestedValue)) {
        return nestedValue as ApiRequest[];
      }
    }
  }

  return [];
}

/** Map a single raw API request to the frontend shape */
function mapApiRequest(raw: ApiRequest): Request {
  const normalizedStatus =
    typeof raw.requestStatus === "number" ? raw.requestStatus : Number(raw.requestStatus ?? 0);

  const dispatchCandidates = parseDispatchCandidates(raw.assignments);
  const selectedCandidate = pickSelectedCandidate(dispatchCandidates);
  const dispatchAlternatives = toDispatchAlternatives(dispatchCandidates, selectedCandidate);
  const aiReasoning = extractReasoning(raw.aiAnalysis);
  const dispatchStatus = deriveDispatchStatus(normalizedStatus, selectedCandidate);

  return {
    id: raw.id,
    userId: raw.userId,
    userName: raw.applicationUser?.name ?? "",
    userPhone: raw.applicationUser?.phoneNumber ?? "",
    address: raw.address ?? "",
    status: REQUEST_STATUS_MAP[normalizedStatus] ?? "pending",
    timestamp: raw.createdAt,
    description: raw.description ?? "",
    latitude: raw.latitude,
    longitude: raw.longitude,
    numberOfPeopleAffected: raw.numberOfPeopleAffected,
    isSelfCase: raw.isSelfCase,
    dispatchStatus,
    assignedAmbulanceName: selectedCandidate?.ambulanceName ?? null,
    dispatchEtaMinutes: selectedCandidate?.etaMinutes ?? null,
    dispatchDistanceKm: selectedCandidate?.distanceKm ?? null,
    dispatchReasoning: aiReasoning ?? selectedCandidate?.notes ?? null,
    dispatchAlternatives,
    applicationUser: raw.applicationUser,
  };
}

/**
 * Hook for fetching requests from the API with optional filters
 */
export function useGetRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const fetchRequests = async (filters?: RequestFilters): Promise<Request[]> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = getAuthToken();

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return [];
      }

      // Build query params – skip empty/undefined values
      const params: Record<string, string> = {};
      if (filters?.UserId) params.UserId = filters.UserId;
      if (filters?.RequestStatus !== undefined && filters.RequestStatus !== "")
        params.RequestStatus = String(filters.RequestStatus);
      if (filters?.IsSelfCase !== undefined && filters.IsSelfCase !== "")
        params.IsSelfCase = String(filters.IsSelfCase);
      if (filters?.StartDate) params.StartDate = filters.StartDate;
      if (filters?.EndDate) params.EndDate = filters.EndDate;

      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.GET_ALL),
        {
          params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const fetchedRequests: Request[] = extractApiRequests(response.data).map(mapApiRequest);

      setRequests(fetchedRequests);
      return fetchedRequests;
    } catch (error: any) {
      console.error("Fetch requests error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      } else {
        toast.error(t("requests:fetchRequests.error"), {
          position: toastPosition,
        });
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requests,
    isLoading,
    fetchRequests,
    setRequests,
  };
}
