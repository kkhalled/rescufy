import axios from "axios";
import type { Hospital } from "../types/hospitals.types";

type ApiRecord = Record<string, unknown>;

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

  return (
    toRecord(record.data) ??
    toRecord(record.result) ??
    toRecord(record.value) ??
    toRecord(record.item) ??
    toRecord(record.hospital) ??
    record
  );
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

export function extractHospitalCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = toRecord(payload);

  if (!record) {
    return [];
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

  if (record.id !== undefined || record.hospitalId !== undefined) {
    return [record];
  }

  return [];
}

export function normalizeHospital(raw: unknown): Hospital | null {
  const record = unwrapObject(raw);

  if (!record) {
    return null;
  }

  const rawId = record.id ?? record.hospitalId;

  if (rawId === undefined || rawId === null) {
    return null;
  }

  return {
    id: String(rawId),
    name: toStringValue(record.name, "-"),
    address: toStringValue(record.address, "-"),
    contactPhone: toStringValue(record.contactPhone, "-"),
    latitude: toNumberValue(record.latitude, 0),
    longitude: toNumberValue(record.longitude, 0),
    availableBeds: toNumberValue(record.availableBeds, 0),
    bedCapacity: toNumberValue(record.bedCapacity, 0),
    availableICU: toNumberValue(record.availableICU, 0),
    icuCapacity: toNumberValue(record.icuCapacity, 0),
    apiStatus: toNumberValue(record.status, 0),
    startingPrice: toNumberValue(record.startingPrice, 0),
    createdAt: toStringValue(record.createdAt, "") || undefined,
    updatedAt: toStringValue(record.updatedAt, "") || undefined,
  };
}

export function buildHospitalPayload(hospital: Hospital) {
  return {
    name: hospital.name,
    address: hospital.address,
    contactPhone: hospital.contactPhone,
    latitude: hospital.latitude,
    longitude: hospital.longitude,
    availableBeds: hospital.availableBeds,
    bedCapacity: hospital.bedCapacity,
    availableICU: hospital.availableICU,
    icuCapacity: hospital.icuCapacity,
    status: hospital.apiStatus,
    startingPrice: hospital.startingPrice,
  };
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
