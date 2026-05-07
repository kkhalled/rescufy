import type {
  Ambulance,
  AmbulanceControlItem,
  AmbulanceProfile,
  AmbulanceStatus,
} from "../types/ambulances.types";

const DEFAULT_LATITUDE = 31.2454;
const DEFAULT_LONGITUDE = 30.0454;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getDistanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number): number {
  const earthRadius = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}




// Simplified direct-passthrough methods:

export function extractAmbulanceCollection(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  return [];
}

export function normalizeAmbulance(raw: any): Ambulance {
  return {
    ...raw,
    id: String(raw.id || raw.ambulanceId),
    status: raw.ambulanceStatus || raw.status || "Available",
    latitude: raw.latitude || raw.simLatitude || 0,
    longitude: raw.longitude || raw.simLongitude || 0,
    ambulanceNumber: raw.ambulanceNumber || `AMB-${raw.id || raw.ambulanceId}`
  };
}

export function normalizeAmbulanceProfile(raw: any): AmbulanceProfile {
  const data = raw?.data || raw?.result || raw;
  return {
    ...data,
    id: Number(data.id || data.ambulanceId),
    ambulanceStatus: data.ambulanceStatus || data.status || 0,
    simLatitude: data.simLatitude || data.latitude || 0,
    simLongitude: data.simLongitude || data.longitude || 0,
    isActive: data.isActive === true || data.isActive === "true"
  };
}

export function buildAmbulancePayload(
  ambulance: Ambulance,
  options?: {
    mode?: "add" | "edit";
  },
) {
  const payload: Record<string, unknown> = {
    name: ambulance.name,
    vehicleInfo: ambulance.vehicleInfo,
    driverPhone: ambulance.driverPhone,
    driverId: ambulance.driverId,
    paramedicId: ambulance.paramedicId,
    startingPrice: ambulance.startingPrice,
    ambulanceNumber: ambulance.ambulanceNumber,
    ambulancePointId: ambulance.ambulancePointId,
  };

  if (options?.mode === "edit") {
    payload.ambulanceStatus = ambulance.status;
  }

  return payload;
}

export function getApiErrorMessage(error: any): string | null {
  return error?.response?.data?.message || error?.message || null;
}

export function enrichAmbulance(ambulance: Ambulance): AmbulanceControlItem {
  return {
    ...ambulance,
    distanceKm: getDistanceKm(
      DEFAULT_LATITUDE,
      DEFAULT_LONGITUDE,
      ambulance.latitude,
      ambulance.longitude,
    ),
  };
}

export function getNextStatus(status: AmbulanceStatus): AmbulanceStatus {
  if (status === "Available") {
    return "Transiting";
  }

  if (status === "Transiting") {
    return "Busy";
  }

  if (status === "Busy") {
    return "Maintenance";
  }

  return "Available";
}
