import { MapPin } from "lucide-react";
import { useRequestItemView } from "../hooks/useRequestItemView";
import type { RequestItemProps } from "../types/request-ui.types";

export function RequestItem({
  request,
  isSelected,
  onSelect,
}: RequestItemProps) {
  const {
    theme,
    dispatchTheme,
    previewDescription,
    statusLabel,
    etaLabel,
    assignedAmbulanceLabel,
    priorityLabel,
    timelineEntries,
    statusIcon,
    isFailed,
  } = useRequestItemView(request);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        group relative w-full overflow-hidden

        rounded-2xl
        border border-border/60

        p-4

        text-left

        transition-all duration-200

        hover:border-border
        hover:bg-surface-muted/20

        ${
          isSelected
            ? `
              border-primary/40
              bg-primary/8

              shadow-[0_0_0_1px_rgba(99,102,241,0.15)]
            `
            : "bg-bg-card/95"
        }

        ${isFailed ? "border-red-500/25 bg-red-500/5" : ""}
      `}
    >
      {/* Accent Line */}
      <span
        className={`
          absolute inset-y-0 left-0 w-1
          ${theme.accent}
        `}
        aria-hidden
      />

      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        {/* Left */}
        <div className="min-w-0 flex-1 pl-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`
                inline-flex items-center

                rounded-full
                border

                px-2.5 py-1

                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]

                ${theme.badge}
              `}
            >
              {priorityLabel}
            </span>

            <span
              className={`
                text-sm font-bold
                ${theme.waiting}
              `}
            >
              {request.waitingLabel}
            </span>
          </div>

          <h3
            className="
              mt-3
              truncate

              text-base font-semibold
              text-heading
            "
          >
            {request.patientName || "-"}
          </h3>

          <p
            className="
              mt-1
              line-clamp-2

              text-sm
              text-body
            "
          >
            {previewDescription}
          </p>
        </div>

        {/* Status */}
        <span
          className={`
            inline-flex shrink-0 items-center gap-2

            rounded-full
            border

            px-3 py-1.5

            text-[10px]
            font-semibold
            uppercase
            tracking-[0.08em]

            ${dispatchTheme.badge}
          `}
        >
          <span
            className={`
              inline-flex
              h-4 w-4
              items-center justify-center

              rounded-full

              ${dispatchTheme.dot}

              text-white
            `}
          >
            {statusIcon}
          </span>

          <span className="hidden sm:inline">{statusLabel}</span>
        </span>
      </div>

      {/* Metadata */}
      <div
        className="
          mt-4
          flex flex-wrap items-center gap-2
        "
      >
        {/* Location */}
        <div
          className="
            inline-flex items-center gap-1.5

            rounded-full
            border border-border/60

            bg-surface-muted/40

            px-2.5 py-1

            text-xs text-body
          "
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" />

          <span className="truncate max-w-[220px]">{request.location}</span>
        </div>

        {/* Ambulance */}
        <div
          className="
            rounded-full
            border border-border/60

            bg-surface-muted/40

            px-2.5 py-1

            text-xs text-body
          "
        >
          {assignedAmbulanceLabel}
        </div>

        {/* ETA */}
        <div
          className="
            rounded-full
            border border-border/60

            bg-surface-muted/40

            px-2.5 py-1

            text-xs text-body
          "
        >
          ETA {etaLabel}
        </div>
      </div>

      {/* Timeline */}
      <div
        className="
          mt-4
          grid grid-cols-2 gap-2
          xl:grid-cols-4
        "
      >
        {timelineEntries.map((entry) => {
          return (
            <div
              key={`${request.id}-${entry.key}`}
              className={`
                rounded-xl
                border

                px-3 py-2

                transition-colors

                ${
                  entry.reached
                    ? `
                      border-primary/25
                      bg-primary/10
                    `
                    : `
                      border-border/60
                      bg-surface-muted/25
                    `
                }
              `}
            >
              <p
                className={`
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]

                  ${entry.active ? "text-primary" : "text-muted"}
                `}
              >
                {entry.label}
              </p>

              <p className="mt-1 text-xs text-body">{entry.time}</p>
            </div>
          );
        })}
      </div>
    </button>
  );
}
