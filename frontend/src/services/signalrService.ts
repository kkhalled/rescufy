import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startSignalRConnection = async (token: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://your-api-url/notificationHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("SignalR Connected");
  } catch (err) {
    console.error("SignalR Connection Error:", err);
  }
};

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
  }
};

export const onNotificationReceived = (
  callback: (notification: any) => void
) => {
  connection?.on("ReceiveNotification", callback);
};