import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";
import Loading from "@/shared/common/Loading";
import { useGetRequestById } from "../hooks/useGetRequestById";
import HospitalReportModal from "../components/HospitalReportModal";

// ─── Section Components ──────────────────────────────────────────────────────
import RequestHeaderCard from "../components/RequestHeaderCard";
import PatientInfoCard from "../components/PatientInfoCard";
import CaseDescriptionCard from "../components/CaseDescriptionCard";
import AIAnalysisSectionCard from "../components/AIAnalysisSectionCard";
import TripReportSectionCard from "../components/TripReportSectionCard";
import LocationSectionCard from "../components/LocationSectionCard";
import AssignmentsSectionCard from "../components/AssignmentsSectionCard";
import TimelineSectionCard from "../components/TimelineSectionCard";

// ─── Helper ──────────────────────────────────────────────────────────────────
function formatDateTime(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HospitalRequestDetails() {
  const { t, i18n } = useTranslation("requests");
  const { isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { request, isLoading, fetchRequest } = useGetRequestById();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  // Build timeline events from the request data
  const timelineEvents = [
    {
      title: t("details.adminLayout.timeline.requestCreated"),
      time: formatDateTime(request.createdAt, i18n.language),
      description: request.description || t("details.adminLayout.noDescription"),
    },
    ...(request.assignments ?? []).map((assignment) => ({
      title: t("details.adminLayout.timeline.assignmentCreated", { id: assignment.id }),
      time: formatDateTime(assignment.assignedAt, i18n.language),
      description: `${assignment.ambulancePlate} → ${assignment.hospitalName ?? t("details.adminLayout.noHospital")}`,
    })),
    {
      title: t("details.adminLayout.timeline.requestUpdated"),
      time: formatDateTime(request.updatedAt, i18n.language),
      description: request.comment || t("details.adminLayout.noComment"),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Hero / Header ──────────────────────────────────────── */}
        <RequestHeaderCard request={request} isRTL={isRTL} />

        {/* ── Main Two-Column Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">

          {/* Left column */}
          <div className="space-y-6">
            <PatientInfoCard
              patientName={request.patientName}
              patientPhone={request.patientPhone}
              userId={request.userId}
              isSelfCase={request.isSelfCase}
              patient={request.patient}
            />

            <CaseDescriptionCard
              description={request.description}
              comment={request.comment}
            />

            <AIAnalysisSectionCard aiAnalysis={request.aiAnalysis} />

            <TripReportSectionCard tripReport={request.tripReport} onOpenModal={() => setIsReportModalOpen(true)} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <LocationSectionCard
              address={request.address}
              latitude={request.latitude}
              longitude={request.longitude}
            />

            <AssignmentsSectionCard assignments={request.assignments} />

            <TimelineSectionCard events={timelineEvents} />
          </div>
        </div>

        {/* ── Hospital Report Submission ───────────────────────── */}
        <section className="rounded-2xl border border-border/80 bg-bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-heading">
            <Phone className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">{t("details.actions")}</h3>
          </div>
          <p className="mb-4 text-sm text-muted">
            {t("details.hospitalReportHint", "Submit final report after patient handoff")}
          </p>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            {t("details.submitHospitalReport", "Submit Hospital Report")}
          </button>
        </section>

      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <HospitalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        requestId={request.id}
        hospitalId={request.assignments?.[0]?.hospitalId ?? null}
        existingReport={request.tripReport}
        onSuccess={() => { if (id) void fetchRequest(id); }}
      />
    </div>
  );
}
