import { memo, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Activity, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";

type HospitalsKPISectionProps = {
  total: number;
  normal: number;
  busyOrCritical: number;
  full: number;
};

type KPICard = {
  key: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
  borderClass: string;
};

export const HospitalsKPISection = memo(function HospitalsKPISection({
  total,
  normal,
  busyOrCritical,
  full,
}: HospitalsKPISectionProps) {
  const { t } = useTranslation("hospitals");

  const cards: KPICard[] = [
    {
      key: "total",
      value: total,
      icon: Building2,
      label: t("operations.kpi.total"),
      colorClass: "text-cyan-700 dark:text-cyan-300 bg-cyan-500/15",
      borderClass: "border-cyan-500/30",
    },
    {
      key: "normal",
      value: normal,
      icon: CheckCircle2,
      label: t("operations.kpi.normal"),
      colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15",
      borderClass: "border-emerald-500/30",
    },
    {
      key: "busyOrCritical",
      value: busyOrCritical,
      icon: Activity,
      label: t("operations.kpi.busyCritical"),
      colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/15",
      borderClass: "border-amber-500/35",
    },
    {
      key: "full",
      value: full,
      icon: AlertTriangle,
      label: t("operations.kpi.full"),
      colorClass: "text-red-700 dark:text-red-300 bg-red-500/15",
      borderClass: "border-red-500/35",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.key}
            className={`rounded-2xl border ${card.borderClass} bg-bg-card p-4 shadow-card`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.09em] text-muted">{card.label}</p>
              <span className={`rounded-lg p-1.5 ${card.colorClass}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>

            <p className="mt-3 text-3xl font-semibold text-heading">{card.value}</p>
          </article>
        );
      })}
    </section>
  );
});