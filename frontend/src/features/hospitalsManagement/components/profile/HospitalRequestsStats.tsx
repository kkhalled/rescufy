import { useState } from "react";
import type { Request } from "@/features/requests/types/request.types";
import type { HospitalFeedbackItem } from "../../data/adminHospitalFeedback.api";
import { HospitalRequestRow } from "@/features/requests/components/hospital/HospitalRequestRow";
import { FeedbackCard } from "./FeedbackCard";
import { MetricCard } from "./MetricCard";

const panelClass = "rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm";

type Tab = "active" | "weekly" | "all" | "feedback";

type Props = {
  activeRequests: Request[];
  allRequests: Request[];
  feedbacks: HospitalFeedbackItem[];
  weeklyStats: Record<string, unknown> | null;
  isRequestsLoading: boolean;
  isStatsLoading: boolean;
  isFeedbackLoading: boolean;
  locale: string;
};

const TAB_BTN = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
    active
      ? "border-primary/40 bg-primary/10 text-primary"
      : "border-border text-muted hover:text-heading"
  }`;

function formatWeeklyValue(key: string, value: unknown, locale: string): string {
  if (value == null) return "-";

  if ((key === "weekStartDate" || key === "weekEndDate") && typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) return value.toLocaleString(locale);
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function formatWeeklyKey(key: string): string {
  const labels: Record<string, string> = {
    year: "Year",
    weekNumber: "Week",
    totalCasesAccepted: "Total Cases Accepted",
    weekStartDate: "Week Start Date",
    weekEndDate: "Week End Date",
  };
  return labels[key] || key.replace(/([A-Z])/g, " $1").trim();
}

export function HospitalRequestsStats({
  activeRequests,
  allRequests,
  feedbacks,
  weeklyStats,
  isRequestsLoading,
  isStatsLoading,
  isFeedbackLoading,
  locale,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("active");

  const weeklyStatsEntries = weeklyStats ? Object.entries(weeklyStats) : [];
  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + (f.rating ?? 0), 0) / feedbacks.length).toFixed(1)
    : "0.0";

  return (
    <article className={panelClass}>
      {/* Tab header */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 mb-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-base font-semibold text-heading">Requests &amp; Stats</h3>
        <div className="flex flex-wrap items-center gap-2">
          {(["active", "weekly", "all", "feedback"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={TAB_BTN(activeTab === tab)}
            >
              {tab === "active" ? "Active Requests"
                : tab === "weekly" ? "Weekly Stats"
                : tab === "all" ? "All Requests"
                : "Feedback"}
            </button>
          ))}
        </div>
      </div>

      {/* Active Requests */}
      {activeTab === "active" && (
        <div>
          {isRequestsLoading ? (
            <p className="text-sm text-muted">Loading active requests...</p>
          ) : activeRequests.length === 0 ? (
            <p className="text-sm text-muted">No active requests found.</p>
          ) : (
            <div className="divide-y divide-border">
              {activeRequests.map((r) => (
                <HospitalRequestRow
                  key={r.id}
                  id={String(r.id)}
                  userName={r.patientName || "-"}
                  userPhone={String(r.id)}
                  location={r.location || "-"}
                  priority={r.priority || "-"}
                  status={r.status || "Pending"}
                  timestamp={r.createdAt || "-"}
                  basePath="/admin/requests"
                  compact
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly Stats */}
      {activeTab === "weekly" && (
        <div>
          {isStatsLoading ? (
            <p className="text-sm text-muted">Loading weekly stats...</p>
          ) : weeklyStatsEntries.length === 0 ? (
            <p className="text-sm text-muted">No weekly stats available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {weeklyStatsEntries.map(([key, value]) => (
                <div key={key} className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{formatWeeklyKey(key)}</p>
                  <p className="mt-2 text-sm font-semibold text-heading">
                    {formatWeeklyValue(key, value, locale)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Requests */}
      {activeTab === "all" && (
        <div>
          {isRequestsLoading ? (
            <p className="text-sm text-muted">Loading requests...</p>
          ) : allRequests.length === 0 ? (
            <p className="text-sm text-muted">No requests found.</p>
          ) : (
            <div className="divide-y divide-border">
              {allRequests.map((r) => (
                <HospitalRequestRow
                  key={r.id}
                  id={String(r.id)}
                  userName={r.patientName || "-"}
                  userPhone={String(r.id)}
                  location={r.location || "-"}
                  priority={r.priority || "-"}
                  status={r.status || "Pending"}
                  timestamp={r.createdAt || "-"}
                  basePath="/admin/requests"
                  compact
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Feedback count" value={String(feedbacks.length)} />
            <MetricCard label="Average rating" value={averageRating} />
            <MetricCard label="Latest source" value="Hospital patients" />
          </div>

          {isFeedbackLoading ? (
            <p className="text-sm text-muted">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-sm text-muted">No feedback found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {feedbacks.map((f) => (
                <FeedbackCard
                  key={f.id}
                  userName={f.userName}
                  comment={f.comment}
                  rating={f.rating}
                  createdAt={f.createdAt}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
