import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

let connection: HubConnection | null = null;

function getPayload(event: any): unknown {
  if (!event || typeof event !== "object") {
    return event;
  }

  return event.payload ?? event.data ?? event;
}

function getEventType(event: any): string | null {
  if (!event || typeof event !== "object") {
    return null;
  }

  if (typeof event.eventType !== "string") {
    return null;
  }

  return event.eventType.toLowerCase();
}

export async function startConnection(): Promise<HubConnection | null> {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(getApiUrl("/hubs/notifications"), {
        accessTokenFactory: () => getAuthToken() ?? "",
      })
      .withAutomaticReconnect()
      .build();
  }

  if (connection.state === HubConnectionState.Disconnected) {
    await connection.start();
  }

  return connection;
}

export function onNewRequest(callback: (request: unknown) => void): () => void {
  if (!connection) {
    return () => {};
  }

  const newRequestHandler = (event: unknown) => {
    callback(getPayload(event));
  };

  const notificationHandler = (event: unknown) => {
    const eventType = getEventType(event);
    if (eventType && eventType !== "newrequest") {
      return;
    }

    callback(getPayload(event));
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
    callback(getPayload(event));
  };

  const statusChangedHandler = (event: unknown) => {
    callback(getPayload(event));
  };

  const notificationHandler = (event: unknown) => {
    const eventType = getEventType(event);
    if (eventType !== "requestupdated" && eventType !== "statuschanged") {
      return;
    }

    callback(getPayload(event));
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

export function onNotification(callback: (event: unknown) => void): () => void {
  if (!connection) {
    return () => {};
  }

  const notificationHandler = (event: unknown) => {
    callback(getPayload(event));
  };

  connection.on("ReceiveNotification", notificationHandler);

  return () => {
    connection?.off("ReceiveNotification", notificationHandler);
  };
}