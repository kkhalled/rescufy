import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";
import type {
  Ambulance,
  AmbulanceConnectionState,
  AmbulanceControlItem,
  AmbulanceProximity,
  AmbulanceRealtimeAlert,
  AmbulanceSort,
  AmbulanceStatus,
} from "../types/ambulances.types";
import ambulanceFilter from "../utils/ambulance.filter";
import { useAmbulanceRealtime } from "./useAmbulanceRealtime";

const COMMAND_CENTER_COORDINATES = {
  latitude: 31.2454,
  longitude: 30.0454,
};

const STATUS_FLOW: AmbulanceStatus[] = [
  "AVAILABLE",
  "IN_TRANSIT",
  "BUSY",
  "MAINTENANCE",
];

const HOSPITAL_DIRECTORY: Record<string, string> = {
  "1": "Central Trauma Hub",
  "2": "North Emergency Hospital",
  "3": "Rapid Care Medical Center",
};

type RealtimeUpdatePayload = {
  id: string;
  status?: AmbulanceStatus;
  latitude?: number;
  longitude?: number;
  hospitalId?: string;
  source?: "signalr" | "dispatcher" | "operator";
};

type ApiRecord = Record<string, unknown>;

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

function resolveHospitalName(hospitalId: string) {
  return HOSPITAL_DIRECTORY[hospitalId] ?? `Hospital ${hospitalId}`;
}

function asRecord(value: unknown): ApiRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiRecord;
}

function getStringFromKeys(record: ApiRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return undefined;
}

function getNumberFromKeys(record: ApiRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function toApiStatus(status: AmbulanceStatus): number {
  if (status === "AVAILABLE") {
    return 0;
  }

  if (status === "IN_TRANSIT") {
    return 1;
  }

  if (status === "BUSY") {
    return 2;
  }

  return 3;
}

function toUiStatus(value: unknown): AmbulanceStatus {
  if (typeof value === "number") {
    if (value === 0) {
      return "AVAILABLE";
    }

    if (value === 1) {
      return "IN_TRANSIT";
    }

    if (value === 2) {
      return "BUSY";
    }

    return "MAINTENANCE";
  }

  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase().replace(/\s+/g, "_");

    if (normalized === "AVAILABLE") {
      return "AVAILABLE";
    }

    if (normalized === "IN_TRANSIT" || normalized === "INTRANSIT") {
      return "IN_TRANSIT";
    }

    if (normalized === "BUSY") {
      return "BUSY";
    }

    if (normalized === "MAINTENANCE") {
      return "MAINTENANCE";
    }
  }

  return "AVAILABLE";
}

function parseHospitalIdFromVehicleInfo(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const match = trimmedValue.match(/\d+/);

  if (match?.[0]) {
    return match[0];
  }

  return trimmedValue;
}

function normalizeAmbulance(raw: unknown): Ambulance | null {
  const record = asRecord(raw);

  if (!record) {
    return null;
  }

  const id = getStringFromKeys(record, ["id", "ambulanceId", "vehicleId"]);

  if (!id) {
    return null;
  }

  const hospitalRecord = asRecord(record.hospital);
  const locationRecord = asRecord(record.location);

  const hospitalId =
    getStringFromKeys(record, ["hospitalId", "hospitalID"]) ??
    (hospitalRecord
      ? getStringFromKeys(hospitalRecord, ["id", "hospitalId", "hospitalID"])
      : undefined) ??
    parseHospitalIdFromVehicleInfo(record.vehicleInfo) ??
    "0";

  const latitude =
    getNumberFromKeys(record, ["latitude", "simLatitude"]) ??
    (locationRecord ? getNumberFromKeys(locationRecord, ["latitude", "lat"]) : undefined) ??
    COMMAND_CENTER_COORDINATES.latitude;

  const longitude =
    getNumberFromKeys(record, ["longitude", "simLongitude"]) ??
    (locationRecord
      ? getNumberFromKeys(locationRecord, ["longitude", "lng", "lon"])
      : undefined) ??
    COMMAND_CENTER_COORDINATES.longitude;

  const status = toUiStatus(record.status ?? record.ambulanceStatus);
  const licensePlate =
    getStringFromKeys(record, [
      "licensePlate",
      "plateNumber",
      "name",
      "vehicleName",
      "vehicleInfo",
    ]) ?? `AMB-${id}`;

  return {
    id,
    licensePlate,
    hospitalId,
    status,
    latitude,
    longitude,
  };
}

function extractAmbulanceCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);

  if (!record) {
    return [];
  }

  const candidateKeys = ["ambulances", "items", "data", "result", "value"];

  for (const key of candidateKeys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }

    const nestedRecord = asRecord(value);

    if (!nestedRecord) {
      continue;
    }

    for (const nestedKey of candidateKeys) {
      const nestedValue = nestedRecord[nestedKey];

      if (Array.isArray(nestedValue)) {
        return nestedValue;
      }
    }
  }

  return [record];
}

function buildAmbulancePayload(
  ambulance: Ambulance,
  options?: {
    includeId?: boolean;
  },
) {
  const numericHospitalId = Number(ambulance.hospitalId);

  const payload: Record<string, unknown> = {
    name: ambulance.licensePlate,
    licensePlate: ambulance.licensePlate,
    vehicleInfo: `Hospital ${ambulance.hospitalId}`,
    hospitalId: Number.isFinite(numericHospitalId) ? numericHospitalId : ambulance.hospitalId,
    ambulanceStatus: toApiStatus(ambulance.status),
    status: ambulance.status,
    simLatitude: ambulance.latitude,
    simLongitude: ambulance.longitude,
    latitude: ambulance.latitude,
    longitude: ambulance.longitude,
  };

  if (options?.includeId ?? true) {
    payload.id = ambulance.id;
  }

  return payload;
}

function getApiErrorMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  const fallbackMessage = error.message;

  if (typeof fallbackMessage === "string" && fallbackMessage.trim()) {
    return fallbackMessage;
  }

  return null;
}

function enrichAmbulance(ambulance: Ambulance, lastUpdatedAt: number): AmbulanceControlItem {
  const hospitalName = resolveHospitalName(ambulance.hospitalId);
  const distanceKm = toDistanceKm(
    COMMAND_CENTER_COORDINATES.latitude,
    COMMAND_CENTER_COORDINATES.longitude,
    ambulance.latitude,
    ambulance.longitude,
  );

  return {
    ...ambulance,
    hospitalName,
    distanceKm,
    lastUpdatedAt,
    updatedSecondsAgo: 0,
    isRecentlyUpdated: false,
  };
}

function buildRealtimeAlert(
  ambulance: AmbulanceControlItem,
  previousStatus: AmbulanceStatus,
): AmbulanceRealtimeAlert {
  const severityByStatus: Record<AmbulanceStatus, AmbulanceRealtimeAlert["severity"]> = {
    AVAILABLE: "success",
    IN_TRANSIT: "info",
    BUSY: "warning",
    MAINTENANCE: "critical",
  };

  return {
    id: `${ambulance.id}-${ambulance.lastUpdatedAt}`,
    ambulanceId: ambulance.id,
    ambulanceLabel: ambulance.licensePlate,
    severity: severityByStatus[ambulance.status],
    title: `Unit ${ambulance.licensePlate}`,
    message: `${previousStatus} -> ${ambulance.status}`,
    occurredAt: ambulance.lastUpdatedAt,
  };
}

function getNextStatus(status: AmbulanceStatus): AmbulanceStatus {
  const currentIndex = STATUS_FLOW.indexOf(status);

  if (currentIndex === -1) {
    return "AVAILABLE";
  }

  return STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length];
}

export function useAmbulances() {
  const isSignalREnabled = false;
  const isSimulationEnabled = false;
  const { t } = useTranslation(["ambulances", "auth"]);
  const { isRTL } = useLanguage();
  const toastPosition = isRTL ? "top-left" : "top-right";

  const [ambulances, setAmbulances] = useState<AmbulanceControlItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [connectionState, setConnectionState] = useState<AmbulanceConnectionState>("disconnected");
  const [heartbeatAt, setHeartbeatAt] = useState(Date.now());
  const [alerts, setAlerts] = useState<AmbulanceRealtimeAlert[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [hospital, setHospital] = useState("all");
  const [proximity, setProximity] = useState<AmbulanceProximity>("all");
  const [sortBy, setSortBy] = useState<AmbulanceSort>("available");

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ambulancesRef = useRef<AmbulanceControlItem[]>(ambulances);

  const appendAlert = useCallback((alert: AmbulanceRealtimeAlert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 12));
  }, []);

  const showApiError = useCallback(
    (error: unknown, fallbackKey: string) => {
      const fallbackMessage = t(fallbackKey);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), {
          position: toastPosition,
        });
        return;
      }

      toast.error(getApiErrorMessage(error) ?? fallbackMessage, {
        position: toastPosition,
      });
    },
    [t, toastPosition],
  );

  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();

    if (!token) {
      toast.error(t("auth:signIn.tokenNotFound"), {
        position: toastPosition,
      });
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [t, toastPosition]);

  const hydrateAmbulances = useCallback((items: Ambulance[]) => {
    const seededAt = Date.now();

    setAmbulances(
      items.map((ambulance, index) => enrichAmbulance(ambulance, seededAt - index * 12000)),
    );
    setHeartbeatAt(Date.now());
  }, []);

  const fetchAmbulances = useCallback(async () => {
    setIsLoading(true);

    const headers = getAuthHeaders();

    if (!headers) {
      setConnectionState("disconnected");
      setAmbulances([]);
      setIsLoading(false);
      return false;
    }

    try {
      setConnectionState(isSignalREnabled ? "reconnecting" : "connected");

      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.GET_ALL), {
        headers,
      });

      const normalized = extractAmbulanceCollection(response.data)
        .map(normalizeAmbulance)
        .filter((ambulance): ambulance is Ambulance => ambulance !== null);

      hydrateAmbulances(normalized);
      setConnectionState("connected");
      return true;
    } catch (error) {
      setConnectionState("disconnected");
      showApiError(error, "ambulances:api.fetchAllError");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, hydrateAmbulances, isSignalREnabled, showApiError]);

  useEffect(() => {
    ambulancesRef.current = ambulances;
  }, [ambulances]);

  useEffect(() => {
    void fetchAmbulances();
  }, [fetchAmbulances]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const applyRealtimeUpdate = useCallback(
    (payload: RealtimeUpdatePayload) => {
      let generatedAlert: AmbulanceRealtimeAlert | null = null;
      let touched = false;

      setAmbulances((prev) => {
        const index = prev.findIndex((item) => item.id === payload.id);

        if (index < 0) {
          return prev;
        }

        const current = prev[index];
        const nextStatus = payload.status ?? current.status;
        const nextHospitalId = payload.hospitalId ?? current.hospitalId;
        const nextLatitude = payload.latitude ?? current.latitude;
        const nextLongitude = payload.longitude ?? current.longitude;
        const updatedAt = Date.now();

        const updatedAmbulance = enrichAmbulance(
          {
            ...current,
            status: nextStatus,
            hospitalId: nextHospitalId,
            latitude: nextLatitude,
            longitude: nextLongitude,
          },
          updatedAt,
        );

        touched = true;

        if (current.status !== updatedAmbulance.status) {
          generatedAlert = buildRealtimeAlert(updatedAmbulance, current.status);
        }

        const updatedList = [...prev];
        updatedList[index] = updatedAmbulance;
        return updatedList;
      });

      if (touched) {
        setHeartbeatAt(Date.now());
      }

      if (generatedAlert) {
        appendAlert(generatedAlert);
      }
    },
    [appendAlert],
  );

  useAmbulanceRealtime({
    enabled: isSignalREnabled,
    onUpdate: applyRealtimeUpdate,
    onConnectionChange: setConnectionState,
  });

  useEffect(() => {
    if (isSignalREnabled || !isSimulationEnabled) {
      return;
    }

    const simulationInterval = window.setInterval(() => {
      const currentAmbulances = ambulancesRef.current;
      const randomAmbulance =
        currentAmbulances[Math.floor(Math.random() * currentAmbulances.length)];

      if (!randomAmbulance) {
        return;
      }

      const shouldChangeStatus = Math.random() > 0.45;
      const nextStatus = shouldChangeStatus
        ? getNextStatus(randomAmbulance.status)
        : randomAmbulance.status;

      const jitterLatitude = randomAmbulance.latitude + (Math.random() - 0.5) * 0.008;
      const jitterLongitude = randomAmbulance.longitude + (Math.random() - 0.5) * 0.008;

      applyRealtimeUpdate({
        id: randomAmbulance.id,
        status: nextStatus,
        latitude: Number(jitterLatitude.toFixed(6)),
        longitude: Number(jitterLongitude.toFixed(6)),
        source: "signalr",
      });
    }, 9000);

    return () => {
      window.clearInterval(simulationInterval);
    };
  }, [applyRealtimeUpdate, isSignalREnabled, isSimulationEnabled]);

  const filteredAmbulances = useMemo(
    () =>
      ambulanceFilter(ambulances, {
        search,
        status,
        hospital,
        proximity,
        sortBy,
      }),
    [ambulances, search, status, hospital, proximity, sortBy],
  );

  const controlAmbulances = useMemo(
    () =>
      filteredAmbulances.map((ambulance) => {
        const updatedSecondsAgo = Math.max(
          0,
          Math.floor((now - ambulance.lastUpdatedAt) / 1000),
        );

        return {
          ...ambulance,
          updatedSecondsAgo,
          isRecentlyUpdated: updatedSecondsAgo <= 5,
        };
      }),
    [filteredAmbulances, now],
  );

  const kpis = useMemo(() => {
    const total = ambulances.length;
    const available = ambulances.filter((item) => item.status === "AVAILABLE").length;
    const busy = ambulances.filter((item) => item.status === "BUSY").length;
    const maintenance = ambulances.filter((item) => item.status === "MAINTENANCE").length;

    return {
      total,
      available,
      busy,
      maintenance,
      critical: busy + maintenance,
    };
  }, [ambulances]);

  const hospitals = useMemo(() => {
    const uniqueHospitals = new Map<string, string>();

    ambulances.forEach((ambulance) => {
      uniqueHospitals.set(ambulance.hospitalId, ambulance.hospitalName);
    });

    return Array.from(uniqueHospitals.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [ambulances]);

  const heartbeatSecondsAgo = Math.max(0, Math.floor((now - heartbeatAt) / 1000));

  const openAddModal = useCallback(() => {
    setSelectedAmbulance(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((ambulance: AmbulanceControlItem) => {
    setSelectedAmbulance({
      id: ambulance.id,
      licensePlate: ambulance.licensePlate,
      hospitalId: ambulance.hospitalId,
      status: ambulance.status,
      latitude: ambulance.latitude,
      longitude: ambulance.longitude,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const submitAmbulance = useCallback(
    async (ambulance: Ambulance) => {
      const headers = getAuthHeaders();

      if (!headers) {
        return;
      }

      const updatedAt = Date.now();
      setIsMutating(true);

      try {
        if (modalMode === "add") {
          await axios.post(
            getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.CREATE),
            buildAmbulancePayload(ambulance, { includeId: false }),
            { headers },
          );

          await fetchAmbulances();
          setSearch("");
          setStatus("all");
          setHospital("all");
          setProximity("all");
          setSortBy("available");

          appendAlert({
            id: `${ambulance.id}-${updatedAt}`,
            ambulanceId: ambulance.id,
            ambulanceLabel: ambulance.licensePlate,
            severity: "info",
            title: `Unit ${ambulance.licensePlate}`,
            message: "Added to dispatch roster",
            occurredAt: updatedAt,
          });

          toast.success(t("ambulances:api.addSuccess"), {
            position: toastPosition,
          });

          setIsModalOpen(false);
          return;
        }

        await axios.put(
          getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.UPDATE(ambulance.id)),
          buildAmbulancePayload(ambulance),
          { headers },
        );

        await fetchAmbulances();

        appendAlert({
          id: `${ambulance.id}-${updatedAt}`,
          ambulanceId: ambulance.id,
          ambulanceLabel: ambulance.licensePlate,
          severity: "info",
          title: `Unit ${ambulance.licensePlate}`,
          message: "Configuration updated",
          occurredAt: updatedAt,
        });

        toast.success(t("ambulances:api.updateSuccess"), {
          position: toastPosition,
        });

        setIsModalOpen(false);
      } catch (error) {
        showApiError(
          error,
          modalMode === "add" ? "ambulances:api.addError" : "ambulances:api.updateError",
        );
      } finally {
        setIsMutating(false);
      }
    },
    [
      appendAlert,
      fetchAmbulances,
      getAuthHeaders,
      modalMode,
      showApiError,
      t,
      toastPosition,
    ],
  );

  const handleDeleteAmbulance = useCallback(
    async (ambulanceId: string, ambulanceLabel?: string) => {
      const label = ambulanceLabel || ambulanceId;

      const headers = getAuthHeaders();

      if (!headers) {
        return false;
      }

      setIsMutating(true);

      try {
        await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.DELETE(ambulanceId)), {
          headers,
        });

        await fetchAmbulances();

        if (selectedAmbulance?.id === ambulanceId) {
          setIsModalOpen(false);
          setSelectedAmbulance(undefined);
        }

        appendAlert({
          id: `${ambulanceId}-${Date.now()}`,
          ambulanceId,
          ambulanceLabel: label,
          severity: "warning",
          title: `Unit ${label}`,
          message: t("ambulances:controlCenter.alerts.deletedFromRoster"),
          occurredAt: Date.now(),
        });

        toast.success(t("ambulances:api.deleteSuccess"), {
          position: toastPosition,
        });

        return true;
      } catch (error) {
        showApiError(error, "ambulances:api.deleteError");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [
      appendAlert,
      fetchAmbulances,
      getAuthHeaders,
      selectedAmbulance?.id,
      showApiError,
      t,
      toastPosition,
    ],
  );

  const changeAmbulanceStatus = useCallback(
    async (ambulanceId: string, nextStatus?: AmbulanceStatus) => {
      const target = ambulancesRef.current.find((item) => item.id === ambulanceId);

      if (!target) {
        return;
      }

      const resolvedStatus = nextStatus ?? getNextStatus(target.status);

      if (resolvedStatus === target.status) {
        return;
      }

      const headers = getAuthHeaders();

      if (!headers) {
        return;
      }

      setIsMutating(true);

      try {
        await axios.put(
          getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.UPDATE(ambulanceId)),
          buildAmbulancePayload({
            id: target.id,
            licensePlate: target.licensePlate,
            hospitalId: target.hospitalId,
            status: resolvedStatus,
            latitude: target.latitude,
            longitude: target.longitude,
          }),
          { headers },
        );

        applyRealtimeUpdate({
          id: ambulanceId,
          status: resolvedStatus,
          source: "operator",
        });
      } catch (error) {
        showApiError(error, "ambulances:api.statusUpdateError");
      } finally {
        setIsMutating(false);
      }
    },
    [applyRealtimeUpdate, getAuthHeaders, showApiError],
  );

  const assignAmbulance = useCallback(
    (ambulanceId: string) => {
      void changeAmbulanceStatus(ambulanceId, "IN_TRANSIT");
    },
    [changeAmbulanceStatus],
  );

  const trackAmbulance = useCallback(
    (ambulanceId: string) => {
      const target = ambulancesRef.current.find((item) => item.id === ambulanceId);

      if (!target) {
        return;
      }

      setHeartbeatAt(Date.now());
      appendAlert({
        id: `${target.id}-${Date.now()}`,
        ambulanceId: target.id,
        ambulanceLabel: target.licensePlate,
        severity: "info",
        title: `Unit ${target.licensePlate}`,
        message: "Tracking view opened",
        occurredAt: Date.now(),
      });

      window.open(
        `https://www.google.com/maps?q=${target.latitude},${target.longitude}`,
        "_blank",
        "noopener,noreferrer",
      );
    },
    [appendAlert],
  );

  const controlCenter = useMemo(
    () => ({
      connectionState,
      heartbeatSecondsAgo,
      alerts,
      kpis,
    }),
    [connectionState, heartbeatSecondsAgo, alerts, kpis],
  );

  const hasCriticalUnits = kpis.critical > 0;

  useEffect(() => {
    if (!hasCriticalUnits) {
      return;
    }

    if (alerts.length > 0) {
      return;
    }

    appendAlert({
      id: `boot-${Date.now()}`,
      ambulanceId: "SYSTEM",
      ambulanceLabel: "Command",
      severity: "warning",
      title: "Mission board initialized",
      message: "Critical units detected in live roster",
      occurredAt: Date.now(),
    });
  }, [alerts.length, appendAlert, hasCriticalUnits]);

  return {
    ambulances: controlAmbulances,
    isLoading,
    isMutating,
    nowTs: now,
    search,
    status,
    hospital,
    proximity,
    sortBy,
    setSearch,
    setStatus,
    setHospital,
    setProximity,
    setSortBy,
    hospitals,
    controlCenter,
    isModalOpen,
    modalMode,
    selectedAmbulance,
    openAddModal,
    openEditModal,
    closeModal,
    submitAmbulance,
    assignAmbulance,
    trackAmbulance,
    changeAmbulanceStatus,
    handleDeleteAmbulance,
    applyRealtimeUpdate,
    refreshAmbulances: fetchAmbulances,
  };
}