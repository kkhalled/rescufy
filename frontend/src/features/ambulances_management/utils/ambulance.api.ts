import axios from "axios";
import type {
  AmbulanceApiStatus,
  Ambulance,
  AmbulanceControlItem,
  AmbulanceProfile,
  AmbulanceStatus,
} from "../types/ambulances.types";

type ApiRecord = Record<string, unknown>;

const DEFAULT_LATITUDE = 31.2454;
const DEFAULT_LONGITUDE = 30.0454;
const COLLECTION_KEYS = ["ambulances", "items", "data", "result", "value"] as const;

function asRecord(value: unknown): ApiRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiRecord;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

function asNumber(value: unknown, fallback: number): number {
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

function asNullableString(value: unknown): string | null {
  const normalized = asString(value);
  return normalized ? normalized : null;
}

function asNullableNumber(value: unknown): number | null {
  const parsed = asNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStatus(value: unknown): AmbulanceStatus {
  const statusCode = asNumber(value, Number.NaN);

  if (statusCode === 0) {
    return "AVAILABLE";
  }

  if (statusCode === 1) {
    return "IN_TRANSIT";
  }

  if (statusCode === 2) {
    return "BUSY";
  }

  if (statusCode === 3) {
    return "MAINTENANCE";
  }

  const normalized = asString(value).toUpperCase().replace(/\s+/g, "_");

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

function toApiStatus(status: AmbulanceStatus): AmbulanceApiStatus {
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

function unwrapProfilePayload(raw: unknown): ApiRecord | null {
  const record = asRecord(raw);

  if (!record) {
    return null;
  }

  return asRecord(record.data) ?? asRecord(record.result) ?? asRecord(record.value) ?? record;
}

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

export function normalizeAmbulanceProfile(raw: unknown): AmbulanceProfile | null {
  const record = unwrapProfilePayload(raw);

  if (!record) {
    return null;
  }

  const id = asNumber(record.id ?? record.ambulanceId, Number.NaN);

  if (!Number.isFinite(id)) {
    return null;
  }

  const latitude = asNumber(record.simLatitude ?? record.latitude, DEFAULT_LATITUDE);
  const longitude = asNumber(record.simLongitude ?? record.longitude, DEFAULT_LONGITUDE);

  return {
    id,
    name: asString(record.name, `Ambulance ${id}`),
    vehicleInfo: asString(record.vehicleInfo, "-"),
    driverPhone: asNullableString(record.driverPhone),
    ambulanceStatus: toApiStatus(toStatus(record.ambulanceStatus ?? record.status)),
    simLatitude: latitude,
    simLongitude: longitude,
    driverId: asNullableString(record.driverId),
    driverName: asNullableString(record.driverName),
    startingPrice: asNumber(record.startingPrice, 0),
    ambulanceNumber: asString(record.ambulanceNumber, `AMB-${id}`),
    ambulancePointId: asNullableNumber(
      record.ambulancePointId ?? record.pointId ?? record.hospitalId,
    ),
    createdAt: asNullableString(record.createdAt) ?? undefined,
    updatedAt: asNullableString(record.updatedAt) ?? undefined,
  };
}

export function normalizeAmbulance(raw: unknown): Ambulance | null {
  const record = asRecord(raw);

  if (!record) {
    return null;
  }

  const id = asString(record.id ?? record.ambulanceId);

  if (!id) {
    return null;
  }

  const ambulancePointId = asNullableNumber(
    record.ambulancePointId ?? record.pointId ?? record.hospitalId,
  );

  const latitude = asNumber(record.simLatitude ?? record.latitude, DEFAULT_LATITUDE);
  const longitude = asNumber(record.simLongitude ?? record.longitude, DEFAULT_LONGITUDE);
  const ambulanceNumber = asString(record.ambulanceNumber ?? record.licensePlate, `AMB-${id}`);

  return {
    id,
    name: asString(record.name, `Ambulance ${id}`),
    ambulanceNumber,
    vehicleInfo: asString(record.vehicleInfo, "-"),
    driverPhone: asString(record.driverPhone, "-"),
    driverId: asNullableString(record.driverId),
    driverName: asNullableString(record.driverName),
    paramedicId: asNullableString(record.paramedicId),
    startingPrice: asNumber(record.startingPrice, 0),
    ambulancePointId,
    licensePlate: ambulanceNumber,
    hospitalId: ambulancePointId === null ? "0" : String(ambulancePointId),
    status: toStatus(record.ambulanceStatus ?? record.status),
    latitude,
    longitude,
  };
}

export function extractAmbulanceCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);

  if (!record) {
    return [];
  }

  for (const key of COLLECTION_KEYS) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }

    const nested = asRecord(value);

    if (!nested) {
      continue;
    }

    for (const nestedKey of COLLECTION_KEYS) {
      const nestedValue = nested[nestedKey];

      if (Array.isArray(nestedValue)) {
        return nestedValue;
      }
    }
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
  const pointId = ambulance.ambulancePointId ?? asNullableNumber(ambulance.hospitalId);
  const ambulanceNumber = asString(
    ambulance.ambulanceNumber || ambulance.licensePlate,
    `AMB-${ambulance.id}`,
  );
  const name = asString(ambulance.name, ambulanceNumber);

  const payload: Record<string, unknown> = {
    name,
    vehicleInfo: ambulance.vehicleInfo,
    driverPhone: ambulance.driverPhone,
    ambulanceStatus: toApiStatus(ambulance.status),
    simLatitude: ambulance.latitude,
    simLongitude: ambulance.longitude,
    driverId: ambulance.driverId,
    paramedicId: ambulance.paramedicId,
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
