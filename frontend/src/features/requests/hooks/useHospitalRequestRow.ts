import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/useLanguage";
import type { HospitalRequestRowProps } from "../types/request-ui.types";

const PRIORITY_COLOR_MAP: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
};

export function useHospitalRequestRow({
  id,
  priority,
}: Pick<HospitalRequestRowProps, "id" | "priority">) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const priorityColor = PRIORITY_COLOR_MAP[priority || "low"] || "#3b82f6";

  const openRequestDetails = () => {
    navigate(`/hospital_user/requests/${id}`);
  };

  return {
    isRTL,
    priorityColor,
    openRequestDetails,
  };
}
