import { type LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  variant?: "default" | "critical" | "success" | "warning";
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
  const variantStyles = {
    default: {
      card: "bg-bg-card dark:bg-bg-card backdrop-blur-sm text-heading ",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    critical: {
      card: "bg-gradient-to-br from-[#EF4444] to-[#F87171] text-white  ",
      iconBg: "bg-white/20 backdrop-blur-sm",
      iconColor: "text-white",
    },
    success: {
      card: "bg-bg-card dark:bg-bg-card text-heading  ",
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    warning: {
      card: "bg-bg-card dark:bg-bg-card  text-heading ",
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg md:rounded-2xl p-4 md:p-6
        py-6 md:py-12
        transition-all duration-300 
        shadow-card
        dark:shadow-card
        backdrop-blur-sm
        ${styles.card}
      `}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        <div
          className={`
            flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl
            ${styles.iconBg}
          `}
        >
          <Icon className={`w-4 h-4 md:w-5 md:h-5 ${styles.iconColor}`} strokeWidth={2} />
        </div>

        {/* Badge (for LIVE indicator) */}
        {badge && (
          <span
            className={`
              px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide
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

        {/* Trend Indicator */}
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

      {/* Title */}
      <div className={`text-xs md:text-sm font-medium mb-2 `}>{title}</div>

      {/* Value */}
      <div
        className={`text-lg md:text-2xl lg:text-[2.5rem] leading-none font-bold mb-2`}
      >
        {value}
      </div>

      {/* Subtitle (e.g., "2 Critical • 12 High") */}
      {subtitle && (
        <div className={`text-sm font-medium mb-4 `}>{subtitle}</div>
      )}

      {/* Chart/Graph Section */}
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  );
}
