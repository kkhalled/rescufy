import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCcw, ShieldAlert, Clock3, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/provider/AuthContext";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { onNewRequest, onRequestUpdated, startConnection } from "@/services/signalrService";
import CriticalRequests from "./CriticalRequests";
import { HospitalRequestRow } from "@/features/requests/components/hospital/HospitalRequestRow";
import type { Request } from "@/features/requests/types/request.types";
import {
  fetchHospitalActiveRequestsApi,
} from "../../data/hospitalRecentRequests.api";

export default function HospitalRecentRequests() {
  const { t } = useTranslation("dashboard");
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const hospitalId = Number(user?.HospitalId);
  const hasHospitalId = Number.isFinite(hospitalId) && hospitalId > 0;

  useEffect(() => {
    let unsubscribeNewRequest = () => {};
    let unsubscribeRequestUpdated = () => {};
    let cancelled = false;

    const loadRequests = async (silent = false) => {
      if (!hasHospitalId) {
        setRequests([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const token = getAuthToken();

        if (!token) {
          return;
        }

        const items = await fetchHospitalActiveRequestsApi(token, hospitalId);

        if (cancelled) {
          return;
        }

        setRequests(items);
        setLastSyncedAt(new Date().toISOString());
      } catch (error) {
        console.error("Fetch hospital recent requests error:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    const setupRealtime = async () => {
      try {
        await startConnection();

        if (cancelled) {
          return;
        }

        unsubscribeNewRequest = onNewRequest(() => {
          void loadRequests(true);
        });

        unsubscribeRequestUpdated = onRequestUpdated(() => {
          void loadRequests(true);
        });
      } catch (error) {
        console.error("Hospital recent requests SignalR setup failed:", error);
      }
    };

    void loadRequests();
    void setupRealtime();

    return () => {
      cancelled = true;
      unsubscribeNewRequest();
      unsubscribeRequestUpdated();
    };
  }, [hospitalId, hasHospitalId]);

  const visibleRequests = requests.slice(0, 4);
  const refreshLabel = isRefreshing
    ? t("recentRequests.lastRefresh", { value: t("stats.live") })
    : lastSyncedAt
      ? t("recentRequests.lastRefresh", { value: "just now" })
      : t("recentRequests.designModeHint");

  return (
    <div className="my-6 grid w-full grid-cols-1 gap-4 md:my-8 md:gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card lg:col-span-8">
        <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-base font-semibold text-heading md:text-lg">{t("recentRequests.title")}</span>
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Clock3 className="h-3.5 w-3.5" />
              {refreshLabel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-2 text-xs text-muted md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-success" />
              {t("recentRequests.socketConnected")}
            </div>
            <button
              type="button"
              disabled={isRefreshing}
              onClick={() => {
                setIsRefreshing(true);
                void (async () => {
                  const token = getAuthToken();

                  if (!token || !hasHospitalId) {
                    setIsRefreshing(false);
                    return;
                  }

                  try {
                    const items = await fetchHospitalActiveRequestsApi(token, hospitalId);
                    setRequests(items);
                    setLastSyncedAt(new Date().toISOString());
                  } finally {
                    setIsRefreshing(false);
                  }
                })();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 md:px-4"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              to="/hospital/requests"
              className="cursor-pointer rounded-full border border-border bg-background-second px-3 py-2 text-xs font-medium text-heading transition hover:bg-background md:px-4"
            >
              {t("recentRequests.viewAll")}
            </Link>
          </div>
        </div>

        <div className="grid gap-3 border-b border-border px-4 py-4 md:grid-cols-3 md:px-6">
          <div className="rounded-xl border border-border bg-surface-card px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("recentRequests.incomingRate")}</p>
            <p className="mt-1 text-lg font-semibold text-heading">
              {t("recentRequests.incomingRateValue", { value: requests.length })}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-card px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("recentRequests.avgLatency")}</p>
            <p className="mt-1 text-lg font-semibold text-heading">
              {t("recentRequests.avgLatencyValue", { value: "--" })}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-card px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("recentRequests.eventQueue")}</p>
            <p className="mt-1 text-lg font-semibold text-heading">
              {t("recentRequests.eventQueueValue", { count: visibleRequests.length })}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-85 items-center justify-center px-6 py-12 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-semibold text-heading">Loading recent requests...</p>
              <p className="mt-1 text-sm text-muted">Pulling the latest active requests for this hospital.</p>
            </div>
          </div>
        ) : !hasHospitalId ? (
          <div className="flex min-h-85 items-center justify-center px-6 py-12 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-semibold text-heading">No hospital linked to this account</p>
              <p className="mt-1 max-w-md text-sm text-muted">
                Once a hospital is assigned to the signed-in user, the recent requests feed will appear here.
              </p>
            </div>
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="flex min-h-85 items-center justify-center px-6 py-12 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-semibold text-heading">No active requests right now</p>
              <p className="mt-1 max-w-md text-sm text-muted">
                Active requests for this hospital will show up here automatically as they are assigned or updated.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border bg-bg-card dark:bg-bg-card">
            {visibleRequests.map((request) => (
              console.log(request),
              <HospitalRequestRow
              key={request.id}
              id={String(request.id)}
              userName={request.patientName || ""}
              userPhone={request.assignedAmbulancePlate || "-"}
              location={request.location || request.address || ""}
              priority={request.priority || "normal"}
              status={request.status || request.requestStatus || "Pending"}
              timestamp={request.createdAt || "-"}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-6">
          <span>{lastSyncedAt ? `Last sync ${new Date(lastSyncedAt).toLocaleTimeString()}` : t("recentRequests.designModeHint")}</span>
          <Link to="/hospital/requests" className="text-primary transition hover:opacity-80">
            {t("recentRequests.viewAll")}
          </Link>
        </div>
      </div>

      <div className="lg:col-span-4">
        <CriticalRequests requests={requests} />
      </div>
    </div>
  );
}