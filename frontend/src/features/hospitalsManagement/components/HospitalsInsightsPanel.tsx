import { memo } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, BedSingle, ShieldCheck } from "lucide-react";
import type { HospitalLoadStatus } from "../utils/hospital.metrics";

type StressedHospital = {
  id: string;
  name: string;
  occupancyPercent: number;
  status: HospitalLoadStatus;
};

type HospitalsInsightsPanelProps = {
  avgOccupancy: number;
  totalAvailableBeds: number;
  totalUsedBeds: number;
  stressedHospitals: StressedHospital[];
  totalHospitals: number;
};

function toStatusKey(status: HospitalLoadStatus) {
  if (status === "FULL") {
    return "full";
  }

  if (status === "CRITICAL") {
    return "critical";
  }

  if (status === "BUSY") {
    return "busy";
  }

  return "normal";
}

export const HospitalsInsightsPanel = memo(function HospitalsInsightsPanel({
  avgOccupancy,
  totalAvailableBeds,
  totalUsedBeds,
  stressedHospitals,
  totalHospitals,
}: HospitalsInsightsPanelProps) {
  const { t } = useTranslation("hospitals");

  const occupancyTone =
    avgOccupancy >= 90
      ? "text-red-700 dark:text-red-300"
      : avgOccupancy >= 70
        ? "text-amber-700 dark:text-amber-300"
        : "text-emerald-700 dark:text-emerald-300";

  return (
    <aside className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card xl:sticky xl:top-4 h-fit">
      <div className="flex items-start justify-between gap-3 ">
        <div>
          <h3 className="text-sm font-semibold text-heading">{t("operations.insights.title")}</h3>
          <p className="mt-1 text-xs text-muted">{t("operations.insights.subtitle")}</p>
        </div>

        <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface-muted/40 px-3.5 py-1 text-[10px] font-semibold text-muted">
            {t("operations.insights.totalHospitals")}
            <span>{  totalHospitals }</span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.08em] text-cyan-700/90 dark:text-cyan-300/80">
            {t("operations.insights.avgOccupancy")}
          </p>
          <p className={`mt-1 text-lg font-semibold ${occupancyTone}`}>{avgOccupancy}%</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700/90 dark:text-emerald-300/80">
              {t("operations.insights.availableBeds")}
            </p>
            <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-200">
              {totalAvailableBeds}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-amber-700/90 dark:text-amber-300/80">
              {t("operations.insights.usedBeds")}
            </p>
            <p className="mt-1 text-lg font-semibold text-amber-700 dark:text-amber-200">
              {totalUsedBeds}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-muted/35 px-3 py-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-heading">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          {t("operations.insights.stressedFacilities")}
        </p>

        {stressedHospitals.length === 0 ? (
          <p className="mt-2 text-xs text-muted">{t("operations.insights.noStressed")}</p>
        ) : (
          <div className="mt-2 space-y-2">
            {stressedHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="rounded-lg border border-border/60 bg-bg-card px-2.5 py-2"
              >
                <p className="truncate text-xs font-semibold text-heading">{hospital.name}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {t("operations.insights.facilityStatus", {
                    status: t(`status.${toStatusKey(hospital.status)}`),
                    occupancy: hospital.occupancyPercent,
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-muted/35 px-3 py-2 text-xs text-body">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-info" />
          {t("operations.insights.monitoring")}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-muted">
          <BedSingle className="h-3.5 w-3.5 text-warning" />
          {t("operations.insights.hint")}
        </p>
      </div>
    </aside>
  );
});