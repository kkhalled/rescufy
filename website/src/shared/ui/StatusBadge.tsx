type RequestStatus = "pending" | "assigned" | "en-route" | "completed";
type RequestPriority = "critical" | "high" | "medium" | "low";

interface StatusBadgeProps {
  status?: RequestStatus;
  priority?: RequestPriority;
}

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "en-route": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const priorityStyles: Record<RequestPriority, string> = {
  critical: "critical-gradient text-white critical-gradient shadow-alert",
  high: "bg-orange-500 text-white dark:bg-orange-600 shadow-alert",
  medium: "bg-amber-500 text-white dark:bg-amber-600 shadow-alert",
  low: "bg-blue-500 text-white dark:bg-blue-600 shadow-alert",
};

export function StatusBadge({ status = "pending", priority }: StatusBadgeProps) {
  if (priority) {
    return (
      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${priorityStyles[priority]}`}>
        {priority}
      </span>
    );
  }

  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[status]}`}>
      {status.replace("-", " ")}
    </span>
  );
}
