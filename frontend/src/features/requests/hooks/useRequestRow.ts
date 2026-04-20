import { useNavigate } from "react-router";
import { useLanguage } from "@/i18n/useLanguage";
import type { RequestRowProps } from "../types/request-ui.types";

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
};

function formatRelativeTime(timestamp?: string): string {
  if (!timestamp) {
    return "";
  }

  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();

  if (diffMs < 0) {
    return "";
  }

  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return then.toLocaleDateString();
}

export function useRequestRow({
  id,
  priority,
  timestamp,
}: Pick<RequestRowProps, "id" | "priority" | "timestamp">) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const indicatorColor = priority
    ? (PRIORITY_COLORS[priority] || "#3b82f6")
    : "#3b82f6";

  const relativeTime = formatRelativeTime(timestamp);

  const openRequestDetails = () => {
    navigate(`/admin/requests/${id}`);
  };

  return {
    isRTL,
    indicatorColor,
    relativeTime,
    openRequestDetails,
  };
}
