import { memo, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Ambulance,
  CheckCircle2,
  Wrench,
} from "lucide-react";

type KPISectionProps = {
  total: number;
  available: number;
  busy: number;
  maintenance: number;
};

type KPICard = {
  key: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
  borderClass: string;
};

export const KPISection = memo(function KPISection({
  total,
  available,
  busy,
  maintenance,
}: KPISectionProps) {
  const { t } = useTranslation("ambulances");

  const cards: KPICard[] = [
    {
      key: "total",
      value: total,
      icon: Ambulance,
      label: t("controlCenter.kpi.total"),
      colorClass:
        "text-cyan-700 dark:text-cyan-300 bg-cyan-500/15",
      borderClass: "border-cyan-500/30",
    },
    {
      key: "available",
      value: available,
      icon: CheckCircle2,
      label: t("controlCenter.kpi.available"),
      colorClass:
        "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15",
      borderClass: "border-emerald-500/30",
    },
    {
      key: "busy",
      value: busy,
      icon: AlertTriangle,
      label: t("controlCenter.kpi.busy"),
      colorClass:
        "text-amber-700 dark:text-amber-300 bg-amber-500/15",
      borderClass: "border-amber-500/35",
    },
    {
      key: "maintenance",
      value: maintenance,
      icon: Wrench,
      label: t("controlCenter.kpi.maintenance"),
      colorClass:
        "text-red-700 dark:text-red-300 bg-red-500/15",
      borderClass: "border-red-500/35",
    },
  ];

  return (
    <>
      {/* Mobile Combined Card */}
      <section className="md:hidden">
        <article className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.key}
                  className="rounded-xl bg-background/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.08em] text-muted">
                      {card.label}
                    </p>

                    <span
                      className={`rounded-md p-1.5 ${card.colorClass}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <p className="mt-2 text-xl font-semibold text-heading">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      {/* Desktop Cards */}
      <section className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.key}
              className={`
                rounded-2xl border
                ${card.borderClass}
                bg-bg-card p-4
                shadow-card
              `}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.09em] text-muted">
                  {card.label}
                </p>

                <span
                  className={`rounded-lg p-1.5 ${card.colorClass}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold text-heading">
                {card.value}
              </p>
            </article>
          );
        })}
      </section>
    </>
  );
});