import { useParams } from "react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PatientCard from "../components/PatientCard";
import AmbulanceCard from "../components/AmbulanceCard";
import DescriptionCard from "../components/DescriptionCard";
import HospitalCard from "../components/HospitalCard";
import TimelineCard from "../components/TimelineCard";
import AIAnalysisCard from "../components/AIAnalysisCard";
import ActionButtons from "../components/ActionButtons";
import Loading from "@/shared/common/Loading";
import { useGetRequestById } from "../hooks/useGetRequestById";
import type { RequestDetail } from "../types/requestDetails.types";

/* ── helpers ── */
const statusMap: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: "Pending",    color: "var(--warning)",  bg: "rgba(255, 183, 3, 0.1)" },
  1: { label: "Assigned",   color: "var(--info, #3b82f6)",     bg: "rgba(59, 130, 246, 0.1)" },
  2: { label: "InProgress", color: "var(--brand-primary)", bg: "rgba(100, 77, 255, 0.1)" },
  3: { label: "Completed",  color: "var(--success)",  bg: "rgba(42, 157, 143, 0.1)" },
  4: { label: "Cancelled",  color: "var(--danger)",   bg: "rgba(230, 57, 70, 0.1)" },
};

function buildConditions(req: RequestDetail): string[] {
  const profile = req.applicationUser?.userProfile;
  if (!profile) return [];
  return [
    ...profile.chronicDiseases.filter((d) => d.isActive).map((d) => d.name),
    ...profile.allergies.map((a) => a.name),
  ];
}

function buildMedicalHistory(req: RequestDetail): string {
  const profile = req.applicationUser?.userProfile;
  if (!profile) return "—";
  const parts: string[] = [];
  if (profile.medicalNotes) parts.push(profile.medicalNotes);
  if (profile.medications.length) {
    parts.push(
      profile.medications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`).join(", "),
    );
  }
  if (profile.pastSurgeries.length) {
    parts.push(
      profile.pastSurgeries.map((s) => `${s.name} (${s.year})`).join(", "),
    );
  }
  return parts.join(". ") || "—";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function RequestDetails() {
  const { t } = useTranslation("requests");
  const { id } = useParams<{ id: string }>();
  const { request, isLoading, fetchRequest } = useGetRequestById();

  useEffect(() => {
    if (id) fetchRequest(id);
  }, [id]);

  if (isLoading || !request) return <Loading />;

  const assignment = request.assignments?.[0] ?? null;
  const ambulance = assignment?.ambulance ?? null;
  const hospital = assignment?.hospital ?? null;
  const ai = request.aiAnalysis;
  const status = statusMap[request.requestStatus] ?? statusMap[0];

  const timelineEvents = request.auditLogs
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((log) => ({
      title: log.action,
      time: formatTime(log.timestamp),
      description: log.details,
    }));

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
      }}
      className="min-h-screen p-4 md:p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1
            style={{ color: "var(--text-heading)" }}
            className="text-3xl font-bold"
          >
            {t("details.title")}
          </h1>
          <span
            style={{
              backgroundColor: status.bg,
              color: status.color,
            }}
            className="text-sm font-semibold px-4 py-2 rounded-full"
          >
            {t(`details.status.${status.label.toLowerCase()}`, status.label)}
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }}>
          {t("details.requestIdLabel")}: #{request.id}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <PatientCard
          name={request.applicationUser?.name ?? "—"}
          age={null}
          gender={"—"}
          blood={request.applicationUser?.userProfile?.bloodType ?? "—"}
          conditions={buildConditions(request)}
          history={buildMedicalHistory(request)}
        />

        <AmbulanceCard
          vehicle={ambulance?.name ?? "—"}
          type={ambulance?.vehicleInfo ?? "—"}
          eta={assignment?.etaMinutes != null ? `${assignment.etaMinutes} min` : "—"}
          location={request.address ?? "—"}
          crew={ambulance ? [
            `${t("details.driver")}: ${ambulance.driver?.name ?? ambulance.driverPhone}`,
          ] : []}
        />

        <HospitalCard
          name={hospital?.name ?? "—"}
          address={hospital?.address ?? "—"}
          department={hospital ? `${hospital.availableBeds}/${hospital.bedCapacity}` : "—"}
          beds={hospital?.availableBeds ?? 0}
          distance={assignment ? `${assignment.hospitalDistanceKm} km` : "—"}
        />
      </div>

      {/* Extended Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DescriptionCard
          description={request.description}
          additionalNotes={assignment?.notes || null}
        />

        {ai && (
          <AIAnalysisCard
            diagnosis={ai.summary}
            confidence={Math.round(ai.confidence * 100)}
          />
        )}
      </div>

      {/* Timeline */}
      {timelineEvents.length > 0 && (
        <div className="mb-6">
          <TimelineCard events={timelineEvents} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6">
        <ActionButtons />
      </div>
    </div>
  );
}
