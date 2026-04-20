import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PatientCard from "../components/PatientCard";
import AmbulanceCard from "../components/AmbulanceCard";
import DescriptionCard from "../components/DescriptionCard";
import HospitalCard from "../components/HospitalCard";
import TimelineCard from "../components/TimelineCard";
import AIAnalysisCard from "../components/AIAnalysisCard";
import HospitalReportModal from "../components/HospitalReportModal";

export default function HospitalRequestDetails() {
  const { t } = useTranslation("requests");
  const { id } = useParams<{ id: string }>();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sample data - in a real application, this would come from an API
  const requestData = {
    id: id || "REQ-2025-001",
    patientName: "Ahmed Al-Rashid",
    age: 45,
    gender: "Male",
    bloodType: "O+",
    conditions: ["Chest Pain", "Shortness of Breath"],
    medicalHistory:
      "Hypertension, Type 2 Diabetes. Currently on Lisinopril and Metformin",
    description:
      "Patient reported sudden onset of chest pain and shortness of breath while at work. Pain is 8/10 intensity. No trauma. Patient is conscious and responsive.",
    additionalNotes:
      "Patient appears anxious. Has history of panic attacks. Wife is accompanying the patient.",
    ambulanceVehicle: "AMB-101",
    ambulanceType: "Advanced Life Support",
    eta: "3 mins",
    ambulanceLocation: "Heading to King Fahd Road junction",
    ambulanceCrew: ["Driver: Mohammed", "Paramedic: Fatima"],
    hospitalName: "King Fahd Medical City",
    hospitalAddress: "Riyadh, Saudi Arabia",
    department: "Cardiology",
    availableBeds: 3,
    distance: "2.5 km",
    diagnosis: "Likely acute coronary syndrome with anxiety component",
    confidence: 85,
    timeline: [
      {
        title: t("details.timelineEvents.requestReceived.title"),
        time: "14:05",
        description: t("details.timelineEvents.requestReceived.desc"),
      },
      {
        title: t("details.timelineEvents.ambulanceDispatched.title"),
        time: "14:07",
        description: t("details.timelineEvents.ambulanceDispatched.desc"),
      },
      {
        title: t("details.timelineEvents.hospitalNotified.title"),
        time: "14:08",
        description: t("details.timelineEvents.hospitalNotified.desc"),
      },
      {
        title: t("details.timelineEvents.enRoute.title"),
        time: "14:12",
        description: t("details.timelineEvents.enRoute.desc"),
      },
    ],
  };

  return (
    <div
      style={{ backgroundColor: "var(--background)" }}
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
              backgroundColor: "rgba(230, 57, 70, 0.1)",
              color: "var(--danger)",
            }}
            className="text-sm font-semibold px-4 py-2 rounded-full"
          >
            {t("details.critical")}
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }}>
          {t("details.requestIdLabel")}: {requestData.id}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <PatientCard
          name={requestData.patientName}
          age={requestData.age}
          gender={requestData.gender}
          blood={requestData.bloodType}
          conditions={requestData.conditions}
          history={requestData.medicalHistory}
        />

        <AmbulanceCard
          vehicle={requestData.ambulanceVehicle}
          type={requestData.ambulanceType}
          eta={requestData.eta}
          location={requestData.ambulanceLocation}
          crew={requestData.ambulanceCrew}
        />

        <HospitalCard
          name={requestData.hospitalName}
          address={requestData.hospitalAddress}
          department={requestData.department}
          beds={requestData.availableBeds}
          distance={requestData.distance}
        />
      </div>

      {/* Extended Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DescriptionCard
          description={requestData.description}
          additionalNotes={requestData.additionalNotes}
        />

        <AIAnalysisCard
          diagnosis={requestData.diagnosis}
          confidence={requestData.confidence}
        />
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <TimelineCard events={requestData.timeline} />
      </div>

      {/* Hospital Admin Actions */}
      <div className="mb-6 rounded-xl border border-border bg-bg-card p-4 shadow-card">
        <p className="mb-3 text-sm text-muted">
          {t("details.hospitalReportHint", "Submit final report after patient handoff")}
        </p>
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          {t("details.submitHospitalReport", "Submit Hospital Report")}
        </button>
      </div>

      <HospitalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        requestId={String(id || requestData.id)}
      />
    </div>
  );
}
