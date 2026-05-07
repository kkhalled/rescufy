import { useEffect, useState } from "react";
import type { Request } from "@/features/requests/types/request.types";
import type { HospitalFeedbackItem } from "../data/adminHospitalFeedback.api";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import {
  fetchHospitalActiveRequestsApi,
  fetchHospitalRequestsApi,
  fetchHospitalWeeklyStatsApi,
} from "../data/adminHospitalRequests.api";
import {
  fetchHospitalFeedbackApi,
  mapHospitalFeedbackItem,
} from "../data/adminHospitalFeedback.api";

export function useAdminHospitalProfileData(hospitalId: string | undefined) {
  const [activeRequests, setActiveRequests] = useState<Request[]>([]);
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [feedbacks, setFeedbacks] = useState<HospitalFeedbackItem[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<Record<string, unknown> | null>(null);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  useEffect(() => {
    if (!hospitalId) return;

    const token = getAuthToken();
    if (!token) {
      setActiveRequests([]);
      setAllRequests([]);
      setWeeklyStats(null);
      return;
    }

    setIsRequestsLoading(true);
    setIsStatsLoading(true);
    setIsFeedbackLoading(true);

    void (async () => {
      try {
        const [activeItems, allItems, stats, feedbackItems] = await Promise.all([
          fetchHospitalActiveRequestsApi(token, hospitalId),
          fetchHospitalRequestsApi(token, hospitalId),
          fetchHospitalWeeklyStatsApi(token, hospitalId),
          fetchHospitalFeedbackApi(token, hospitalId),
        ]);

        setActiveRequests(activeItems);
        setAllRequests(allItems);
        setWeeklyStats(stats);
        setFeedbacks(feedbackItems.map(mapHospitalFeedbackItem));
      } catch (error) {
        console.error("Fetch hospital profile data error:", error);
        setActiveRequests([]);
        setAllRequests([]);
        setWeeklyStats(null);
        setFeedbacks([]);
      } finally {
        setIsRequestsLoading(false);
        setIsStatsLoading(false);
        setIsFeedbackLoading(false);
      }
    })();
  }, [hospitalId]);

  return {
    activeRequests,
    allRequests,
    feedbacks,
    weeklyStats,
    isRequestsLoading,
    isStatsLoading,
    isFeedbackLoading,
  };
}
