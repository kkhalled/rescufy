import type { Dispatch, SetStateAction } from "react";
import type {
  MockDispatchRequest,
  Request,
  RequestPriority,
  RequestStatus,
} from "./request.types";

export type QueueRequestItem = MockDispatchRequest & {
  waitingMinutes: number;
  waitingLabel: string;
  interventionReason: string | null;
};

export type RequestItemProps = {
  request: QueueRequestItem;
  isSelected: boolean;
  onSelect: () => void;
};

export type RequestListProps = {
  requests: QueueRequestItem[];
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (requestId: number) => void;
};

export type RequestDetailsPanelProps = {
  request: QueueRequestItem | null;
  onViewDetails: () => void;
  onReassignAmbulance: (requestId: number) => void;
  onCancelAssignment: (requestId: number) => void;
};

export type HospitalRequestRowProps = {
  id?: string;
  userName?: string;
  userPhone?: number | string;
  location?: string;
  priority?: RequestPriority;
  status?: RequestStatus;
  timestamp?: string;
  compact?: boolean;
};

export type RequestRowProps = {
  id?: string;
  userName?: string;
  userPhone?: string;
  address?: string;
  priority?: RequestPriority;
  status?: RequestStatus;
  timestamp?: string;
  compact?: boolean;
};

export type HospitalRequestItem = {
  id: string;
  userName: string;
  userPhone: string;
  location: string;
  priority: RequestPriority;
  status: RequestStatus;
  timestamp: string;
};

export type UseAllRequestsBoardParams = {
  requests: Request[];
  setRequests: Dispatch<SetStateAction<Request[]>>;
  fetchAdminStreamRequests: () => Promise<Request[]>;
};
