import { CheckCircle2, Clock3, Radio, Siren, TimerReset } from "lucide-react";
import { useTranslation } from "react-i18next";

export type DispatchActivityType =
  | "requestReceived"
  | "ambulanceAssigned"
  | "etaUpdated"
  | "completed";

export type DispatchActivityEvent = {
  id: string;
  requestId: string;
  patientName: string;
  type: DispatchActivityType;
  minutesAgo: number;
  ambulanceName?: string;
  etaMinutes?: number;
};

type DispatchActivityFeedProps = {
  events: DispatchActivityEvent[];
};

const EVENT_THEME: Record<
  DispatchActivityType,
  {
    icon: typeof Radio;
    badge: string;
  }
> = {
  requestReceived: {
    icon: Radio,
    badge: "bg-cyan-500/12 text-cyan-700 dark:text-cyan-300 border-cyan-500/35",
  },
  ambulanceAssigned: {
    icon: Siren,
    badge: "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/35",
  },
  etaUpdated: {
    icon: TimerReset,
    badge: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/35",
  },
  completed: {
    icon: CheckCircle2,
    badge: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/35",
  },
};

function getEventDescription(
  t: (key: string, options?: Record<string, unknown>) => string,
  event: DispatchActivityEvent,
) {
  if (event.type === "requestReceived") {
    return t("activityFeed.descriptions.requestReceived", {
      patient: event.patientName,
    });
  }

  if (event.type === "ambulanceAssigned") {
    return t("activityFeed.descriptions.ambulanceAssigned", {
      ambulance: event.ambulanceName || "-",
    });
  }

  if (event.type === "etaUpdated") {
    return t("activityFeed.descriptions.etaUpdated", {
      eta: event.etaMinutes ?? "-",
    });
  }

  return t("activityFeed.descriptions.completed", {
    ambulance: event.ambulanceName || "-",
  });
}

export function DispatchActivityFeed({ events }: DispatchActivityFeedProps) {
  const { t } = useTranslation("dashboard");

  return (
    <section className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card">
      <div className="border-b border-border/70 pb-4">
        <h3 className="text-lg font-semibold text-heading">{t("activityFeed.title")}</h3>
        <p className="mt-1 text-sm text-muted">{t("activityFeed.subtitle")}</p>
      </div>

      <div className="mt-4 space-y-3">
        {events.map((event) => {
          const theme = EVENT_THEME[event.type];
          const EventIcon = theme.icon;

          return (
            <article
              key={event.id}
              className="rounded-xl border border-border/70 bg-surface-muted/25 px-3 py-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${theme.badge}`}>
                      <EventIcon className="h-3.5 w-3.5" />
                      {t(`activityFeed.types.${event.type}`)}
                    </span>
                    <span className="text-xs font-semibold text-heading">
                      {t("activityFeed.requestId", { id: event.requestId })}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-body">{getEventDescription(t, event)}</p>
                </div>

                <p className="inline-flex items-center gap-1.5 text-xs text-muted sm:shrink-0">
                  <Clock3 className="h-3.5 w-3.5" />
                  {t("activityFeed.minutesAgo", { count: event.minutesAgo })}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
