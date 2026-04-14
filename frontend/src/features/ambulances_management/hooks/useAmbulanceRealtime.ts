import { useEffect } from "react";
import {
  onNotificationReceived,
  startSignalRConnection,
  stopSignalRConnection,
} from "@/services/signalrService";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type {
  AmbulanceConnectionState,
  AmbulanceStatus,
} from "../types/ambulances.types";

type RealtimeUpdate = {
  id: string;
  status?: AmbulanceStatus;
  latitude?: number;
  longitude?: number;
  hospitalId?: string;
  source: "signalr";
};

type UseAmbulanceRealtimeOptions = {
  enabled?: boolean;
  onUpdate: (update: RealtimeUpdate) => void;
  onConnectionChange?: (state: AmbulanceConnectionState) => void;
};

type UnknownNotification = {
  entity?: string;
  type?: string;
  ambulanceId?: string;
  id?: string;
  status?: AmbulanceStatus;
  latitude?: number;
  longitude?: number;
  hospitalId?: string;
};

function normalizeNotification(payload: UnknownNotification): RealtimeUpdate | null {
  if (payload.entity && payload.entity !== "ambulance") {
    return null;
  }

  const id = payload.ambulanceId ?? payload.id;

  if (!id) {
    return null;
  }

  return {
    id,
    status: payload.status,
    latitude: payload.latitude,
    longitude: payload.longitude,
    hospitalId: payload.hospitalId,
    source: "signalr",
  };
}

export function useAmbulanceRealtime({
  enabled = false,
  onUpdate,
  onConnectionChange,
}: UseAmbulanceRealtimeOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      onConnectionChange?.("disconnected");
      return;
    }

    let isMounted = true;

    onConnectionChange?.("reconnecting");

    void startSignalRConnection(token)
      .then(() => {
        if (!isMounted) {
          return;
        }

        onConnectionChange?.("connected");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        onConnectionChange?.("disconnected");
      });

    onNotificationReceived((notification: UnknownNotification) => {
      const update = normalizeNotification(notification);

      if (!update) {
        return;
      }

      onUpdate(update);
    });

    return () => {
      isMounted = false;
      onConnectionChange?.("disconnected");
      void stopSignalRConnection();
    };
  }, [enabled, onConnectionChange, onUpdate]);
}
