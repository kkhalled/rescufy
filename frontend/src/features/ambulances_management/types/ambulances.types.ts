export type AmbulanceStatus =
  | "AVAILABLE"
  | "IN_TRANSIT"
  | "BUSY"
  | "MAINTENANCE";

export type Ambulance = {
  id: string;
  name: string;
  ambulanceNumber: string;
  vehicleInfo: string;
  driverPhone: string;
  driverId: string | null;
  driverName: string | null;
  startingPrice: number;
  ambulancePointId: number | null;
  licensePlate: string;
  hospitalId: string;
  status: AmbulanceStatus;
  latitude: number;
  longitude: number;
};

export type AmbulanceControlItem = Ambulance & {
  distanceKm: number;
};

export type AmbulanceApiStatus = 0 | 1 | 2 | 3;

export type AmbulanceProfile = {
  id: number;
  name: string;
  vehicleInfo: string;
  driverPhone: string | null;
  ambulanceStatus: AmbulanceApiStatus;
  simLatitude: number;
  simLongitude: number;
  driverId: string | null;
  driverName: string | null;
  startingPrice: number;
  ambulanceNumber: string;
  ambulancePointId: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export const AMBULANCE_STATUS_TRANSLATION_KEY: Record<AmbulanceApiStatus, string> = {
  0: "available",
  1: "inTransit",
  2: "busy",
  3: "maintenance",
};
