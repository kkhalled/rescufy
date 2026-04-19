import { MapPin } from "lucide-react";
import type { RequestStatus, RequestPriority } from "../../types/request.types";
import { StatusBadge } from "../../../../shared/ui/StatusBadge";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../i18n/useLanguage";

interface HospitalRequestRowProps {
  id?: string;
  userName?: string;
  userPhone?: number | string;
  location?: string;
  priority?: RequestPriority;
  status?: RequestStatus;
  timestamp?: string;
  compact?: boolean;
}

export function HospitalRequestRow({
  id,
  userName,
  userPhone,
  location,
  priority,
  status,
  timestamp,
  compact = false,
}: HospitalRequestRowProps) {
  const priorityColorMap: Record<string, string> = {
    critical: "#ef4444",
    high: "#f97316",
    medium: "#f59e0b",
    low: "#3b82f6",
  };

  const priorityColor = priorityColorMap[priority || "low"] || "#3b82f6";
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <button
      onClick={() => navigate(`/hospital_user/request_details/${id}`)}
      className="w-full text-left bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div
        className={`relative flex flex-col md:flex-row md:items-center ${compact ? "gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2" : "gap-3 md:gap-6 px-4 md:px-6 py-3 md:py-4"} bg-card border-b border-border`}
      >
        {/* Severity Indicator */}
        <div
          style={{ backgroundColor: priorityColor }}
          className={`absolute top-0 h-1 md:h-full w-full md:w-1 rounded-t md:rounded-t-none ${isRTL ? "right-0 md:rounded-l" : "left-0 md:rounded-r"}`}
        />

        {/* Top Row - Mobile */}
        <div
          className={`md:hidden flex items-center justify-between gap-2 ${compact ? "pt-1" : "pt-2"} w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className={`${isRTL ? "text-right" : ""}`}>
            <p className={`font-semibold text-heading dark:text-heading ${compact ? "text-xs" : "text-xs"}`}>
              {id}
            </p>
            <p className={`text-muted ${compact ? "text-xs" : "text-xs"}`}>
              {timestamp}
            </p>
          </div>
          <StatusBadge priority={priority} />
        </div>

        {/* Desktop Request ID */}
        <div className={`hidden md:block ${compact ? "w-28 shrink-0" : "w-36 shrink-0"} ${isRTL ? "text-right" : "text-left"}`}>
          <p className={`font-semibold text-heading dark:text-heading ${compact ? "text-xs" : "text-sm"}`}>
            {id}
          </p>
          <p className={`text-muted ${compact ? "text-xs" : "text-xs"}`}>
            {timestamp}
          </p>
        </div>

        {/* User Info - Desktop */}
        <div className={`hidden md:block ${compact ? "w-32 shrink-0" : "w-48 shrink-0"} ${isRTL ? "text-right" : "text-left"}`}>
          <p className={`font-medium text-heading ${compact ? "text-xs" : "text-sm"}`}>
            {userName}
          </p>
          <p className="text-xs text-muted">{userPhone}</p>
        </div>

        {/* Mobile User Info */}
        <div className="md:hidden">
          <p className={`font-medium text-heading ${compact ? "text-xs" : "text-sm"}`}>
            {userName}
          </p>
          <p className="text-xs text-muted">{userPhone}</p>
        </div>

        {/* Location */}
        <div className={`flex items-center gap-2 flex-1 max-w-90 text-muted ${compact ? "text-xs" : "text-xs md:text-sm"}`}>
          <MapPin className={`text-muted shrink-0 ${compact ? "w-3 h-3" : "w-3 h-3 md:w-4 md:h-4"}`} />
          <span className="truncate">{location}</span>
        </div>

        {/* Badges Container */}
        <div className={`flex items-center ${compact ? "gap-1 md:gap-2" : "gap-2 md:gap-3"} justify-start ms-auto`}>
          <div className="hidden lg:block">
            <StatusBadge priority={priority} />
          </div>
          <div>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
    </button>
  );
}
