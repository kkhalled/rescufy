// ===============================
// 🔹 Request Status (Lifecycle)
// ===============================
export type RequestStatus =
  | "Pending"
  | "Assigned"
  | "Accepted"
  | "OnTheWay"
  | "Arrived"
  | "PickedUp"
  | "Delivered"
  | "Finished"
  | "Canceled";

// ===============================
// 🔹 AI Analysis
// ===============================
export interface RequestAiAnalysis {
  summary: string;
  urgency: string;
  condition: string;
  severity: string;
  confidence: number;
}

// ===============================
// 🔹 Shared Small Types
// ===============================
export interface NamedItem {
  id: string;
  name: string;
}

// ===============================
// 🔹 Patient Profile
// ===============================
export interface PatientProfile {
  bloodType: string;
  weightKg: number;
  heightCm: number;
  pregnancyStatus: boolean;
  medicalNotes: string;

  chronicDiseases: NamedItem[];
  allergies: NamedItem[];
  medications: NamedItem[];
  pastSurgeries: NamedItem[];
}

// ===============================
// 🔹 Patient
// ===============================
export interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  profile: PatientProfile | null;
}

// ===============================
// 🔹 Assignment Status
// ===============================
export type AssignmentStatus =
  | "Pending"
  | "Assigned"
  | "Accepted"
  | "OnTheWay"
  | "Arrived"
  | "PickedUp"
  | "Delivered"
  | "Finished"
  | "Canceled";

// ===============================
// 🔹 Assignment
// ===============================
export interface RequestAssignment {
  id: number;
  ambulancePlate: string;
  driverName: string;

  hospitalId: number | null;
  hospitalName: string | null;

  assignedAt: string;
  completedAt: string | null;

  distanceKm: number;
  status: AssignmentStatus;
}

// ===============================
// 🔹 Trip Report
// ===============================
export interface TripReport {
  id: number;
  medicalProcedures: string;
  admissionTime: string;
  dischargeTime: string;
}

// ===============================
// 🔹 Main Request Detail
// ===============================
export interface RequestDetail {
  id: number;
  userId: string;

  patientName: string;
  patientPhone: string;
  isSelfCase: boolean;

  description: string;

  latitude: number;
  longitude: number;
  address: string;

  numberOfPeopleAffected: number;

  requestStatus: RequestStatus;

  createdAt: string;
  updatedAt: string;

  comment: string | null;

  // 🔥 Nested Data
  patient: Patient | null;
  aiAnalysis: RequestAiAnalysis | null;
  assignments: RequestAssignment[];

  tripReport: TripReport | null;
}