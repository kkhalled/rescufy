import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AmbulanceCard } from "./AmbulanceCard";
import type {
  AmbulanceControlItem,
  AmbulanceStatus,
} from "../types/ambulances.types";

type AmbulanceFleetPanelProps = {
  ambulances: AmbulanceControlItem[];
  isLoading: boolean;
  onAssign: (id: string) => void;
  onTrack: (id: string) => void;
  onChangeStatus: (id: string, nextStatus: AmbulanceStatus) => void;
  onEdit: (ambulance: AmbulanceControlItem) => void;
  onDelete: (candidate: { id: string; label: string }) => void;
  onViewProfile: (ambulance: AmbulanceControlItem) => void;
};

export function AmbulanceFleetPanel({
  ambulances,
  isLoading,
  onAssign,
  onTrack,
  onChangeStatus,
  onEdit,
  onDelete,
  onViewProfile,
}: AmbulanceFleetPanelProps) {
  const { t } = useTranslation("ambulances");

  return (
    <section className="rounded-2xl border border-border bg-background-second/60 p-4 md:p-5 shadow-card">
      <header className="mb-4 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-heading">{t("controlCenter.list.title")}</h3>
          <p className="text-xs text-muted">
            {t("controlCenter.list.subtitle", { count: ambulances.length })}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted/40 px-3 py-1 text-xs text-muted">
          {t("controlCenter.liveMonitoring")}
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center">
          <ShieldAlert className="mx-auto h-7 w-7 text-muted" />
          <p className="mt-3 text-sm font-medium text-heading">{t("controlCenter.loading")}</p>
        </div>
      ) : ambulances.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center">
          <ShieldAlert className="mx-auto h-7 w-7 text-muted" />
          <p className="mt-3 text-sm font-medium text-heading">{t("controlCenter.empty.title")}</p>
          <p className="mt-1 text-xs text-muted">{t("controlCenter.empty.subtitle")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/50 bg-surface-muted/35 p-2 md:p-3 lg:grid-cols-2">
          {ambulances.map((ambulance) => (
            <div key={ambulance.id}>
              <AmbulanceCard
                {...ambulance}
                onAssign={() => onAssign(ambulance.id)}
                onTrack={() => onTrack(ambulance.id)}
                onChangeStatus={(nextStatus) => onChangeStatus(ambulance.id, nextStatus)}
                onEdit={() => onEdit(ambulance)}
                onDelete={() =>
                  onDelete({
                    id: ambulance.id,
                    label: ambulance.ambulanceNumber,
                  })
                }
                onViewProfile={() => onViewProfile(ambulance)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
