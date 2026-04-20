import { type LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";
import React, { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  variant?: "default" | "critical" | "success" | "warning" | "info";
  subtitle?: React.ReactNode;
  badge?: string;
  chart?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  subtitle,
  badge,
  chart,
}: StatCardProps) {
  const { isRTL } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const isNumericValue = typeof value === "number" && Number.isFinite(value);

  const decimalPlaces = useMemo(() => {
    if (!isNumericValue) return 0;
    return Number.isInteger(value) ? 0 : Math.min(2, value.toString().split(".")[1]?.length ?? 0);
  }, [isNumericValue, value]);

  const [animatedNumber, setAnimatedNumber] = useState<number>(
    isNumericValue && !shouldReduceMotion ? 0 : isNumericValue ? value : 0,
  );

  useEffect(() => {
    if (!isNumericValue) return;

    if (shouldReduceMotion) {
      setAnimatedNumber(value);
      return;
    }

    const startValue = 0;
    const targetValue = value;
    const durationMs = 1200;
    let frameId = 0;
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const scaled = startValue + (targetValue - startValue) * eased;
      const precision = Math.pow(10, decimalPlaces);
      setAnimatedNumber(Math.round(scaled * precision) / precision);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    setAnimatedNumber(startValue);
    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [decimalPlaces, isNumericValue, shouldReduceMotion, value]);

  const displayedValue = isNumericValue
    ? animatedNumber.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
    : value;

  const variantStyles = {
    default: {
      card: "border border-border/70 bg-bg-card text-heading",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    critical: {
      card: "border border-red-500/35 bg-bg-card text-heading",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-300",
    },
    success: {
      card: "border border-emerald-500/35 bg-bg-card text-heading",
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    warning: {
      card: "border border-amber-500/35 bg-bg-card text-heading",
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    info: {
      card: "border border-cyan-500/35 bg-bg-card text-heading",
      iconBg: "bg-cyan-500/12",
      iconColor: "text-cyan-600 dark:text-cyan-300",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        relative flex h-[210px] w-full flex-col rounded-lg px-4 py-4 md:h-[220px] md:rounded-2xl md:px-6 md:py-5
        transition-all duration-300
        shadow-card
        backdrop-blur-sm
        ${styles.card}
      `}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-lg md:h-12 md:w-12 md:rounded-xl
            ${styles.iconBg}
          `}
        >
          <Icon className={`h-4 w-4 md:h-5 md:w-5 ${styles.iconColor}`} strokeWidth={2} />
        </div>

        {badge && (
          <span
            className={`
              rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide
              ${
                variant === "critical"
                  ? "bg-white/30 text-white backdrop-blur-sm"
                  : "bg-surface-muted text-muted"
              }
            `}
          >
            {badge}
          </span>
        )}

        {trend && !badge && (
          <div
            className={`
              flex items-center gap-1 text-sm font-semibold
              ${
                trend.isPositive
                  ? variant === "critical"
                    ? "text-white/90"
                    : "text-success"
                  : variant === "critical"
                    ? "text-white/90"
                    : "text-danger"
              }
            `}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`
                ${
                  isRTL
                    ? trend.isPositive
                      ? "rotate-20"
                      : "rotate-0"
                    : trend.isPositive
                      ? "rotate-200"
                      : "rotate-180"
                }
              `}
            >
              <path
                d="M6 2L10 6L6 10M10 6H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {trend.value}
          </div>
        )}
      </div>

      <div className="mb-2 text-xs font-medium md:text-sm">{title}</div>

      <div className="mb-2 text-lg font-bold leading-none md:text-2xl lg:text-[2.5rem]">
        {displayedValue}
      </div>

      <div className="space-y-2">
        {subtitle && <div className="min-h-[34px] text-sm font-medium">{subtitle}</div>}
        {chart && <div>{chart}</div>}
      </div>
    </div>
  );
}
