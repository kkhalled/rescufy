import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import type { Request, ApiRequest } from "../types/request.types";
import { REQUEST_STATUS_MAP } from "../types/request.types";
import { useLanguage } from "@/i18n/useLanguage";

/** Query-parameter filters matching GET /api/Request */
export interface RequestFilters {
  UserId?: string;
  RequestStatus?: number | "";
  IsSelfCase?: boolean | "";
  StartDate?: string;
  EndDate?: string;
}

/** Map a single raw API request to the frontend shape */
function mapApiRequest(raw: ApiRequest): Request {
  return {
    id: raw.id,
    userId: raw.userId,
    userName: raw.applicationUser?.name ?? "",
    userPhone: raw.applicationUser?.phoneNumber ?? "",
    address: raw.address ?? "",
    status: REQUEST_STATUS_MAP[raw.requestStatus] ?? "pending",
    timestamp: raw.createdAt,
    description: raw.description ?? "",
    latitude: raw.latitude,
    longitude: raw.longitude,
    numberOfPeopleAffected: raw.numberOfPeopleAffected,
    isSelfCase: raw.isSelfCase,
    applicationUser: raw.applicationUser,
  };
}

/**
 * Hook for fetching requests from the API with optional filters
 */
export function useGetRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(["requests", "auth"]);
  const { isRTL } = useLanguage();

  const fetchRequests = async (filters?: RequestFilters): Promise<Request[]> => {
    setIsLoading(true);
    const toastPosition = isRTL ? "top-left" : "top-right";

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        toast.error(t("auth:signIn.tokenNotFound"), {
          position: toastPosition,
        });
        return [];
      }

      // Build query params – skip empty/undefined values
      const params: Record<string, string> = {};
      if (filters?.UserId) params.UserId = filters.UserId;
      if (filters?.RequestStatus !== undefined && filters.RequestStatus !== "")
        params.RequestStatus = String(filters.RequestStatus);
      if (filters?.IsSelfCase !== undefined && filters.IsSelfCase !== "")
        params.IsSelfCase = String(filters.IsSelfCase);
      if (filters?.StartDate) params.StartDate = filters.StartDate;
      if (filters?.EndDate) params.EndDate = filters.EndDate;

      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.GET_ALL),
        {
          params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const fetchedRequests: Request[] = (response.data as ApiRequest[]).map(mapApiRequest);
      console.log(response);
      
      setRequests(fetchedRequests);
      return fetchedRequests;
    } catch (error: any) {
      console.error("Fetch requests error:", error);

      if (error.response?.status === 401) {
        toast.error(t("auth:signIn.unauthorized"), { position: toastPosition });
      } else if (error.message === "Network Error") {
        toast.error(t("auth:signIn.networkError"), { position: toastPosition });
      } else {
        toast.error(t("requests:fetchRequests.error"), {
          position: toastPosition,
        });
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requests,
    isLoading,
    fetchRequests,
    setRequests,
  };
}
