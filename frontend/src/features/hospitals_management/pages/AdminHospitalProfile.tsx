import { useEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { useGetHospitalById } from "../hooks/useGetHospitalById";

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

export default function AdminHospitalProfile() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation("hospitals");
  const { hospital, isLoading, fetchHospitalById } = useGetHospitalById();

  useEffect(() => {
    if (!id) {
      return;
    }

    void fetchHospitalById(id);
  }, [id, fetchHospitalById]);

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

  const statusKey =
    hospital.availableBeds <= 0
      ? "full"
      : occupancy >= 90
        ? "critical"
        : occupancy >= 70
          ? "busy"
          : "normal";

  const barColorClass =
    occupancy >= 90
      ? "bg-red-500"
      : occupancy >= 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  const locationHref = `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <article className={`${panelClass} xl:col-span-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faHospital} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  {t("adminProfile.id")}
                </p>
                <h2 className="text-lg font-semibold text-heading truncate">{hospital.name}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface-muted/50 px-3 py-1 text-xs font-semibold text-muted">
                #{hospital.id}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {t(`status.${statusKey}`)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
          </div>

          <a
            href={locationHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors mt-5"
          >
            <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
            {t("adminProfile.openInMaps")}
          </a>
        </article>

        <aside className={`${panelClass} xl:col-span-4`}>
          <h3 className="text-sm font-semibold text-heading mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faBedPulse} className="text-primary" />
            {t("adminProfile.bedCapacity")}
          </h3>

          <div className="space-y-3">
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
            <p className="text-sm font-semibold text-heading">{t(`status.${statusKey}`)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
