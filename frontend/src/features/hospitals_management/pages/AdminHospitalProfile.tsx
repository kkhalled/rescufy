import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faBedPulse,
  faClock,
  faHospital,
  faLocationDot,
  faMapLocationDot,
  faPhone,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useGetHospitalById } from "../hooks/useGetHospitalById";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { HospitalRequestRow } from "@/features/requests/components/hospital/HospitalRequestRow";
import type { HospitalRequestItem } from "@/features/requests/types/request-ui.types";
import {
  fetchHospitalFeedbackApi,
  mapHospitalFeedbackItem,
  type HospitalFeedbackItem,
} from "../data/adminHospitalFeedback.api";
import {
  fetchHospitalActiveRequestsApi,
  fetchHospitalRequestsApi,
  fetchHospitalWeeklyStatsApi,
  mapHospitalRequestItem,
} from "../data/adminHospitalRequests.api";

const panelClass = "rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm";

type ProfileFieldCardProps = {
  label: string;
  value: string;
  icon?: IconDefinition;
  dir?: "ltr" | "rtl" | "auto";
  className?: string;
};

function ProfileFieldCard({
  label,
  value,
  icon,
  dir = "auto",
  className,
}: ProfileFieldCardProps) {
  return (
    <div className={`rounded-xl border border-border/70 bg-surface-muted/20 p-4 ${className ?? ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p dir={dir} className="mt-2 flex items-center gap-2 text-sm font-semibold text-heading break-all">
        {icon ? <FontAwesomeIcon icon={icon} className="text-muted" /> : null}
        <span>{value}</span>
      </p>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function MetricCard({ label, value, valueClassName }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-2 text-sm font-semibold ${valueClassName ?? "text-heading"}`}>{value}</p>
    </div>
  );
}

type FeedbackCardProps = {
  userName: string;
  comment: string;
  rating: number | null;
  createdAt: string;
  locale: string;
};

function FeedbackCard({ userName, comment, rating, createdAt, locale }: FeedbackCardProps) {
  return (
    <article className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading">{userName}</p>
          <p className="mt-1 text-xs text-muted">{createdAt ? new Date(createdAt).toLocaleString(locale, {
            dateStyle: "medium",
            timeStyle: "short",
          }) : "-"}</p>
        </div>

        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={index < (rating ?? 0) ? "text-amber-500" : "text-border"}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{comment}</p>
    </article>
  );
}

type HospitalProfileSkeletonProps = {
  title: string;
  subtitle: string;
  backToList: string;
};

function HospitalProfileSkeleton({
  title,
  subtitle,
  backToList,
}: HospitalProfileSkeletonProps) {
  return (
    <section className="w-full xl:px-12 py-6">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>

        <Link
          to="/admin/hospitals_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {backToList}
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <article className={`${panelClass} xl:col-span-8 animate-pulse`}>
          <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-surface-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-surface-muted" />
                <div className="h-5 w-52 rounded bg-surface-muted" />
              </div>
            </div>

            <div className="h-6 w-24 rounded-full bg-surface-muted" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4 md:col-span-2">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-4/5 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="h-10 w-44 rounded-lg border border-border/70 bg-surface-muted" />
          </div>
        </article>

        <aside className={`${panelClass} xl:col-span-4 animate-pulse`}>
          <div className="h-4 w-28 rounded bg-surface-muted" />

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-28 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-surface-muted" />
                <div className="h-3 w-10 rounded bg-surface-muted" />
              </div>
              <div className="h-2 w-full rounded-full bg-surface-muted" />
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-border pt-5">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-surface-muted" />
              <div className="h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-surface-muted" />
              <div className="h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="h-4 w-24 rounded bg-surface-muted" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusTranslationKey(statusCode: number): "normal" | "busy" | "critical" | "full" {
  if (statusCode === 1) {
    return "busy";
  }

  if (statusCode === 2) {
    return "critical";
  }

  if (statusCode === 3) {
    return "full";
  }

  return "normal";
}

export default function AdminHospitalProfile() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation("hospitals");
  const { hospital, isLoading, fetchHospitalById } = useGetHospitalById();
  const [activeRequests, setActiveRequests] = useState<HospitalRequestItem[]>([]);
  const [allRequests, setAllRequests] = useState<HospitalRequestItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<HospitalFeedbackItem[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<Record<string, unknown> | null>(null);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "weekly" | "all" | "feedback">("active");

  useEffect(() => {
    if (!id) {
      return;
    }

    void fetchHospitalById(id);
  }, [id, fetchHospitalById]);

  useEffect(() => {
    if (!id) {
      return;
    }

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
          fetchHospitalActiveRequestsApi(token, id),
          fetchHospitalRequestsApi(token, id),
          fetchHospitalWeeklyStatsApi(token, id),
          fetchHospitalFeedbackApi(token, id),
        ]);

        setActiveRequests(activeItems.map(mapHospitalRequestItem));
        setAllRequests(allItems.map(mapHospitalRequestItem));
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
  }, [id]);

  if (isLoading) {
    return (
      <HospitalProfileSkeleton
        title={t("adminProfile.title")}
        subtitle={t("adminProfile.subtitle")}
        backToList={t("adminProfile.backToList")}
      />
    );
  }

  if (!hospital) {
    return (
      <section className="w-full xl:px-12 py-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-heading">{t("adminProfile.notFoundTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("adminProfile.notFoundSubtitle")}</p>
          <Link
            to="/admin/hospitals_management"
            className="inline-flex items-center justify-center gap-2 mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            {t("adminProfile.backToList")}
          </Link>
        </div>
      </section>
    );
  }

  const usedBeds = Math.max(hospital.bedCapacity - hospital.availableBeds, 0);
  const occupancy =
    hospital.bedCapacity > 0
      ? Math.round((usedBeds / hospital.bedCapacity) * 100)
      : 0;

  const statusKey = getStatusTranslationKey(hospital.apiStatus);

  const barColorClass =
    occupancy >= 90
      ? "bg-red-500"
      : occupancy >= 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  const locationHref = `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;
  const formattedStartingPrice = Number.isFinite(hospital.startingPrice)
    ? hospital.startingPrice.toLocaleString(i18n.language)
    : "-";

  const weeklyStatsEntries = weeklyStats ? Object.entries(weeklyStats) : [];
  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, item) => sum + (item.rating ?? 0), 0) / feedbacks.length).toFixed(1)
    : "0.0";

  const formatWeeklyValue = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toLocaleString(i18n.language);
    }

    if (typeof value === "string") {
      return value;
    }

    if (value == null) {
      return "-";
    }

    return JSON.stringify(value);
  };

  return (
    <section className="w-full xl:px-12 py-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{t("adminProfile.title")}</h1>
          <p className="text-muted text-sm mt-1">{t("adminProfile.subtitle")}</p>
        </div>

        <Link
          to="/admin/hospitals_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {t("adminProfile.backToList")}
        </Link>
      </header>

      <div className="space-y-6">
        <article className={`${panelClass} relative overflow-hidden`}> 
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faHospital} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                    {t("adminProfile.id")}
                  </p>
                  <h2 className="text-xl font-semibold text-heading truncate">{hospital.name}</h2>
                  <p className="mt-1 text-xs text-muted">#{hospital.id} • {t(`status.${statusKey}`)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-surface-muted/50 px-3 py-1 text-xs font-semibold text-muted">
                  #{hospital.id}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {t(`status.${statusKey}`)}
                </span>
                <a
                  href={locationHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
                >
                  <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
                  {t("adminProfile.openInMaps")}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <MetricCard
                label={t("adminProfile.bedCapacity")}
                value={String(hospital.bedCapacity)}
              />
              <MetricCard
                label={t("adminProfile.availableBeds")}
                value={String(hospital.availableBeds)}
                valueClassName="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
              />
              <MetricCard
                label={t("adminProfile.icuCapacity")}
                value={String(hospital.icuCapacity)}
              />
              <MetricCard
                label={t("adminProfile.availableICU")}
                value={String(hospital.availableICU)}
                valueClassName="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <article className={`${panelClass} xl:col-span-7`}>
            <h3 className="text-sm font-semibold text-heading mb-4">Profile Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileFieldCard
                label={t("adminProfile.address")}
                value={hospital.address?.trim() || "-"}
                className="md:col-span-2"
              />
              <ProfileFieldCard
                label={t("adminProfile.contactPhone")}
                value={hospital.contactPhone?.trim() || "-"}
                icon={faPhone}
                dir="ltr"
              />
              <ProfileFieldCard
                label={t("adminProfile.coordinates")}
                value={`${hospital.latitude.toFixed(6)}, ${hospital.longitude.toFixed(6)}`}
              />
              <ProfileFieldCard
                label={t("adminProfile.startingPrice")}
                value={formattedStartingPrice}
              />
            </div>
          </article>

          <aside className={`${panelClass} xl:col-span-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-heading flex items-center gap-2">
                <FontAwesomeIcon icon={faBedPulse} className="text-primary" />
                {t("adminProfile.bedCapacity")}
              </h3>
              <span className="text-xs text-muted">{t("adminProfile.occupancyRate")}</span>
            </div>

            <div className="space-y-3">
              <MetricCard
                label={t("adminProfile.usedBeds")}
                value={String(usedBeds)}
              />
              <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted">{t("adminProfile.occupancyRate")}</p>
                  <p className="text-xs font-semibold text-heading">{occupancy}%</p>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className={`h-full ${barColorClass}`} style={{ width: `${occupancy}%` }} />
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-5 pt-5 space-y-3">
              <p className="text-xs text-muted flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                {t("adminProfile.createdAt")}
              </p>
              <p className="text-sm font-semibold text-heading">{formatDate(hospital.createdAt, i18n.language)}</p>

              <p className="text-xs text-muted flex items-center gap-2 mt-3">
                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                {t("adminProfile.updatedAt")}
              </p>
              <p className="text-sm font-semibold text-heading">{formatDate(hospital.updatedAt, i18n.language)}</p>

              <p className="text-xs text-muted flex items-center gap-2 mt-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-[11px]" />
                {t("table.status")}
              </p>
              <p className="text-sm font-semibold text-heading">
                {t(`status.${statusKey}`)} ({hospital.apiStatus})
              </p>
            </div>
          </aside>
        </div>

        <article className={`${panelClass}`}>
        <div className="flex flex-col gap-3 border-b border-border pb-4 mb-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-base font-semibold text-heading">Requests & Stats</h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "active"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-heading"
              }`}
            >
              Active Requests
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("weekly")}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "weekly"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-heading"
              }`}
            >
              Weekly Stats
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "all"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-heading"
              }`}
            >
              All Requests
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("feedback")}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "feedback"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-heading"
              }`}
            >
              Feedback
            </button>
          </div>
        </div>

        {activeTab === "active" && (
          <div>
            {isRequestsLoading ? (
              <p className="text-sm text-muted">Loading active requests...</p>
            ) : activeRequests.length === 0 ? (
              <p className="text-sm text-muted">No active requests found.</p>
            ) : (
              <div className="divide-y divide-border bg-bg-card">
                {activeRequests.map((request) => (
                  <HospitalRequestRow
                    key={request.id}
                    id={request.id}
                    userName={request.userName}
                    userPhone={request.userPhone}
                    location={request.location}
                    priority={request.priority}
                    status={request.status}
                    timestamp={request.timestamp}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        )}

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
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      {key}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-heading">{formatWeeklyValue(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "all" && (
          <div>
            {isRequestsLoading ? (
              <p className="text-sm text-muted">Loading requests...</p>
            ) : allRequests.length === 0 ? (
              <p className="text-sm text-muted">No requests found.</p>
            ) : (
              <div className="divide-y divide-border bg-bg-card">
                {allRequests.map((request) => (
                  <HospitalRequestRow
                    key={request.id}
                    id={request.id}
                    userName={request.userName}
                    userPhone={request.userPhone}
                    location={request.location}
                    priority={request.priority}
                    status={request.status}
                    timestamp={request.timestamp}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        )}

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
                {feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    userName={feedback.userName}
                    comment={feedback.comment}
                    rating={feedback.rating}
                    createdAt={feedback.createdAt}
                    locale={i18n.language}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </article>
      </div>
    </section>
  );
}
