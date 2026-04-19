import axios from "axios";
import type {
  AmbulanceApiStatus,
  Ambulance,
  AmbulanceControlItem,
  AmbulanceProfile,
  AmbulanceStatus,
} from "../types/ambulances.types";

type ApiRecord = Record<string, unknown>;

const COMMAND_CENTER_COORDINATES = {
  latitude: 31.2454,
  longitude: 30.0454,
};

function toRecord(value: unknown): ApiRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiRecord;
}

function unwrapObject(value: unknown): ApiRecord | null {
  const record = toRecord(value);

  if (!record) {
    return null;
  }

  return toRecord(record.data) ?? toRecord(record.result) ?? toRecord(record.value) ?? record;
}

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

function toNullableString(value: unknown): string | null {
  const normalized = toStringValue(value, "");
  return normalized ? normalized : null;
}

function toNumberValue(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toNullableNumber(value: unknown): number | null {
  const parsed = toNumberValue(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function toUiStatus(value: unknown): AmbulanceStatus {
  const numericValue = toNumberValue(value, Number.NaN);

  if (Number.isFinite(numericValue)) {
    if (numericValue === 1) {
      return "IN_TRANSIT";
    }

    if (numericValue === 2) {
      return "BUSY";
    }

    if (numericValue === 3) {
      return "MAINTENANCE";
    }

    return "AVAILABLE";
  }

  const normalized = toStringValue(value, "").toUpperCase().replace(/\s+/g, "_");

  if (normalized === "IN_TRANSIT" || normalized === "INTRANSIT") {
    return "IN_TRANSIT";
  }

  if (normalized === "BUSY") {
    return "BUSY";
  }

  if (normalized === "MAINTENANCE") {
    return "MAINTENANCE";
  }

  return "AVAILABLE";
}

function toApiStatus(status: AmbulanceStatus): number {
  if (status === "IN_TRANSIT") {
    return 1;
  }

  if (status === "BUSY") {
    return 2;
  }

  if (status === "MAINTENANCE") {
    return 3;
  }

  return 0;
}

function toProfileStatus(value: unknown): AmbulanceApiStatus {
  const uiStatus = toUiStatus(value);

  if (uiStatus === "IN_TRANSIT") {
    return 1;
  }

  if (uiStatus === "BUSY") {
    return 2;
  }

  if (uiStatus === "MAINTENANCE") {
    return 3;
  }

  return 0;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDistanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function normalizeAmbulanceProfile(raw: unknown): AmbulanceProfile | null {
  const record = unwrapObject(raw);

  if (!record) {
    return null;
  }

  const id = toNumberValue(record.id ?? record.ambulanceId, Number.NaN);

  if (!Number.isFinite(id)) {
    return null;
  }

  const latitude = toNumberValue(
    record.simLatitude ?? record.latitude,
    COMMAND_CENTER_COORDINATES.latitude,
  );

  const longitude = toNumberValue(
    record.simLongitude ?? record.longitude,
    COMMAND_CENTER_COORDINATES.longitude,
  );

  return {
    id,
    name: toStringValue(record.name, `Ambulance ${id}`),
    vehicleInfo: toStringValue(record.vehicleInfo, "-"),
    driverPhone: toNullableString(record.driverPhone),
    ambulanceStatus: toProfileStatus(record.ambulanceStatus ?? record.status),
    simLatitude: latitude,
    simLongitude: longitude,
    driverId: toNullableString(record.driverId),
    driverName: toNullableString(record.driverName),
    startingPrice: toNumberValue(record.startingPrice, 0),
    ambulanceNumber: toStringValue(record.ambulanceNumber, `AMB-${id}`),
    ambulancePointId: toNullableNumber(
      record.ambulancePointId ?? record.pointId ?? record.hospitalId,
    ),
    createdAt: toNullableString(record.createdAt) ?? undefined,
    updatedAt: toNullableString(record.updatedAt) ?? undefined,
  };
}

export function normalizeAmbulance(raw: unknown): Ambulance | null {
  const record = toRecord(raw);

  if (!record) {
    return null;
  }

  const id = toStringValue(record.id ?? record.ambulanceId, "");

  if (!id) {
    return null;
  }

  const ambulancePointId = toNullableNumber(
    record.ambulancePointId ?? record.pointId ?? record.hospitalId,
  );

  const latitude = toNumberValue(
    record.simLatitude ?? record.latitude,
    COMMAND_CENTER_COORDINATES.latitude,
  );

  const longitude = toNumberValue(
    record.simLongitude ?? record.longitude,
    COMMAND_CENTER_COORDINATES.longitude,
  );

  const ambulanceNumber = toStringValue(record.ambulanceNumber ?? record.licensePlate, `AMB-${id}`);

  return {
    id,
    name: toStringValue(record.name, `Ambulance ${id}`),
    ambulanceNumber,
    vehicleInfo: toStringValue(record.vehicleInfo, "-"),
    driverPhone: toStringValue(record.driverPhone, "-"),
    driverId: toNullableString(record.driverId),
    driverName: toNullableString(record.driverName),
    startingPrice: toNumberValue(record.startingPrice, 0),
    ambulancePointId,
    licensePlate: ambulanceNumber,
    hospitalId: ambulancePointId === null ? "0" : String(ambulancePointId),
    status: toUiStatus(record.ambulanceStatus ?? record.status),
    latitude,
    longitude,
  };
}

export function extractAmbulanceCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = toRecord(payload);

  if (!record) {
    return [];
  }

  if (Array.isArray(record.ambulances)) {
    return record.ambulances as unknown[];
  }

  if (Array.isArray(record.items)) {
    return record.items as unknown[];
  }

  if (Array.isArray(record.data)) {
    return record.data as unknown[];
  }

  if (Array.isArray(record.result)) {
    return record.result as unknown[];
  }

  if (Array.isArray(record.value)) {
    return record.value as unknown[];
  }

  if ("id" in record || "ambulanceId" in record) {
    return [record];
  }

  return [];
}

export function buildAmbulancePayload(
  ambulance: Ambulance,
  options?: {
    includeId?: boolean;
  },
) {
  const pointId = ambulance.ambulancePointId ?? toNullableNumber(ambulance.hospitalId);
  const ambulanceNumber = (ambulance.ambulanceNumber || ambulance.licensePlate || `AMB-${ambulance.id}`).trim();
  const name = (ambulance.name || ambulanceNumber).trim();

  const payload: Record<string, unknown> = {
    name,
    vehicleInfo: ambulance.vehicleInfo,
    driverPhone: ambulance.driverPhone,
    ambulanceStatus: toApiStatus(ambulance.status),
    simLatitude: ambulance.latitude,
    simLongitude: ambulance.longitude,
    driverId: ambulance.driverId,
    driverName: ambulance.driverName,
    startingPrice: ambulance.startingPrice,
    ambulanceNumber,
    ambulancePointId: pointId,
  };

  if (options?.includeId ?? true) {
    payload.id = ambulance.id;
  }

  return payload;
}

export function getApiErrorMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return null;
}

export function enrichAmbulance(ambulance: Ambulance, lastUpdatedAt: number): AmbulanceControlItem {
  const distanceKm = toDistanceKm(
    COMMAND_CENTER_COORDINATES.latitude,
    COMMAND_CENTER_COORDINATES.longitude,
    ambulance.latitude,
    ambulance.longitude,
  );

  return {
    ...ambulance,
    distanceKm,
    lastUpdatedAt,
    updatedSecondsAgo: 0,
    isRecentlyUpdated: false,
  };
}

export function getNextStatus(status: AmbulanceStatus): AmbulanceStatus {
  if (status === "AVAILABLE") {
    return "IN_TRANSIT";
  }

  if (status === "IN_TRANSIT") {
    return "BUSY";
  }

  if (status === "BUSY") {
    return "MAINTENANCE";
  }

  return "AVAILABLE";
}
