import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/useLanguage";
import type { HospitalRequestRowProps } from "../types/request-ui.types";

const PRIORITY_COLOR_MAP: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
  normal: "#10b981",
};

export function useHospitalRequestRow({
  id,
  priority,
  basePath = "/hospital/requests",
}: Pick<HospitalRequestRowProps, "id" | "priority" | "basePath">) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const priorityColor = PRIORITY_COLOR_MAP[priority?.toLowerCase() || "normal"] || "#10b981";

  const openRequestDetails = () => {
    if (!id || id === "-") return;
    navigate(`${basePath}/${id}`);
  };

  return {
    isRTL,
    priorityColor,
    openRequestDetails,
  };
}
