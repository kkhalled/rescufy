import type { ReactNode } from "react";
import { Activity, RefreshCcw, Stethoscope, Users } from "lucide-react";

import { useTranslation } from "react-i18next";

import { useAuth } from "@/app/provider/AuthContext";

import HospitalAllRequests from "../components/hospital/HospitalAllRequests";

import { useHospitalRequests } from "../hooks/useHospitalRequests";

export default function HospitalRequests() {
  const { t } = useTranslation("requests");

  const { user } = useAuth();

  const { requests, isLoading, isRefreshing, lastSyncedAt, refreshRequests } =
    useHospitalRequests();

  const getStatus = (request: {
    status?: string | null;
    requestStatus?: string | null;
  }) => (request.status || request.requestStatus || "").toLowerCase();

  const pendingCount = requests.filter(
    (request) =>
      getStatus(request) === "pending" || getStatus(request) === "searching",
  ).length;

  const activeCount = requests.filter((request) =>
    [
      "assigned",
      "accepted",
      "ontheway",
      "arrived",
      "pickedup",
      "active",
    ].includes(getStatus(request)),
  ).length;

  const completedCount = requests.filter((request) =>
    ["delivered", "finished", "completed"].includes(getStatus(request)),
  ).length;

  return (
    <section className="page-enter min-h-screen w-full px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-5">
        {/* Header */}
        <header
          className="
            rounded-3xl
            border border-white/[0.05]

            bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_top_left,rgba(239,68,68,0.08),transparent_32%),var(--background-card)]

            px-4 py-5
            sm:px-6 sm:py-6

            shadow-card
          "
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-cyan-400
                "
              >
                Hospital Operations
              </p>

              <h1
                className="
                  mt-2

                  text-2xl font-bold
                  tracking-tight
                  text-heading

                  sm:text-4xl
                "
              >
                {t("pageHeader.title")}
              </h1>

              <p
                className="
                  mt-2
                  max-w-3xl

                  text-sm leading-relaxed
                  text-muted

                  sm:text-base
                "
              >
                {t("hospital.requestsSubtitle")}
              </p>
            </div>

            {/* Live Feed */}
            <div
              className="
                inline-flex items-center gap-2

                self-start

                rounded-full

                border border-emerald-500/15
                bg-emerald-500/8

                px-4 py-2

                text-sm text-emerald-300
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    absolute inline-flex
                    h-full w-full
                    animate-ping

                    rounded-full
                    bg-emerald-400
                    opacity-75
                  "
                />

                <span
                  className="
                    relative inline-flex
                    h-2.5 w-2.5
                    rounded-full
                    bg-emerald-400
                  "
                />
              </span>
              Live SignalR Feed
            </div>
          </div>
        </header>

        {/* Mobile Stats */}
        <section className="xl:hidden">
          <div
            className="
              rounded-3xl
              border border-white/[0.05]

              bg-surface-card/95

              p-4

              shadow-card
            "
          >
            <div className="grid grid-cols-2 gap-3">
              <CompactStat
                icon={<Users className="h-4 w-4" />}
                label="Total"
                value={requests.length}
                tone="primary"
              />

              <CompactStat
                icon={<Activity className="h-4 w-4" />}
                label="Pending"
                value={pendingCount}
                tone="warning"
              />

              <CompactStat
                icon={<RefreshCcw className="h-4 w-4" />}
                label="Active"
                value={activeCount}
                tone="info"
              />

              <CompactStat
                icon={<Stethoscope className="h-4 w-4" />}
                label="Completed"
                value={completedCount}
                tone="success"
              />
            </div>
          </div>
        </section>

        {/* Desktop Stats */}
        <div className="hidden gap-4 xl:grid xl:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Requests"
            value={requests.length}
            tone="primary"
          />

          <StatCard
            icon={<Activity className="h-5 w-5" />}
            label="Pending"
            value={pendingCount}
            tone="warning"
          />

          <StatCard
            icon={<RefreshCcw className="h-5 w-5" />}
            label="Active"
            value={activeCount}
            tone="info"
          />

          <StatCard
            icon={<Stethoscope className="h-5 w-5" />}
            label="Completed"
            value={completedCount}
            tone="success"
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Requests */}
          <HospitalAllRequests
            requests={requests}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            lastSyncedAt={lastSyncedAt}
            onRefresh={refreshRequests}
          />

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div
              className="
                rounded-3xl
                border border-white/[0.05]

                bg-surface-card/95

                p-5

                shadow-card
              "
            >
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.24em]
                  text-cyan-400
                "
              >
                Queue Status
              </p>

              <h2
                className="
                  mt-2
                  text-xl font-semibold
                  text-heading
                "
              >
                {user?.FullName || "Hospital Admin"}
              </h2>

              <p
                className="
                  mt-3
                  text-sm leading-relaxed
                  text-muted
                "
              >
                Requests assigned to this hospital refresh automatically
                whenever SignalR receives request updates.
              </p>

              <div
                className="
                  mt-5

                  rounded-2xl

                  border border-white/[0.05]

                  bg-background-second/40

                  px-4 py-3
                "
              >
                <p className="text-xs text-muted">Last Synchronization</p>

                <p
                  className="
                    mt-1
                    text-sm font-medium
                    text-heading
                  "
                >
                  {lastSyncedAt
                    ? new Date(lastSyncedAt).toLocaleString()
                    : "Waiting for first sync..."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: "primary" | "warning" | "info" | "success";
}) {
  const toneStyles: Record<typeof tone, string> = {
    primary: "bg-cyan-500/10 text-cyan-300",

    warning: "bg-amber-500/10 text-amber-300",

    info: "bg-blue-500/10 text-blue-300",

    success: "bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div
      className="
        rounded-3xl
        border border-white/[0.05]

        bg-surface-card/95

        p-5

        shadow-card
      "
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>

        <div
          className={`
            rounded-xl p-2
            ${toneStyles[tone]}
          `}
        >
          {icon}
        </div>
      </div>

      <p
        className="
          mt-4

          text-3xl font-bold
          tracking-tight
          text-heading
        "
      >
        {value}
      </p>
    </div>
  );
}

function CompactStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: "primary" | "warning" | "info" | "success";
}) {
  const toneStyles: Record<typeof tone, string> = {
    primary: "bg-cyan-500/10 text-cyan-300",

    warning: "bg-amber-500/10 text-amber-300",

    info: "bg-blue-500/10 text-blue-300",

    success: "bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div
      className="
        rounded-2xl
        bg-background-second/40

        p-3
      "
    >
      <div className="flex items-center justify-between">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.08em]
            text-muted
          "
        >
          {label}
        </p>

        <div
          className={`
            rounded-lg p-1.5
            ${toneStyles[tone]}
          `}
        >
          {icon}
        </div>
      </div>

      <p
        className="
          mt-2

          text-2xl font-bold
          text-heading
        "
      >
        {value}
      </p>
    </div>
  );
}
