// requests/types.ts

export type RequestStatus = "pending" | "assigned" | "enRoute" | "completed" | "cancelled";

export type RequestPriority = "low" | "medium" | "high" | "critical";

/** Maps API integer → readable status key */
export const REQUEST_STATUS_MAP: Record<number, RequestStatus> = {
  0: "pending",
  1: "assigned",
  2: "enRoute",
  3: "completed",
  4: "cancelled",
};

// ── Raw API shapes ──

export interface ApiApplicationUser {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  nationalId: string;
  bloodType: number;
  chronicDiseases: string | null;
  allergies: string | null;
  currentMedications: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  latitude: number;
  longitude: number;
  hospitalId: number | null;
}

export interface ApiRequest {
  id: number;
  userId: string;
  isSelfCase: boolean;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  numberOfPeopleAffected: number;
  requestStatus: number;
  analysisId: number | null;
  createdAt: string;
  updatedAt: string;
  applicationUser: ApiApplicationUser;
  aiAnalysis: unknown | null;
  assignments: unknown[];
  auditLogs: unknown[];
}

// ── Frontend (mapped) shape ──

export type Request = {
  id: number;
  userId: string;
  userName: string;
  userPhone: string;
  address: string;
  status: RequestStatus;
  timestamp: string;
  description: string;
  latitude: number;
  longitude: number;
  numberOfPeopleAffected: number;
  isSelfCase: boolean;
  priority?: RequestPriority;
  applicationUser: ApiApplicationUser;
};
