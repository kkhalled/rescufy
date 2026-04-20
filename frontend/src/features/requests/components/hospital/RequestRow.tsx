import { MapPin, Phone, Clock } from "lucide-react";
import { StatusBadge } from "../../../../shared/ui/StatusBadge";
import { useRequestRow } from "../../hooks/useRequestRow";
import type { RequestRowProps } from "../../types/request-ui.types";

export function RequestRow({
  id,
  userName,
  userPhone,
  priority,
  
  status,
  timestamp,
  address,
  compact = false,
}: RequestRowProps) {
  const { isRTL, indicatorColor, relativeTime, openRequestDetails } = useRequestRow({
    id,
    priority,
    timestamp,
  });

  return (
    <button
      onClick={openRequestDetails}
      className="w-full text-left rtl:text-right bg-transparent border-none p-0 cursor-pointer group"
    >
      <div
        className={`relative flex flex-col md:flex-row md:items-center ${
          compact ? "gap-2 md:gap-3 px-3 md:px-5 py-2" : "gap-3 md:gap-5 px-4 md:px-6 py-3 md:py-4"
        } bg-card border-b border-border hover:bg-surface-muted/50 transition-colors`}
      >
        {/* Priority indicator bar */}
        {priority && (
          <div
            style={{ backgroundColor: indicatorColor }}
            className={`absolute top-0 h-1 md:h-full w-full md:w-1 rounded-t md:rounded-t-none ${
              isRTL ? "right-0 md:rounded-l" : "left-0 md:rounded-r"
            }`}
          />
        )}

        {/* ── Mobile layout ── */}
        <div className="md:hidden flex flex-col gap-2 w-full pt-1">
          {/* Row 1: Name + Priority */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-heading truncate">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-muted shrink-0" />
                <span className="text-[11px] text-muted">{relativeTime}</span>
              </div>
            </div>
            {priority && <StatusBadge priority={priority} />}
          </div>

          {/* Row 2: Phone + Status */}
          <div className="flex items-center justify-between gap-2">
            {userPhone && (
              <div className="flex items-center gap-1.5 text-xs text-body">
                <Phone className="w-3 h-3 text-muted shrink-0" />
                <span dir="ltr">{userPhone}</span>
              </div>
            )}
            <StatusBadge status={status} />
          </div>

          {/* Row 3: Address */}
          {address && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          )}
        </div>

        {/* ── Desktop layout ── */}

        {/* User info: name + relative time */}
        <div className={`hidden md:block ${compact ? "w-40" : "w-48"} shrink-0`}>
          <p className={`font-semibold text-heading truncate ${compact ? "text-xs" : "text-sm"}`}>
            {userName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-muted shrink-0" />
            <span className="text-[11px] text-muted">{relativeTime}</span>
          </div>
        </div>

        {/* Phone */}
        <div className={`hidden md:flex items-center gap-2 ${compact ? "w-32" : "w-40"} shrink-0`}>
          <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="text-sm text-body truncate" dir="ltr">{userPhone}</span>
        </div>

        {/* Address */}
        <div className="hidden md:flex items-center gap-2 flex-1 min-w-0 text-muted">
          <MapPin className={`shrink-0 ${compact ? "w-3 h-3" : "w-4 h-4"}`} />
          <span className={`truncate ${compact ? "text-xs" : "text-sm"}`}>{address}</span>
        </div>

        {/* Status badge */}
        <div className="hidden md:block shrink-0">
          <StatusBadge status={status} />
        </div>

        {/* Priority badge */}
        {priority && (
          <div className="hidden lg:block shrink-0">
            <StatusBadge priority={priority} />
          </div>
        )}
      </div>
    </button>
  );
}
