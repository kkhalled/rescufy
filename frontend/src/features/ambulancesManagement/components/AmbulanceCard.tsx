import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Navigation,
  Pencil,
  Siren,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { AmbulanceStatus } from "../types/ambulances.types";
import SelectField from "@/shared/ui/SelectField";

type StatusTheme = {
  badgeClass: string;
  borderClass: string;
  glowClass: string;
  icon: LucideIcon;
};

const STATUS_THEME: Record<AmbulanceStatus, StatusTheme> = {
  Available: {
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    borderClass: "border-emerald-500/35",
    glowClass: "shadow-[0_0_22px_rgba(16,185,129,0.18)]",
    icon: CheckCircle2,
  },
  Transiting: {
    badgeClass: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    borderClass: "border-cyan-500/35",
    glowClass: "shadow-[0_0_22px_rgba(6,182,212,0.16)]",
    icon: Siren,
  },
  Busy: {
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35",
    borderClass: "border-amber-500/60",
    glowClass: "shadow-[0_0_26px_rgba(245,158,11,0.2)]",
    icon: AlertTriangle,
  },
  Maintenance: {
    badgeClass: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/40",
    borderClass: "border-red-500/80",
    glowClass: "shadow-[0_0_30px_rgba(239,68,68,0.28)]",
    icon: Wrench,
  },
};

interface AmbulanceCardProps {
  id: string;
  name: string;
  ambulanceNumber: string;
  status: AmbulanceStatus;
  distanceKm: number;
  onAssign?: () => void;
  onTrack?: () => void;
  onChangeStatus?: (status: AmbulanceStatus) => void;
  onViewProfile?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AmbulanceCard({
  id,
  name,
  ambulanceNumber,
  status,
  distanceKm,
  onAssign,
  onTrack,
  onChangeStatus,
  onViewProfile,
  onEdit,
  onDelete,
}: AmbulanceCardProps) {
  const { t } = useTranslation("ambulances");

  const statusLabel: Record<AmbulanceStatus, string> = {
    Available: t("status.available"),
    Transiting: t("status.inTransit"),
    Busy: t("status.busy"),
    Maintenance: t("status.maintenance"),
  };

  const statusOptions: AmbulanceStatus[] = [
    "Available",
    "Transiting",
    "Busy",
    "Maintenance",
  ];

  const statusSelectOptions = statusOptions.map((option) => ({
    value: option,
    label: statusLabel[option],
  }));

  const theme = STATUS_THEME[status];
  const StatusIcon = theme.icon;
  const formattedDistance = `${distanceKm.toFixed(1)} km`;

  return (
    <article
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border/70
        bg-bg-card
        p-4
        text-body
        shadow-soft
        transition-all
        duration-250
        ease-out
        hover:-translate-y-0.5
        hover:shadow-card
      "
    >
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-1 ${theme.borderClass.replace(
          "border-",
          "bg-",
        )}`}
      />

      <div className={`absolute inset-0 -z-10 rounded-2xl border ${theme.borderClass} ${theme.glowClass}`} />

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">#{id}</p>
          <h3 className="mt-1 truncate text-base font-semibold text-heading">{name}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-muted">{ambulanceNumber}</p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${theme.badgeClass}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {statusLabel[status]}
        </span>
      </header>

      <div className="mt-3 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={onViewProfile}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-surface-muted/40 text-muted transition hover:text-primary hover:border-primary/40"
          aria-label={t("card.viewTooltip")}
        >
          <Eye className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-surface-muted/40 text-muted transition hover:text-primary hover:border-primary/40"
          aria-label={t("card.editTooltip")}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-surface-muted/40 text-muted transition hover:text-danger hover:border-danger/40"
          aria-label={t("card.deleteTooltip")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid gap-2.5 text-xs">
        <div className="flex items-center justify-between rounded-lg bg-surface-muted/40 px-3 py-2 border border-border/50">
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Navigation className="h-3.5 w-3.5" />
            {t("controlCenter.distanceFromCenter")}
          </span>
          <span className="font-medium text-info">{formattedDistance}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onAssign}
          disabled={status === "Maintenance"}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Siren className="h-3.5 w-3.5" />
          {t("controlCenter.actions.assign")}
        </button>

        <button
          type="button"
          onClick={onTrack}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-2 py-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 transition hover:bg-cyan-500/20"
        >
          <Navigation className="h-3.5 w-3.5" />
          {t("controlCenter.actions.track")}
        </button>

        <SelectField
          value={status}
          onChange={(value) => onChangeStatus?.(value as AmbulanceStatus)}
          options={statusSelectOptions}
          placeholder={t("controlCenter.actions.changeStatus")}
          triggerClassName="h-full w-full rounded-lg border border-amber-500/35 bg-amber-500/10 px-2 py-2 text-xs font-semibold text-amber-700 shadow-none ring-0 hover:bg-amber-500/20 focus:ring-2 focus:ring-amber-500/30 dark:text-amber-300"
        />
      </div>

    </article>
  );
}
