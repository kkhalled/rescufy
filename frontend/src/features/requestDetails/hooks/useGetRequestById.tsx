import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { useLanguage } from "@/i18n/useLanguage";
import type {
  RequestDetail,
  RequestStatus,
  AssignmentStatus,
} from "../types/requestDetails.types";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

// ===============================
// 🔹 Helpers
// ===============================
type ApiRecord = Record<string, unknown>;

function toRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;
}

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

// ===============================
// 🔹 Status Guards (IMPORTANT)
// ===============================
const requestStatuses: RequestStatus[] = [
  "Pending",
  "Assigned",
  "Accepted",
  "OnTheWay",
  "Arrived",
  "PickedUp",
  "Delivered",
  "Finished",
  "Canceled",
];

const assignmentStatuses: AssignmentStatus[] = [...requestStatuses];

function parseRequestStatus(value: unknown): RequestStatus {
  if (typeof value === "string" && requestStatuses.includes(value as RequestStatus)) {
    return value as RequestStatus;
  }
  return "Pending";
}

function parseAssignmentStatus(value: unknown): AssignmentStatus {
  if (typeof value === "string" && assignmentStatuses.includes(value as AssignmentStatus)) {
    return value as AssignmentStatus;
  }
  return "Pending";
}

// ===============================
// 🔹 Normalizer
// ===============================
function normalizeRequestDetail(payload: unknown): RequestDetail | null {
  const source = toRecord(payload);
  if (!source) return null;

  const raw =
    toRecord(source.data) ??
    toRecord(source.result) ??
    toRecord(source.value) ??
    source;

  const id = toNumberValue(raw.id, NaN);
  if (!Number.isFinite(id)) return null;

  // 🔹 map helper
  const mapNamedList = (list: unknown) =>
    Array.isArray(list)
      ? list
          .map((item) => {
            const obj = toRecord(item);
            return obj
              ? {
                  id: toStringValue(obj.id),
                  name: toStringValue(obj.name, "-"),
                }
              : null;
          })
          .filter((item): item is { id: string; name: string } => item !== null)
      : [];

  // 🔹 Patient
  const rawPatient = toRecord(raw.patient);
  const patient = rawPatient
    ? {
        id: toStringValue(rawPatient.id),
        name: toStringValue(rawPatient.name, "-"),
        phoneNumber: toStringValue(rawPatient.phoneNumber, "-"),
        email: toStringValue(rawPatient.email, "-"),
        profile: (() => {
          const p = toRecord(rawPatient.profile);
          if (!p) return null;

          return {
            bloodType: toStringValue(p.bloodType, "-"),
            weightKg: toNumberValue(p.weightKg, 0),
            heightCm: toNumberValue(p.heightCm, 0),
            pregnancyStatus: Boolean(p.pregnancyStatus),
            medicalNotes: toStringValue(p.medicalNotes, "-"),
            chronicDiseases: mapNamedList(p.chronicDiseases),
            allergies: mapNamedList(p.allergies),
            medications: mapNamedList(p.medications),
            pastSurgeries: mapNamedList(p.pastSurgeries),
          };
        })(),
      }
    : null;

  // 🔹 AI
  const rawAi = toRecord(raw.aiAnalysis);
  const aiAnalysis = rawAi
    ? {
        summary: toStringValue(rawAi.summary, "-"),
        urgency: toStringValue(rawAi.urgency, "-"),
        condition: toStringValue(rawAi.condition, "-"),
        severity: toStringValue(rawAi.severity, "-"),
        confidence: toNumberValue(rawAi.confidence, 0),
      }
    : null;

  // 🔹 Assignments
  const assignments = Array.isArray(raw.assignments)
    ? raw.assignments
        .map((item) => {
          const entry = toRecord(item);
          if (!entry) return null;

          return {
            id: toNumberValue(entry.id, 0),
            ambulancePlate: toStringValue(entry.ambulancePlate, "-"),
            driverName: toStringValue(entry.driverName, "-"),
            hospitalId:
              entry.hospitalId == null
                ? null
                : toNumberValue(entry.hospitalId, 0),
            hospitalName:
              entry.hospitalName == null
                ? null
                : toStringValue(entry.hospitalName, "-"),
            assignedAt: toStringValue(entry.assignedAt, ""),
            completedAt:
              entry.completedAt == null
                ? null
                : toStringValue(entry.completedAt, ""),
            distanceKm: toNumberValue(entry.distanceKm, 0),
            status: parseAssignmentStatus(entry.status),
          };
        })
        .filter(
          (item): item is RequestDetail["assignments"][number] => item !== null
        )
    : [];

  // 🔹 Trip Report
  const rawTrip = toRecord(raw.tripReport);
  const tripReport = rawTrip
    ? {
        id: toNumberValue(rawTrip.id, 0),
        medicalProcedures: toStringValue(rawTrip.medicalProcedures, "-"),
        admissionTime: toStringValue(rawTrip.admissionTime, ""),
        dischargeTime: toStringValue(rawTrip.dischargeTime, ""),
      }
    : null;

  return {
    id,
    userId: toStringValue(raw.userId, "-"),
    patientName: toStringValue(raw.patientName, "-"),
    patientPhone: toStringValue(raw.patientPhone, "-"),
    isSelfCase: Boolean(raw.isSelfCase),
    description: toStringValue(raw.description, "-"),
    latitude: toNumberValue(raw.latitude, 0),
    longitude: toNumberValue(raw.longitude, 0),
    address: toStringValue(raw.address, "-"),
    numberOfPeopleAffected: toNumberValue(raw.numberOfPeopleAffected, 0),

    requestStatus: parseRequestStatus(raw.requestStatus),

    createdAt: toStringValue(raw.createdAt, ""),
    updatedAt: toStringValue(raw.updatedAt, ""),
    comment: raw.comment ? toStringValue(raw.comment) : null,

    patient,
    aiAnalysis,
    assignments,
    tripReport,
  };
}

// ===============================
// 🔹 Hook
// ===============================
export function useGetRequestById() {
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const fetchRequest = useCallback(
    async (id: string): Promise<RequestDetail | null> => {
      setIsLoading(true);
      const toastPosition = isRTL ? "top-left" : "top-right";

      try {
        const token = getAuthToken();

        if (!token) {
          toast.error(t("auth:signIn.tokenNotFound"), {
            position: toastPosition,
          });
          return null;
        }

        const response = await axios.get(
          getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.GET_BY_ID(id)),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = normalizeRequestDetail(response.data);

        if (!data) {
          toast.error(t("requests:fetchRequests.error"), {
            position: toastPosition,
          });
          return null;
        }

        setRequest(data);
        return data;
      } catch (error: any) {
        console.error("Fetch request details error:", error);

        if (error.response?.status === 401) {
          toast.error(t("auth:signIn.unauthorized"), {
            position: toastPosition,
          });
        } else if (error.response?.status === 404) {
          toast.error(
            t("requests:fetchRequests.notFound", "Request not found"),
            { position: toastPosition }
          );
        } else if (error.message === "Network Error") {
          toast.error(t("auth:signIn.networkError"), {
            position: toastPosition,
          });
        } else {
          toast.error(t("requests:fetchRequests.error"), {
            position: toastPosition,
          });
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isRTL, t]
  );

  return {
    request,
    isLoading,
    fetchRequest,
  };
}