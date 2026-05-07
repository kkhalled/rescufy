import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import type { Hospital } from "../../types/hospitals.types";
import { MetricCard } from "./MetricCard";

const panelClass = "rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm";

type StatusKey = "normal" | "busy" | "critical" | "full";

function getStatusKey(code: number): StatusKey {
  if (code === 1) return "busy";
  if (code === 2) return "critical";
  if (code === 3) return "full";
  return "normal";
}

type Props = { hospital: Hospital };

export function HospitalHeroPanel({ hospital }: Props) {
  const { t } = useTranslation("hospitals");
  const statusKey = getStatusKey(hospital.apiStatus);
  const locationHref = `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;

  return (
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
          <MetricCard label={t("adminProfile.bedCapacity")} value={String(hospital.bedCapacity)} />
          <MetricCard
            label={t("adminProfile.availableBeds")}
            value={String(hospital.availableBeds)}
            valueClassName="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          />
          <MetricCard label={t("adminProfile.icuCapacity")} value={String(hospital.icuCapacity)} />
          <MetricCard
            label={t("adminProfile.availableICU")}
            value={String(hospital.availableICU)}
            valueClassName="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </article>
  );
}
