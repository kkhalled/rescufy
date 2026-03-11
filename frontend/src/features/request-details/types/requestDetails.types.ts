/* ═══════ GET /api/Request/{id} response types ═══════ */

export interface ChronicDisease {
  id: string;
  profileId: number;
  name: string;
  severity: string;
  diagnosedYear: number;
  isActive: boolean;
}

export interface Allergy {
  id: string;
  profileId: number;
  name: string;
  severity: string;
  notes: string;
}

export interface Medication {
  id: string;
  profileId: number;
  name: string;
  dosage: string;
  frequency: string;
}

export interface PastSurgery {
  id: string;
  profileId: number;
  name: string;
  year: number;
  notes: string;
}

export interface UserProfile {
  id: number;
  userId: string;
  bloodType: string;
  weightKg: number;
  heightCm: number;
  pregnancyStatus: boolean;
  medicalNotes: string;
  createdAt: string;
  updatedAt: string;
  chronicDiseases: ChronicDisease[];
  allergies: Allergy[];
  medications: Medication[];
  pastSurgeries: PastSurgery[];
}

export interface ApplicationUser {
  id: string;
  userName: string;
  normalizedUserName?: string;
  name: string;
  email: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed?: boolean;
  profileImageUrl: string | null;
  isBanned: boolean;
  emailVerificationCode?: string | null;
  userProfile: UserProfile | null;
  requests?: unknown[];
  notifications?: unknown[];
  assignedAssignments?: unknown[];
  auditLogs?: unknown[];
}

export interface AiAnalysis {
  id: number;
  requestId: number;
  summary: string;
  emergencyType: number;
  urgency: string;
  confidence: number;
  createdAt: string;
}

export interface AmbulanceDriver {
  id: string;
  name: string;
  userName: string;
  email: string;
  profileImageUrl: string | null;
  phoneNumber: string | null;
}

export interface Ambulance {
  id: number;
  name: string;
  vehicleInfo: string;
  driverPhone: string;
  ambulanceStatus: number;
  simLatitude: number;
  simLongitude: number;
  driverId: string;
  driver?: AmbulanceDriver | null;
  createdAt: string;
  updatedAt: string;
  assignments?: unknown[];
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  availableBeds: number;
  bedCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: number;
  requestId: number;
  ambulanceId: number;
  hospitalId: number | null;
  assignedBy: string;
  assignedAt: string;
  etaMinutes: number | null;
  completedAt: string | null;
  autoAssigned: boolean;
  distanceKm: number;
  hospitalDistanceKm: number;
  assignmentScore: number;
  reassignmentCount: number;
  notes: string;
  status: number;
  request?: unknown | null;
  ambulance: Ambulance;
  hospital: Hospital | null;
  applicationUser?: ApplicationUser | null;
}

export interface AuditLog {
  id: number;
  requestId: number;
  actorId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface RequestDetail {
  id: number;
  userId: string;
  isSelfCase: boolean;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  requestStatus: number;
  analysisId: number | null;
  createdAt: string;
  updatedAt: string;
  applicationUser: ApplicationUser;
  aiAnalysis: AiAnalysis | null;
  assignments: Assignment[];
  auditLogs: AuditLog[];
}
