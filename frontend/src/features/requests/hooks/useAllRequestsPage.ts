import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useGetRequests } from "./useGetRequests";
import { useAllRequestsBoard } from "./useAllRequestsBoard";
import { cancelRequestApi } from "../data/requests.api";

export function useAllRequestsPage() {
  const { t } = useTranslation(["requests", "auth"]);
  const navigate = useNavigate();

  const { requests, isLoading, fetchAdminStreamRequests, setRequests } =
    useGetRequests();

  const {
    selectedId,
    setSelectedId,
    boardRequests,
    selectedRequest,
    criticalCount,
    failedCount,
    searchingCount,
    assignedCount,
    
    queueTone,
    systemState,
    reassignRequest,
    failRequest,
  } = useAllRequestsBoard({
    requests,
    setRequests,
    fetchAdminStreamRequests,
  });

  const handleReassignAmbulance = (requestId: number) => {
    reassignRequest(requestId);
    toast.success(t("board.actions.forceReevaluationToast"));
  };

  const submitCancelAssignment = async (requestId: number) => {
    const token = getAuthToken();

    if (!token) {
      toast.error(t("auth:signIn.tokenNotFound"));
      return;
    }

    try {
      const message = await cancelRequestApi(token, requestId);
      failRequest(requestId);
      toast.success(message || "Request cancelled successfully");
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"));
        return;
      }

      if (error?.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"));
        return;
      }

      toast.error(t("requests:fetchRequests.error"));
    }
  };

  const handleCancelAssignment = (requestId: number) => {
    toast("Are you sure you want to cancel this request?", {
      action: {
        label: "Yes, cancel",
        onClick: () => {
          void submitCancelAssignment(requestId);
        },
      },
    });
  };

  const handleSelectRequest = (requestId: number) => {
    setSelectedId(requestId);
  };

  const handleViewRequestDetails = () => {
    if (!selectedId) {
      return;
    }

    navigate(`/admin/requests/${selectedId}`);
  };

  return {
    t,
    requests,
    isLoading,
    selectedId,
    boardRequests,
    selectedRequest,
    criticalCount,
    failedCount,
    searchingCount,
    assignedCount,
    
    queueTone,
    systemState,
    handleReassignAmbulance,
    handleCancelAssignment,
    handleSelectRequest,
    handleViewRequestDetails,
  };
}
