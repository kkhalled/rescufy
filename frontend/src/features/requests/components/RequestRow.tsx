import { MapPin } from "lucide-react";
import type { RequestStatus, RequestPriority } from "../types/request.types";
import { StatusBadge } from "../../../shared/ui/StatusBadge";

interface RequestRowProps {
  id?: string;
  userName?: string;
  userPhone?: string;
  location?: string;
  priority?: RequestPriority;
  status?: RequestStatus;
  timestamp?: string;
}

export function RequestRow({
  id,
  userName  ,
  userPhone,
  location ,
  priority ,
  status  ,
  timestamp ,
}: RequestRowProps) {
  const priorityColor = priority === "critical" ? "red-500" : priority === "high" ? "orange-500" : priority === "medium" ? "amber-500" : "blue-500";

  return (
    <div className={`relative cursor-pointer flex flex-col md:flex-row md:items-center gap-3 md:gap-6 px-4 md:px-6 py-3 md:py-4 bg-card border-b border-border`}>

      {/* Severity Indicator */}
      <div className={`absolute left-0 top-0 h-1 md:h-full w-full md:w-1 bg-${priorityColor} md:rounded-r rounded-t`} />

      {/* Top Row - Mobile */}
      <div className="md:hidden flex items-center justify-between gap-3 pt-2 w-full">
        {/* Request ID */}
        <div>
          <p className="text-xs font-semibold text-heading dark:text-heading">
            {id}
          </p>
          <p className="text-xs text-muted">
            {timestamp}
          </p>
        </div>
        {/* Priority Badge */}
        <StatusBadge priority={priority} />
      </div>

      {/* Desktop Request ID */}
      <div className="hidden md:block md:w-45">
        <p className="text-sm font-semibold text-heading dark:text-heading">
          {id}
        </p>
        <p className="text-xs text-muted">
          {timestamp}
        </p>
      </div>

      {/* User Info - Desktop */}
      <div className="hidden md:block md:w-55">
        <p className="text-sm font-medium text-heading">
          {userName}
        </p>
        <p className="text-xs text-muted">
          {userPhone}
        </p>
      </div>

      {/* Mobile User Info */}
      <div className="md:hidden">
        <p className="text-sm font-medium text-heading">
          {userName}
        </p>
        <p className="text-xs text-muted">
          {userPhone}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 flex-1 text-muted text-xs md:text-sm">
        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-muted flex-shrink-0" />
        <span className="truncate">{location}</span>
      </div>

      {/* Badges Container */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop Priority Badge */}
        <div className="hidden md:block">
          <StatusBadge priority={priority} />
        </div>

        {/* Status Badge */}
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
