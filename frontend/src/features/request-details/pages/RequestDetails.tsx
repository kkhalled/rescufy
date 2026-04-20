import { useParams } from "react-router";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Ambulance,
  Clock3,
  FileText,
  MapPin,
  Phone,
  Route,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";
import Loading from "@/shared/common/Loading";
import ActionButtons from "../components/ActionButtons";
import { useGetRequestById } from "../hooks/useGetRequestById";
import type { RequestAssignment } from "../types/requestDetails.types.ts";

type StatusStyle = {
  key?: string;
  label: string;
  badgeClass: string;
  dotClass: string;
};

const REQUEST_STATUS_STYLE: Record<number, StatusStyle> = {
  0: { key: "pending", label: "Pending", badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35", dotClass: "bg-amber-500" },
  1: { key: "assigned", label: "Assigned", badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/35", dotClass: "bg-blue-500" },
  2: { key: "enRoute", label: "En Route", badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/35", dotClass: "bg-indigo-500" },
  3: { key: "inProgress", label: "In Progress", badgeClass: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/35", dotClass: "bg-cyan-500" },
  4: { key: "dispatched", label: "Dispatched", badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/35", dotClass: "bg-sky-500" },
  5: { key: "completed", label: "Completed", badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35", dotClass: "bg-emerald-500" },
  6: { key: "cancelled", label: "Cancelled", badgeClass: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/35", dotClass: "bg-red-500" },
  7: { key: "closed", label: "Closed", badgeClass: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/35", dotClass: "bg-slate-500" },
};

function formatDateTime(iso: string, locale: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SectionCard({ title, icon, subtitle, children }: { title: string; icon: ReactNode; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-bg-card p-5 shadow-card">
      <div className="mb-4 flex items-start gap-3 border-b border-border pb-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <h3 className="text-base font-semibold text-heading">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldItem({ label, value, dir = "auto" }: { label: string; value: string; dir?: "auto" | "ltr" | "rtl" }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-muted/25 px-3 py-2.5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-heading break-all" dir={dir}>
        {value}
      </p>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: RequestAssignment }) {
  const { t, i18n } = useTranslation("requests");

  return (
    <article className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted">
          {t("details.adminLayout.assignments.assignmentPrefix", { id: assignment.id })}
        </p>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {t("details.adminLayout.assignments.statusCode", { code: assignment.status })}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <FieldItem label={t("details.adminLayout.assignments.ambulancePlate")} value={assignment.ambulancePlate || "-"} />
        <FieldItem label={t("details.adminLayout.assignments.driverName")} value={assignment.driverName || "-"} />
        <FieldItem label={t("details.adminLayout.assignments.hospitalId")} value={assignment.hospitalId == null ? "-" : String(assignment.hospitalId)} />
        <FieldItem label={t("details.adminLayout.assignments.hospitalName")} value={assignment.hospitalName || "-"} />
        <FieldItem
          label={t("details.distance")}
          value={Number.isFinite(assignment.distanceKm) ? `${assignment.distanceKm.toLocaleString(i18n.language, { maximumFractionDigits: 3 })} km` : "-"}
        />
        <FieldItem label={t("details.adminLayout.assignments.assignedAt")} value={formatDateTime(assignment.assignedAt, i18n.language)} />
        <FieldItem label={t("details.adminLayout.assignments.completedAt")} value={assignment.completedAt ? formatDateTime(assignment.completedAt, i18n.language) : "-"} />
      </div>
    </article>
  );
}

export default function RequestDetails() {
  const { t, i18n } = useTranslation("requests");
  const { isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { request, isLoading, fetchRequest } = useGetRequestById();

  useEffect(() => {
    if (id) {
      void fetchRequest(id);
    }
  }, [id, fetchRequest]);

  if (isLoading) {
    return <Loading />;
  }

  if (!request) {
    return (
      <div className="min-h-screen p-6">
        <p className="text-sm text-muted">{t("empty.title")}</p>
      </div>
    );
  }

  const status = REQUEST_STATUS_STYLE[request.requestStatus] ?? {
    label: t("details.adminLayout.statusFallback", { code: request.requestStatus }),
    badgeClass: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/35",
    dotClass: "bg-slate-500",
  };

  const statusLabel = status.key ? t(`status.${status.key}`, status.label) : status.label;
  const aiConfidence = request.aiAnalysis
    ? Math.max(0, Math.min(100, request.aiAnalysis.confidence <= 1 ? Math.round(request.aiAnalysis.confidence * 100) : Math.round(request.aiAnalysis.confidence)))
    : 0;

  const timelineEvents = [
    {
      title: t("details.adminLayout.timeline.requestCreated"),
      time: formatDateTime(request.createdAt, i18n.language),
      description: request.description || t("details.adminLayout.noDescription"),
    },
    ...(request.assignments ?? []).map((assignment) => ({
      title: t("details.adminLayout.timeline.assignmentCreated", { id: assignment.id }),
      time: formatDateTime(assignment.assignedAt, i18n.language),
      description: `${assignment.ambulancePlate} -> ${assignment.hospitalName ?? t("details.adminLayout.noHospital")}`,
    })),
    {
      title: t("details.adminLayout.timeline.requestUpdated"),
      time: formatDateTime(request.updatedAt, i18n.language),
      description: request.comment || t("details.adminLayout.noComment"),
    },
  ];

  const mapHref = `https://www.google.com/maps?q=${request.latitude},${request.longitude}`;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl space-y-6">
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
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.badgeClass}`}>
                <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
                {statusLabel} ({request.requestStatus})
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
            <FieldItem label={t("details.adminLayout.quick.tripReport")} value={request.tripReport ? t("details.adminLayout.tripReportAvailable") : t("details.adminLayout.tripReportNotYet")} />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <SectionCard title={t("details.adminLayout.sections.patientRequest.title")} icon={<UserRound className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.patientRequest.subtitle")}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FieldItem label={t("details.adminLayout.fields.patientName")} value={request.patientName || "-"} />
                <FieldItem label={t("details.adminLayout.fields.patientPhone")} value={request.patientPhone || "-"} dir="ltr" />
                <FieldItem label={t("details.adminLayout.fields.userId")} value={request.userId || "-"} dir="ltr" />
                <FieldItem label={t("details.adminLayout.fields.selfCase")} value={request.isSelfCase ? t("details.adminLayout.yes") : t("details.adminLayout.no")} />
              </div>
            </SectionCard>

            <SectionCard title={t("details.adminLayout.sections.caseDescription.title")} icon={<AlertCircle className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.caseDescription.subtitle")}>
              <div className="space-y-3">
                <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                  <p className="text-xs text-muted">{t("details.description")}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-body">{request.description || "-"}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                  <p className="text-xs text-muted">{t("details.adminLayout.fields.comment")}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-body">{request.comment?.trim() || t("details.adminLayout.noComment")}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title={t("details.aiAnalysis")} icon={<Sparkles className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.ai.subtitle")}>
              {request.aiAnalysis ? (
                <div className="space-y-3">
                  <FieldItem label={t("details.adminLayout.fields.summary")} value={request.aiAnalysis.summary || "-"} />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FieldItem label={t("details.adminLayout.fields.urgency")} value={request.aiAnalysis.urgency || "-"} />
                    <FieldItem label={t("details.adminLayout.fields.condition")} value={request.aiAnalysis.condition || "-"} />
                  </div>

                  <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-muted">{t("details.confidence")}</p>
                      <p className="text-sm font-semibold text-heading">{aiConfidence}%</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${aiConfidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">{t("details.adminLayout.noAi")}</p>
              )}
            </SectionCard>

            <SectionCard title={t("details.adminLayout.sections.tripReport.title")} icon={<FileText className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.tripReport.subtitle")}>
              {request.tripReport ? (
                <pre className="overflow-x-auto rounded-xl border border-border/70 bg-surface-muted/25 p-3 text-xs text-body">
                  {JSON.stringify(request.tripReport, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted">{t("details.adminLayout.noTripReport")}</p>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title={t("details.adminLayout.sections.location.title")} icon={<MapPin className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.location.subtitle")}>
              <div className="space-y-3">
                <FieldItem label={t("details.adminLayout.fields.address")} value={request.address || "-"} />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FieldItem label={t("details.adminLayout.fields.latitude")} value={String(request.latitude)} dir="ltr" />
                  <FieldItem label={t("details.adminLayout.fields.longitude")} value={String(request.longitude)} dir="ltr" />
                </div>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                >
                  <Route className="h-4 w-4" />
                  {t("details.adminLayout.openInMaps")}
                </a>
              </div>
            </SectionCard>

            <SectionCard title={t("details.adminLayout.sections.assignments.title")} icon={<Ambulance className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.assignments.subtitle")}>
              {request.assignments.length > 0 ? (
                <div className="space-y-3">
                  {request.assignments.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">{t("details.adminLayout.noAssignments")}</p>
              )}
            </SectionCard>

            <SectionCard title={t("details.timeline")} icon={<Clock3 className="h-4 w-4" />} subtitle={t("details.adminLayout.sections.timeline.subtitle")}>
              <div className="space-y-3">
                {timelineEvents.map((event, index) => (
                  <div key={`${event.title}-${index}`} className={`flex gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      {index < timelineEvents.length - 1 ? <span className="mt-1 h-full w-0.5 bg-border" /> : null}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-semibold text-heading">{event.title}</p>
                      <p className="text-xs text-muted">{event.time}</p>
                      <p className="mt-1 text-xs text-body">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <section className="rounded-2xl border border-border/80 bg-bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-heading">
            <Phone className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">{t("details.actions")}</h3>
          </div>
          <ActionButtons />
        </section>
      </div>
    </div>
  );
}
