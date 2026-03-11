import { useTranslation } from "react-i18next";

type RequestStatus = "pending" | "assigned" | "enRoute" | "completed" | "cancelled";
type RequestPriority = "critical" | "high" | "medium" | "low";

interface StatusBadgeProps {
  status?: RequestStatus;
  priority?: RequestPriority;
}

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  enRoute: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const priorityStyles: Record<RequestPriority, string> = {
  critical: "critical-gradient text-white critical-gradient shadow-alert",
  high: "bg-orange-500 text-white dark:bg-orange-600 shadow-alert",
  medium: "bg-amber-500 text-white dark:bg-amber-600 shadow-alert",
  low: "bg-blue-500 text-white dark:bg-blue-600 shadow-alert",
};

export function StatusBadge({ status = "pending", priority }: StatusBadgeProps) {
  const { t } = useTranslation('requests');
  const statusLabels: Record<RequestStatus, string> = {
    pending: t('status.pending'),
    assigned: t('status.assigned'),
    enRoute: t('status.enRoute'),
    completed: t('status.completed'),
    cancelled: t('status.cancelled'),
  };

  const priorityLabels: Record<RequestPriority, string> = {
    critical: t('priority.critical'),
    high: t('priority.high'),
    medium: t('priority.medium'),
    low: t('priority.low'),
  };

  // Fallback: humanize camelCase keys (e.g., enRoute -> En Route) when translation is missing
  const humanize = (key: string) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  const getSafeLabel = (nsKey: string, fallbackKey: string) => {
    const translated = t(nsKey);
    // i18next returns the key when missing; if so, return humanized fallback
    if (!translated || translated === nsKey) return humanize(fallbackKey);
    return translated;
  };

  const baseClasses = 'py-1 rounded-full text-xs font-semibold inline-block align-middle';
  // allow wrapping on small screens, truncate on md and above; increase md width for longer labels
  const desktopWidth = 'md:w-36 md:truncate text-center';

  if (priority) {
    const label = getSafeLabel(`priority.${priority}`, priority);
    return (
      <span className={`${baseClasses} px-4 md:px-3 ${desktopWidth} whitespace-normal md:whitespace-nowrap ${priorityStyles[priority]}`}>
        {label}
      </span>
    );
  }

  const statusLabel = getSafeLabel(`status.${status}`, status);
  return (
    <span className={`${baseClasses} px-2 md:px-3 ${desktopWidth} whitespace-normal md:whitespace-nowrap ${statusStyles[status]}`}>
      {statusLabel}
    </span>
  );
}
