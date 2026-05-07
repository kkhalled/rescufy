import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBedPulse, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import type { Hospital } from "../../types/hospitals.types";
import { MetricCard } from "./MetricCard";

const panelClass = "rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm";

function formatDate(value: string | undefined, locale: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

function getStatusKey(code: number): "normal" | "busy" | "critical" | "full" {
  if (code === 1) return "busy";
  if (code === 2) return "critical";
  if (code === 3) return "full";
  return "normal";
}

type Props = {
  hospital: Hospital;
  usedBeds: number;
  occupancy: number;
  barColorClass: string;
};

export function HospitalBedCapacityPanel({ hospital, usedBeds, occupancy, barColorClass }: Props) {
  const { t, i18n } = useTranslation("hospitals");
  const statusKey = getStatusKey(hospital.apiStatus);

  return (
    <aside className={`${panelClass} xl:col-span-5`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-heading flex items-center gap-2">
          <FontAwesomeIcon icon={faBedPulse} className="text-primary" />
          {t("adminProfile.bedCapacity")}
        </h3>
        <span className="text-xs text-muted">{t("adminProfile.occupancyRate")}</span>
      </div>

      <div className="space-y-3">
        <MetricCard label={t("adminProfile.usedBeds")} value={String(usedBeds)} />
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
        <p className="text-sm font-semibold text-heading">
          {formatDate(hospital.createdAt, i18n.language)}
        </p>

        <p className="text-xs text-muted flex items-center gap-2 mt-3">
          <FontAwesomeIcon icon={faClock} className="text-[11px]" />
          {t("adminProfile.updatedAt")}
        </p>
        <p className="text-sm font-semibold text-heading">
          {formatDate(hospital.updatedAt, i18n.language)}
        </p>

        <p className="text-xs text-muted flex items-center gap-2 mt-3">
          <FontAwesomeIcon icon={faLocationDot} className="text-[11px]" />
          {t("table.status")}
        </p>
        <p className="text-sm font-semibold text-heading">
          {t(`status.${statusKey}`)} ({hospital.apiStatus})
        </p>
      </div>
    </aside>
  );
}
