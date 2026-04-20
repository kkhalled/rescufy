import { StatusBadge } from "@/shared/ui/StatusBadge";
import CriticalRequests from "./CriticalRequests";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Clock3, MapPin, Phone, Radio, TimerReset } from "lucide-react";

type DesignRequest = {
  id: string;
  userName: string;
  userPhone: string;
  address: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "assigned" | "enRoute" | "completed";
  createdMinutesAgo: number;
};

type FeedStats = {
  incomingRate: number;
  avgLatencyMs: number;
  queueCount: number;
  lastRefreshSeconds: number;
};

const DESIGN_REQUESTS: DesignRequest[] = [
  {
    id: "REQ-2026-091",
    userName: "Khaled Mahmoud",
    userPhone: "+966501234567",
    address: "King Fahd Road, Riyadh",
    priority: "critical",
    status: "pending",
    createdMinutesAgo: 1,
  },
  {
    id: "REQ-2026-092",
    userName: "Hanan Alqahtani",
    userPhone: "+966509944221",
    address: "Al Olaya District, Riyadh",
    priority: "high",
    status: "enRoute",
    createdMinutesAgo: 3,
  },
  {
    id: "REQ-2026-093",
    userName: "Mona Abdullah",
    userPhone: "+966508885441",
    address: "Al Murabba, Riyadh",
    priority: "medium",
    status: "assigned",
    createdMinutesAgo: 5,
  },
  {
    id: "REQ-2026-094",
    userName: "Nasser Ahmed",
    userPhone: "+966507776601",
    address: "Prince Mohammed Bin Abdulaziz Rd, Riyadh",
    priority: "low",
    status: "completed",
    createdMinutesAgo: 8,
  },
];

const FEED_STATS: FeedStats = {
  incomingRate: 12,
  avgLatencyMs: 145,
  queueCount: 3,
  lastRefreshSeconds: 2,
};

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-bg-card px-3 py-2.5 md:px-4 md:py-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className="text-sm font-semibold text-heading mt-1">{value}</p>
    </div>
  );
}

type RequestCardProps = {
  request: DesignRequest;
  locale: "ar" | "en";
};

function formatRelativeMinutes(minutesAgo: number, locale: "ar" | "en") {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    -minutesAgo,
    "minute",
  );
}

function RequestCard({ request, locale }: RequestCardProps) {
  return (
    <article className="rounded-xl border border-border/70 bg-bg-card px-3 py-3 md:px-4 md:py-3.5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span className="font-semibold text-heading">{request.id}</span>
            <span className="opacity-50">•</span>
            <Clock3 className="h-3.5 w-3.5" />
            <span>{formatRelativeMinutes(request.createdMinutesAgo, locale)}</span>
          </div>

          <p className="text-sm font-semibold text-heading">{request.userName}</p>

          <p className="text-xs text-muted flex items-center gap-1.5" dir="ltr">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{request.userPhone}</span>
          </p>

          <p className="text-xs text-muted flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{request.address}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end md:gap-1.5">
          <StatusBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
      </div>
    </article>
  );
}

export default function RecentRequests() {
  const { t, i18n } = useTranslation("dashboard");
  const shouldReduceMotion = useReducedMotion();
  const locale: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 my-6 md:my-8">
      <section className="col-span-1 lg:col-span-8 bg-bg-card dark:bg-bg-card rounded-lg md:rounded-2xl shadow-card dark:shadow-card overflow-hidden border border-border/60">
        <div className="header flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 p-4 md:p-6 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="font-semibold text-base md:text-lg text-heading dark:text-heading">
              {t("recentRequests.title")}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 text-success px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-success" />
              {t("recentRequests.liveFeed")}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-success bg-success/10 rounded-full px-2.5 py-1 border border-success/20">
              <Radio className="w-3 h-3" />
              {t("recentRequests.socketConnected")}
            </span>
            <Link
              to="/admin/requests"
              className="text-xs cursor-pointer bg-primary text-white px-3 md:px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              {t("recentRequests.viewAll")}
            </Link>
          </div>
        </div>

        <div className="p-4 md:px-6 md:py-4 border-b border-border/70 bg-surface-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            <MetricCard
              label={t("recentRequests.incomingRate")}
              value={t("recentRequests.incomingRateValue", { value: FEED_STATS.incomingRate })}
            />
            <MetricCard
              label={t("recentRequests.avgLatency")}
              value={t("recentRequests.avgLatencyValue", { value: FEED_STATS.avgLatencyMs })}
            />
            <MetricCard
              label={t("recentRequests.eventQueue")}
              value={t("recentRequests.eventQueueValue", { count: FEED_STATS.queueCount })}
            />
          </div>
        </div>

        <motion.div
          className="requests-list p-4 md:px-6 md:py-5 space-y-3 bg-bg-card dark:bg-bg-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants}
        >
          {DESIGN_REQUESTS.map((request) => (
            <motion.div key={request.id} variants={itemVariants}>
              <RequestCard request={request} locale={locale} />
            </motion.div>
          ))}
        </motion.div>

        <div className="px-4 md:px-6 py-3 border-t border-border/70 bg-surface-muted/20">
          <p className="text-xs text-muted flex items-center gap-1.5">
            <TimerReset className="w-3.5 h-3.5" />
            {t("recentRequests.designModeHint")}
          </p>
          <p className="text-xs text-muted/80 mt-1 flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5" />
            {t("recentRequests.lastRefresh", { value: `${FEED_STATS.lastRefreshSeconds}s` })}
          </p>
        </div>
      </section>

      <div className="col-span-1 lg:col-span-4">
        <CriticalRequests />
      </div>
    </div>
  );
}
