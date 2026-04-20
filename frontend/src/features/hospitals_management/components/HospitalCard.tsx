import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faLocationDot,
  faPenToSquare,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { resolveHospitalLoad, type HospitalLoadStatus } from "../utils/hospital.metrics";

interface HospitalCardProps {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  latitude?: number;
  longitude?: number;
  availableBeds: number;
  bedCapacity: number;
  onCall?: () => void;
  onViewProfile?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

type StatusTheme = {
  badgeClass: string;
  borderClass: string;
  progressClass: string;
  accentClass: string;
  panelClass: string;
};

const STATUS_THEME: Record<HospitalLoadStatus, StatusTheme> = {
  NORMAL: {
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35",
    borderClass: "border-emerald-500/25",
    progressClass: "from-emerald-400 to-emerald-600",
    accentClass: "bg-emerald-500/75",
    panelClass: "bg-emerald-500/6 border-emerald-500/20",
  },
  BUSY: {
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35",
    borderClass: "border-amber-500/25",
    progressClass: "from-amber-400 to-amber-600",
    accentClass: "bg-amber-500/75",
    panelClass: "bg-amber-500/8 border-amber-500/20",
  },
  CRITICAL: {
    badgeClass: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40",
    borderClass: "border-orange-500/30",
    progressClass: "from-orange-400 to-orange-600",
    accentClass: "bg-orange-500/80",
    panelClass: "bg-orange-500/10 border-orange-500/25",
  },
  FULL: {
    badgeClass: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/45",
    borderClass: "border-red-500/35",
    progressClass: "from-red-400 to-red-600",
    accentClass: "bg-red-500/85",
    panelClass: "bg-red-500/10 border-red-500/30",
  },
};

export function HospitalCard({
  id,
  name,
  address,
  contactPhone,
  availableBeds,
  bedCapacity,
  onCall,
  onViewProfile,
  onEdit,
  onDelete,
}: HospitalCardProps) {
  const { t } = useTranslation("hospitals");
  const shouldReduceMotion = useReducedMotion();
  const { usedBeds, occupancyPercent, status } = resolveHospitalLoad(availableBeds, bedCapacity);
  const statusLabel: Record<HospitalLoadStatus, string> = {
    NORMAL: t("status.normal"),
    BUSY: t("status.busy"),
    CRITICAL: t("status.critical"),
    FULL: t("status.full"),
  };
  const theme = STATUS_THEME[status];
  const isEmergency = status === "CRITICAL" || status === "FULL";

  return (
    <motion.article
      className={`group relative w-full overflow-hidden rounded-2xl border bg-bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 ${theme.borderClass}`}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.995 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${theme.accentClass}`} />

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{id}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FontAwesomeIcon icon={faHospital} />
            </span>
            <h3 className="truncate text-base font-semibold text-heading">{name}</h3>
          </div>
        </div>

        <motion.span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${theme.badgeClass}`}
          animate={
            isEmergency && !shouldReduceMotion
              ? { scale: [1, 1.04, 1], opacity: [0.88, 1, 0.88] }
              : undefined
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
        >
          {statusLabel[status]}
        </motion.span>
      </header>

      <div className="mt-3 grid gap-2 rounded-xl border border-border/60 bg-surface-muted/35 px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-xs text-body" dir="ltr">
          <FontAwesomeIcon icon={faPhone} className="text-muted" />
          <span className="truncate">{contactPhone || "-"}</span>
        </p>
        <p className="flex items-center gap-1.5 text-xs text-body">
          <FontAwesomeIcon icon={faLocationDot} className="text-muted" />
          <span className="truncate" title={address}>
            {address}
          </span>
        </p>
      </div>

      <div className={`mt-3 rounded-xl border px-3 py-3 ${theme.panelClass}`}>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted">{t("card.capacity")}</span>
          <span className="font-semibold text-heading">
            {usedBeds}/{bedCapacity}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            className={`h-full bg-linear-to-r ${theme.progressClass}`}
            style={{ width: `${occupancyPercent}%`, transformOrigin: "0% 50%" }}
            initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
            whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[11px] text-muted">{t("card.used")}</p>
            <p className="text-sm font-semibold text-heading">{usedBeds}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted">{t("card.free")}</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {availableBeds}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted">{t("card.usage")}</p>
            <p className="text-sm font-semibold text-heading">{occupancyPercent}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          onClick={onCall}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
        >
          <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
          <span>{t("card.call")}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onViewProfile}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-surface-muted/45 text-muted transition hover:border-primary/35 hover:text-primary"
            title={t("card.viewTooltip")}
          >
            <FontAwesomeIcon icon={faEye} className="text-xs" />
          </button>

          <button
            onClick={onEdit}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-surface-muted/45 text-muted transition hover:border-primary/35 hover:text-primary"
            title={t("card.editTooltip")}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
          </button>

          <button
            onClick={onDelete}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-surface-muted/45 text-muted transition hover:border-danger/35 hover:text-danger"
            title={t("card.deleteTooltip")}
          >
            <FontAwesomeIcon icon={faTrash} className="text-xs" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}