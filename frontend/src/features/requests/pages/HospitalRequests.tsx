import type { ReactNode } from "react";
import { Activity, RefreshCcw, Stethoscope, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/provider/AuthContext";
import HospitalAllRequests from "../components/hospital/HospitalAllRequests";
import { useHospitalRequests } from "../hooks/useHospitalRequests";

export default function HospitalRequests() {
  const { t } = useTranslation("requests");
  const { user } = useAuth();
  const { requests, isLoading, isRefreshing, lastSyncedAt, refreshRequests } = useHospitalRequests();

  const pendingCount = requests.filter((request) => request.status === "Pending").length;
  const activeCount = requests.filter((request) => request.status === "Assigned" || request.status === "Accepted" || request.status === "OnTheWay" || request.status === "Arrived" || request.status === "PickedUp").length;
  const completedCount = requests.filter((request) => request.status === "Delivered" || request.status === "Finished").length;

  return (
    <section className="page-enter min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">
        <header className="rounded-3xl border border-border bg-[radial-gradient(circle_at_top_right,rgba(101,77,255,0.16),transparent_42%),radial-gradient(circle_at_top_left,rgba(230,57,70,0.10),transparent_35%),var(--background-card)] px-5 py-6 shadow-card sm:px-6 sm:py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Hospital Operations</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                {t("pageHeader.title")}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">
                {t("hospital.requestsSubtitle")}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface-card px-4 py-2 text-sm text-heading shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              Live SignalR feed
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Requests" value={requests.length} tone="primary" />
          <StatCard icon={<Activity className="h-5 w-5" />} label="Pending" value={pendingCount} tone="warning" />
          <StatCard icon={<RefreshCcw className="h-5 w-5" />} label="Active" value={activeCount} tone="info" />
          <StatCard icon={<Stethoscope className="h-5 w-5" />} label="Completed" value={completedCount} tone="success" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <HospitalAllRequests
            requests={requests}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            lastSyncedAt={lastSyncedAt}
            onRefresh={refreshRequests}
          />

          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Queue Status</p>
              <h2 className="mt-2 text-xl font-semibold text-heading">{user?.FullName || "Hospital Admin"}</h2>
              <p className="mt-2 text-sm text-muted">
                Requests assigned to this hospital refresh automatically when SignalR receives new request or update events.
              </p>
              <div className="mt-4 rounded-xl border border-border bg-background-second/60 px-4 py-3 text-sm text-heading">
                {lastSyncedAt ? `Last sync: ${new Date(lastSyncedAt).toLocaleString()}` : "Waiting for the first sync..."}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card">
              <p className="text-sm font-semibold text-heading">What this page does</p>
              <ul className="mt-3 space-y-3 text-sm text-muted">
                <li>Shows only requests for the authenticated hospital.</li>
                <li>Refreshes automatically from the `/api/Hospital/my-requests` endpoint.</li>
                <li>Re-pulls data when the SignalR hub announces new or updated requests.</li>
              </ul>
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
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <div className={`rounded-xl p-2 ${toneStyles[tone]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-heading">{value}</p>
    </div>
  );
}
