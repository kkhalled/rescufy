export type AmbulanceStatus =
  | "AVAILABLE"
  | "IN_TRANSIT"
  | "BUSY"
  | "MAINTENANCE";

export type Ambulance = {
  id: string;
  licensePlate: string;
  hospitalId: string;
  status: AmbulanceStatus;
  latitude: number;
  longitude: number;
};

export type AmbulanceSort = "nearest" | "available" | "lastUpdated";

export type AmbulanceProximity = "all" | "near" | "mid" | "far";

export type AmbulanceConnectionState =
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "simulation";

export type AmbulanceRealtimeSeverity = "critical" | "warning" | "info" | "success";

export type AmbulanceRealtimeAlert = {
  id: string;
  ambulanceId: string;
  ambulanceLabel: string;
  severity: AmbulanceRealtimeSeverity;
  title: string;
  message: string;
  occurredAt: number;
};

export type AmbulanceControlItem = Ambulance & {
  hospitalName: string;
  distanceKm: number;
  lastUpdatedAt: number;
  updatedSecondsAgo: number;
  isRecentlyUpdated: boolean;
};

export type AmbulanceApiStatus = 0 | 1 | 2 | 3;

export type AmbulanceProfile = {
  id: number;
  name: string;
  vehicleInfo: string;
  driverPhone: string;
  ambulanceStatus: number;
  simLatitude: number;
  simLongitude: number;
  driverId: string;
  driverName: string;
  createdAt: string;
  updatedAt: string;
};

export const AMBULANCE_STATUS_TRANSLATION_KEY: Record<AmbulanceApiStatus, string> = {
  0: "available",
  1: "inTransit",
  2: "busy",
  3: "maintenance",
};
