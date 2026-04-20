import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

let connection: HubConnection | null = null;
const shouldLogRealtime = import.meta.env.DEV;

function logRealtime(label: string, payload?: unknown): void {
  if (!shouldLogRealtime) {
    return;
  }

  if (typeof payload === "undefined") {
    console.log(`[SignalR] ${label}`);
    return;
  }

  console.log(`[SignalR] ${label}`, payload);
}

function extractEventPayload(event: unknown): {
  eventType: string | null;
  payload: unknown;
} {
  if (!event || typeof event !== "object") {
    return {
      eventType: null,
      payload: event,
    };
  }

  const eventRecord = event as Record<string, unknown>;
  const eventType =
    typeof eventRecord.eventType === "string" ? eventRecord.eventType : null;

  if ("payload" in eventRecord) {
    return {
      eventType,
      payload: eventRecord.payload,
    };
  }

  if ("data" in eventRecord) {
    return {
      eventType,
      payload: eventRecord.data,
    };
  }

  return {
    eventType,
    payload: event,
  };
}

export async function startConnection(): Promise<HubConnection | null> {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(getApiUrl("/notificationHub"), {
        accessTokenFactory: () => getAuthToken() ?? "",
      })
      .withAutomaticReconnect()
      .build();

    connection.onreconnecting((error) => {
      logRealtime("reconnecting", error ?? null);
    });

    connection.onreconnected((connectionId) => {
      logRealtime("reconnected", { connectionId: connectionId ?? null });
    });

    connection.onclose((error) => {
      logRealtime("closed", error ?? null);
    });
  }

  if (connection.state === HubConnectionState.Disconnected) {
    logRealtime("connecting", { hub: getApiUrl("/notificationHub") });
    await connection.start();
    logRealtime("connected");
  }

  return connection;
}

export function onNewRequest(callback: (request: unknown) => void): () => void {
  if (!connection) {
    return () => {};
  }

  const newRequestHandler = (event: unknown) => {
    const { payload } = extractEventPayload(event);
    logRealtime("event NewRequest", payload);
    callback(payload);
  };

  const notificationHandler = (event: unknown) => {
    const { eventType, payload } = extractEventPayload(event);
    logRealtime("event ReceiveNotification", { eventType, payload });

    if (eventType && eventType.toLowerCase() !== "newrequest") {
      return;
    }

    callback(payload);
  };

  connection.on("NewRequest", newRequestHandler);
  connection.on("ReceiveNotification", notificationHandler);

  return () => {
    connection?.off("NewRequest", newRequestHandler);
    connection?.off("ReceiveNotification", notificationHandler);
  };
}

export function onRequestUpdated(
  callback: (request: unknown) => void,
): () => void {
  if (!connection) {
    return () => {};
  }

  const requestUpdatedHandler = (event: unknown) => {
    const { payload } = extractEventPayload(event);
    logRealtime("event RequestUpdated", payload);
    callback(payload);
  };

  const statusChangedHandler = (event: unknown) => {
    const { payload } = extractEventPayload(event);
    logRealtime("event StatusChanged", payload);
    callback(payload);
  };

  const notificationHandler = (event: unknown) => {
    const { eventType, payload } = extractEventPayload(event);
    logRealtime("event ReceiveNotification", { eventType, payload });

    const normalizedEventType = eventType?.toLowerCase();

    if (
      normalizedEventType !== "requestupdated" &&
      normalizedEventType !== "statuschanged"
    ) {
      return;
    }

    callback(payload);
  };

  connection.on("RequestUpdated", requestUpdatedHandler);
  connection.on("StatusChanged", statusChangedHandler);
  connection.on("ReceiveNotification", notificationHandler);

  return () => {
    connection?.off("RequestUpdated", requestUpdatedHandler);
    connection?.off("StatusChanged", statusChangedHandler);
    connection?.off("ReceiveNotification", notificationHandler);
  };
}