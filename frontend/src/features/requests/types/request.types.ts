// requests/types.ts
export type RequestStatus = "pending" | "assigned" | "enRoute" | "completed";

export type RequestPriority = "low" | "medium" | "high" | "critical";

export type Request = {
  id: string;
  userName: string;
  userPhone: string;
  location: string;
  priority: RequestPriority;
  status: RequestStatus;
  timestamp: string;
};
