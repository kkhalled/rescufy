          import { RefreshCcw, ShieldAlert } from "lucide-react";
          import { useTranslation } from "react-i18next";
          import { HospitalRequestRow } from "./HospitalRequestRow";
          import { HospitalRequestsSkeleton } from "./HospitalRequestsSkeleton";
          import type { Request } from "../../types/request.types";

          type HospitalAllRequestsProps = {
            requests: Request[];
            isLoading: boolean;
            isRefreshing: boolean;
            lastSyncedAt: string | null;
            onRefresh: () => void;
          };

          export default function HospitalAllRequests({
            requests,
            isLoading,
            isRefreshing,
            lastSyncedAt,
            onRefresh,
          }: HospitalAllRequestsProps) {
            const { t } = useTranslation(["requests", "common"]);

            return (
              <section className="rounded-2xl border border-border bg-surface-card shadow-card overflow-hidden">
                <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-heading">
                      {t("hospital.requestsSubtitle")}
                    </h2>
                    <p className="text-sm text-muted">
                      {t("pagination.showing")} {requests.length} {t("pagination.of")} {requests.length} {t("pagination.requests")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onRefresh}
                    className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-background-second px-4 py-2 text-sm font-medium text-heading transition hover:bg-background"
                  >
                    <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? t("common:loading", "Refreshing") : "Refresh"}
                  </button>
                </header>

                {isLoading ? (
                  <HospitalRequestsSkeleton />
                ) : requests.length === 0 ? (
                  <div className="flex min-h-85 items-center justify-center px-6 py-12 text-center">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-base font-semibold text-heading">No hospital requests yet</p>
                      <p className="mt-1 max-w-md text-sm text-muted">
                        Requests assigned to your hospital will appear here automatically when they arrive.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-215 divide-y divide-border">
                      {requests.map((request) => (
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
                  </div>
                )}

                <footer className="flex flex-col gap-2 border-t border-border px-5 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {t("pagination.showing")} {requests.length} {t("pagination.of")} {requests.length} {t("pagination.requests")}
                  </span>
                  <span>{lastSyncedAt ? `Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}` : "Waiting for live connection..."}</span>
                </footer>
              </section>
            );
          }
