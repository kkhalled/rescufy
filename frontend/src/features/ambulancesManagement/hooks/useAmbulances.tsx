import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { API_CONFIG, getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";
import type {
  Ambulance,
  AmbulanceControlItem,
  AmbulanceStatus,
} from "../types/ambulances.types.ts";
import {
  buildAmbulancePayload,
  enrichAmbulance,
  extractAmbulanceCollection,
  getApiErrorMessage,
  getNextStatus,
  normalizeAmbulance,
} from "../utils/ambulance.api.ts";

type SubmitMode = "add" | "edit";
type AuthHeaders = { "Content-Type": string; Authorization: string };

export function useAmbulances() {
  const { t } = useTranslation(["ambulances", "auth"]);
  const { isRTL } = useLanguage();
  const toastPosition = isRTL ? "top-left" : "top-right";

  const [ambulances, setAmbulances] = useState<AmbulanceControlItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  function getAuthHeaders(): AuthHeaders | null {
    const token = getAuthToken();

    if (!token) {
      toast.error(t("auth:signIn.tokenNotFound"), { position: toastPosition });
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  function showApiError(error: unknown, fallbackKey: string, toastId?: string) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      toast.error(t("auth:signIn.unauthorized"), {
        position: toastPosition,
        id: toastId,
      });
      return;
    }

    toast.error(getApiErrorMessage(error) ?? t(fallbackKey), {
      position: toastPosition,
      id: toastId,
    });
  }

  async function fetchAmbulances() {
    setIsLoading(true);

    const headers = getAuthHeaders();

    if (!headers) {
      setAmbulances([]);
      setIsLoading(false);
      return false;
    }

    try {
      const response = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.GET_ALL),
        { headers },
      );
      console.log("Raw ambulance data:", response.data);

      const normalized = extractAmbulanceCollection(response.data)
        .map(normalizeAmbulance)
        .filter((item): item is Ambulance => item !== null)
        .map((item) => enrichAmbulance(item));

      setAmbulances(normalized);
      return true;
    } catch (error) {
      showApiError(error, "ambulances:api.fetchAllError", "ambulances-fetch-error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchAmbulances();
  }, []);

  const kpis = {
    total: ambulances.length,
    available: ambulances.filter((item) => item.status === "Available").length,
    busy: ambulances.filter((item) => item.status === "Busy").length,
    maintenance: ambulances.filter((item) => item.status === "Maintenance").length,
  };

  async function submitAmbulance(ambulance: Ambulance, mode: SubmitMode) {
    const headers = getAuthHeaders();

    if (!headers) {
      return false;
    }

    setIsMutating(true);

    try {
      if (mode === "add") {
        await axios.post(
          getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.CREATE),
          buildAmbulancePayload(ambulance, { mode: "add" }),
          { headers },
        );
      } else {
        await axios.put(
          getApiUrl(API_CONFIG.ENDPOINTS.AMBULANCES.UPDATE(ambulance.id)),
          buildAmbulancePayload(ambulance, { mode: "edit" }),
          { headers },
        );
      }

      await fetchAmbulances();
      toast.success(
        t(mode === "add" ? "ambulances:api.addSuccess" : "ambulances:api.updateSuccess"),
        { position: toastPosition },
      );
      return true;
    } catch (error) {
      showApiError(error, mode === "add" ? "ambulances:api.addError" : "ambulances:api.updateError");
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDeleteAmbulance(ambulanceId: string, ambulanceLabel?: string) {
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
      toast.success(t("ambulances:api.deleteSuccess"), {
        description: ambulanceLabel || ambulanceId,
        position: toastPosition,
      });
      return true;
    } catch (error) {
      showApiError(error, "ambulances:api.deleteError");
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function changeAmbulanceStatus(ambulanceId: string, nextStatus?: AmbulanceStatus) {
    const target = ambulances.find((item) => item.id === ambulanceId);

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
        buildAmbulancePayload({ ...target, status: resolvedStatus }, { mode: "edit" }),
        { headers },
      );

      setAmbulances((previous) =>
        previous.map((item) =>
          item.id === ambulanceId ? enrichAmbulance({ ...item, status: resolvedStatus }) : item,
        ),
      );
    } catch (error) {
      showApiError(error, "ambulances:api.statusUpdateError");
    } finally {
      setIsMutating(false);
    }
  }

  function assignAmbulance(ambulanceId: string) {
    void changeAmbulanceStatus(ambulanceId, "Transiting");
  }

  function trackAmbulance(ambulanceId: string) {
    const target = ambulances.find((item) => item.id === ambulanceId);

    if (!target) {
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${target.latitude},${target.longitude}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return {
    ambulances,
    isLoading,
    isMutating,
    kpis,
    submitAmbulance,
    assignAmbulance,
    trackAmbulance,
    changeAmbulanceStatus,
    handleDeleteAmbulance,
  };
}