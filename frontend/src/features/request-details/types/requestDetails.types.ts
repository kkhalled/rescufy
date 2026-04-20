export interface RequestAiAnalysis {
  summary: string;
  urgency: string;
  condition: string;
  confidence: number;
}

export interface RequestAssignment {
  id: number;
  ambulancePlate: string;
  driverName: string;
  hospitalId: number | null;
  hospitalName: string | null;
  assignedAt: string;
  completedAt: string | null;
  distanceKm: number;
  status: number;
}

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
  requestStatus: number;
  createdAt: string;
  updatedAt: string;
  comment: string | null;
  aiAnalysis: RequestAiAnalysis | null;
  assignments: RequestAssignment[];
  tripReport: Record<string, unknown> | null;
}
