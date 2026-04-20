// requests/types.ts

export type RequestStatus = "pending" | "assigned" | "enRoute" | "completed" | "cancelled";

export type RequestPriority = "low" | "medium" | "high" | "critical";

export type DispatchStatus = "searching" | "assigned" | "failed";

export type DispatchState =
  | "RECEIVED"
  | "SEARCHING"
  | "ASSIGNED"
  | "ARRIVING"
  | "COMPLETED"
  | "FAILED";

export type DispatchLogEntry = {
  state: DispatchState;
  timestamp: string;
  note: string;
};

export type AssignedAmbulance = {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
};

export type DispatchAlternative = {
  ambulanceName: string;
  etaMinutes: number | null;
  distanceKm: number | null;
  score: number | null;
};

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
  dispatchStatus?: DispatchStatus;
  assignedAmbulanceName?: string | null;
  dispatchEtaMinutes?: number | null;
  dispatchDistanceKm?: number | null;
  dispatchReasoning?: string | null;
  dispatchAlternatives?: DispatchAlternative[];
  dispatchState?: DispatchState;
  assignedAmbulance?: AssignedAmbulance | null;
  eta?: number | null;
  logs?: DispatchLogEntry[];
  selectionReasons?: string[];
  createdAt?: string;
  applicationUser: ApiApplicationUser;
};

export type MockDispatchRequest = {
  id: number;
  severity: RequestPriority;
  createdAt: string;
  dispatchState: DispatchState;
  assignedAmbulance: AssignedAmbulance | null;
  eta: number | null;
  logs: DispatchLogEntry[];
  userName: string;
  userPhone: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  numberOfPeopleAffected: number;
  isSelfCase: boolean;
  selectionReasons: string[];
  alternatives: DispatchAlternative[];
};
