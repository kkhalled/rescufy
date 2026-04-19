import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faClock,
  faIdCard,
  faLocationDot,
  faMapLocationDot,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { AmbulanceProfile } from "../types/ambulances.types";

type AmbulanceProfileDetailsProps = {
  profile: AmbulanceProfile;
  statusKey: string;
};

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

export function AmbulanceProfileDetails({
  profile,
  statusKey,
}: AmbulanceProfileDetailsProps) {
  const { t, i18n } = useTranslation("ambulances");

  const resolvedStatusClass = statusBadgeClass[statusKey] ?? statusBadgeClass.offline;
  const locationHref = `https://www.google.com/maps?q=${profile.simLatitude},${profile.simLongitude}`;

  return (
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
          <ProfileFieldCard label={t("profile.ambulanceNumber")} value={profile.ambulanceNumber || "-"} />
          <ProfileFieldCard
            label={t("profile.vehicleInfo")}
            value={profile.vehicleInfo?.trim() || "-"}
          />
          <ProfileFieldCard
            label={t("profile.startingPrice")}
            value={Number.isFinite(profile.startingPrice) ? profile.startingPrice.toLocaleString(i18n.language) : "-"}
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
          />
          <ProfileFieldCard
            label={t("profile.ambulancePointId")}
            value={String(profile.ambulancePointId ?? "-")}
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
          <p className="text-sm font-semibold text-heading">
            {t(`status.${statusKey}`)} ({profile.ambulanceStatus})
          </p>
        </div>
      </aside>
    </div>
  );
}
