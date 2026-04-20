import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAmbulance,
  faArrowLeft,
  faClock,
  faIdCard,
  faLocationDot,
  faMapLocationDot,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useGetAmbulanceById } from "../hooks/useGetAmbulanceById";
import { ambulancesData } from "../data/ambulances.data";
import {
  AMBULANCE_STATUS_TRANSLATION_KEY,
  type Ambulance,
  type AmbulanceApiStatus,
  type AmbulanceProfile as AmbulanceProfileData,
  type AmbulanceStatus,
} from "../types/ambulances.types";

const statusBadgeClass: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  inTransit: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  busy: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  maintenance: "bg-red-500/15 text-red-600 dark:text-red-400",
  offline: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};

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

type AmbulanceProfileSkeletonProps = {
  title: string;
  subtitle: string;
  backToList: string;
};

function AmbulanceProfileSkeleton({
  title,
  subtitle,
  backToList,
}: AmbulanceProfileSkeletonProps) {
  return (
    <section className="w-full xl:px-12 py-6">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>

        <Link
          to="/admin/ambulances_management"
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
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-28 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-44 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4 md:col-span-2">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-52 rounded bg-surface-muted" />
            </div>
          </div>
        </article>

        <aside className={`${panelClass} xl:col-span-4 animate-pulse`}>
          <div className="h-4 w-24 rounded bg-surface-muted" />

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="h-10 w-full rounded-lg border border-border/70 bg-surface-muted" />
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
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="h-4 w-32 rounded bg-surface-muted" />
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

function getStatusTranslationKey(statusCode: number): string {
  if (statusCode in AMBULANCE_STATUS_TRANSLATION_KEY) {
    return AMBULANCE_STATUS_TRANSLATION_KEY[statusCode as AmbulanceApiStatus];
  }

  return "offline";
}

type AmbulanceSnapshot = Ambulance & {
  hospitalName?: string;
};

type AmbulanceProfileRouteState = {
  ambulanceSnapshot?: AmbulanceSnapshot;
};

function toApiStatus(status: AmbulanceStatus): AmbulanceApiStatus {
  if (status === "IN_TRANSIT") {
    return 1;
  }

  if (status === "BUSY") {
    return 2;
  }

  if (status === "MAINTENANCE") {
    return 3;
  }

  return 0;
}

function mapSnapshotToProfile(snapshot: AmbulanceSnapshot): AmbulanceProfileData {
  const nowIso = new Date().toISOString();
  const hospitalLabel = snapshot.hospitalName?.trim() || `Hospital ${snapshot.hospitalId}`;

  return {
    id: Number.parseInt(snapshot.id.replace(/\D+/g, ""), 10) || 0,
    name: snapshot.licensePlate,
    vehicleInfo: hospitalLabel,
    driverPhone: "-",
    ambulanceStatus: toApiStatus(snapshot.status),
    simLatitude: snapshot.latitude,
    simLongitude: snapshot.longitude,
    driverId: "-",
    driverName: "-",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export default function AmbulanceProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t, i18n } = useTranslation("ambulances");
  const { ambulance, isLoading, fetchAmbulanceById } = useGetAmbulanceById();
  const routeState = location.state as AmbulanceProfileRouteState | null;

  const fallbackProfile = useMemo(() => {
    if (!id) {
      return null;
    }

    const fromState = routeState?.ambulanceSnapshot;

    if (fromState && fromState.id === id) {
      return mapSnapshotToProfile(fromState);
    }

    const fromLocalData = ambulancesData.find((item) => item.id === id);

    if (!fromLocalData) {
      return null;
    }

    return mapSnapshotToProfile(fromLocalData);
  }, [id, routeState]);

  const shouldFetchFromApi = !fallbackProfile;

  useEffect(() => {
    if (!id || !shouldFetchFromApi) {
      return;
    }

    void fetchAmbulanceById(id);
  }, [id, shouldFetchFromApi, fetchAmbulanceById]);

  const profile = ambulance ?? fallbackProfile;

  if (isLoading && !profile) {
    return (
      <AmbulanceProfileSkeleton
        title={t("profile.title")}
        subtitle={t("profile.subtitle")}
        backToList={t("profile.backToList")}
      />
    );
  }

  if (!profile) {
    return (
      <section className="w-full xl:px-12 py-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-heading">{t("profile.notFoundTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("profile.notFoundSubtitle")}</p>
          <Link
            to="/admin/ambulances_management"
            className="inline-flex items-center justify-center gap-2 mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            {t("profile.backToList")}
          </Link>
        </div>
      </section>
    );
  }

  const statusKey = getStatusTranslationKey(profile.ambulanceStatus);
  const resolvedStatusClass = statusBadgeClass[statusKey] ?? statusBadgeClass.offline;
  const locationHref = `https://www.google.com/maps?q=${profile.simLatitude},${profile.simLongitude}`;

  return (
    <section className="w-full xl:px-12 py-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{t("profile.title")}</h1>
          <p className="text-muted text-sm mt-1">{t("profile.subtitle")}</p>
        </div>

        <Link
          to="/admin/ambulances_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {t("profile.backToList")}
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <article className={`${panelClass} xl:col-span-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faAmbulance} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  {t("profile.vehicleName")}
                </p>
                <h2 className="text-lg font-semibold text-heading truncate">{profile.name}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface-muted/50 px-3 py-1 text-xs font-semibold text-muted">
                #{profile.id}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${resolvedStatusClass}`}>
                {t(`status.${statusKey}`)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <ProfileFieldCard label={t("profile.id")} value={String(profile.id)} />
            <ProfileFieldCard
              label={t("profile.vehicleInfo")}
              value={profile.vehicleInfo?.trim() || "-"}
            />
            <ProfileFieldCard
              label={t("profile.driverName")}
              value={profile.driverName?.trim() || "-"}
              icon={faUser}
            />
            <ProfileFieldCard
              label={t("profile.driverId")}
              value={profile.driverId?.trim() || "-"}
              icon={faIdCard}
            />
            <ProfileFieldCard
              label={t("profile.driverPhone")}
              value={profile.driverPhone?.trim() || "-"}
              icon={faPhone}
              dir="ltr"
              className="md:col-span-2"
            />
          </div>
        </article>

        <aside className={`${panelClass} xl:col-span-4`}>
          <h3 className="text-sm font-semibold text-heading mb-4">{t("profile.location")}</h3>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                {t("profile.latitude")}
              </p>
              <p className="text-sm font-semibold text-heading mt-2">{profile.simLatitude.toFixed(6)}</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                {t("profile.longitude")}
              </p>
              <p className="text-sm font-semibold text-heading mt-2">{profile.simLongitude.toFixed(6)}</p>
            </div>

            <a
              href={locationHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors"
            >
              <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
              {t("profile.openInMaps")}
            </a>
          </div>

          <div className="border-t border-border mt-5 pt-5 space-y-3">
            <p className="text-xs text-muted flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-[11px]" />
              {t("profile.createdAt")}
            </p>
            <p className="text-sm font-semibold text-heading">{formatDate(profile.createdAt, i18n.language)}</p>

            <p className="text-xs text-muted flex items-center gap-2 mt-3">
              <FontAwesomeIcon icon={faClock} className="text-[11px]" />
              {t("profile.updatedAt")}
            </p>
            <p className="text-sm font-semibold text-heading">{formatDate(profile.updatedAt, i18n.language)}</p>

            <p className="text-xs text-muted flex items-center gap-2 mt-3">
              <FontAwesomeIcon icon={faLocationDot} className="text-[11px]" />
              {t("profile.status")}
            </p>
            <p className="text-sm font-semibold text-heading">{t(`status.${statusKey}`)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
