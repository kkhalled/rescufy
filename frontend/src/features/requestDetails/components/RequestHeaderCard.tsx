import { useTranslation } from "react-i18next";
import type { RequestDetail } from "../types/requestDetails.types";
import FieldItem from "./FieldItem";

// ─── Status Style Map ───────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { badgeClass: string; dotClass: string }> = {
  Pending:   { badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35",     dotClass: "bg-amber-500" },
  Assigned:  { badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/35",         dotClass: "bg-blue-500" },
  Accepted:  { badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/35", dotClass: "bg-indigo-500" },
  OnTheWay:  { badgeClass: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/35",         dotClass: "bg-cyan-500" },
  Arrived:   { badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/35",             dotClass: "bg-sky-500" },
  PickedUp:  { badgeClass: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/35", dotClass: "bg-violet-500" },
  Delivered: { badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35", dotClass: "bg-emerald-500" },
  Finished:  { badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35", dotClass: "bg-emerald-500" },
  Canceled:  { badgeClass: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/35",             dotClass: "bg-red-500" },
};


interface RequestHeaderCardProps {
  request: RequestDetail;
  isRTL: boolean;
}

export default function RequestHeaderCard({ request, isRTL }: RequestHeaderCardProps) {
  const { t } = useTranslation("requests");

  const statusStyle = STATUS_STYLE[request.requestStatus] ?? {
    badgeClass: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/35",
    dotClass: "bg-slate-500",
  };

  const aiConfidence = request.aiAnalysis
    ? Math.max(0, Math.min(100, request.aiAnalysis.confidence <= 1
        ? Math.round(request.aiAnalysis.confidence * 100)
        : Math.round(request.aiAnalysis.confidence)))
    : 0;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-bg-card p-5 shadow-card md:p-6">
      <div className={`pointer-events-none absolute -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl ${isRTL ? "-left-16" : "-right-16"}`} />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading md:text-3xl">{t("details.title")}</h1>
          <p className="mt-1 text-sm text-muted">
            {t("details.requestIdLabel")}: #{request.id}
          </p>
          <p className="mt-2 text-sm text-body">{request.address || "-"}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle.badgeClass}`}>
            <span className={`h-2 w-2 rounded-full ${statusStyle.dotClass}`} />
            {request.requestStatus}
          </span>
          <span className="rounded-full border border-border bg-surface-muted/40 px-3 py-1.5 text-xs font-semibold text-heading">
            {request.isSelfCase ? t("filters.selfCase") : t("filters.forOthers")}
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <FieldItem label={t("details.adminLayout.quick.peopleAffected")} value={String(request.numberOfPeopleAffected)} />
        <FieldItem label={t("details.adminLayout.quick.assignments")} value={String(request.assignments.length)} />
        <FieldItem label={t("details.adminLayout.quick.aiConfidence")} value={request.aiAnalysis ? `${aiConfidence}%` : "-"} />
        <FieldItem
          label={t("details.adminLayout.quick.tripReport")}
          value={request.tripReport ? t("details.adminLayout.tripReportAvailable") : t("details.adminLayout.tripReportNotYet")}
        />
      </div>
    </section>
  );
}
