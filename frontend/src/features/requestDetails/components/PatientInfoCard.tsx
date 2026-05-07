import { UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Patient, NamedItem } from "../types/requestDetails.types";
import SectionCard from "./SectionCard";
import FieldItem from "./FieldItem";

function TagList({ items, emptyLabel }: { items: NamedItem[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted">{emptyLabel}</p>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item.id}
          className="rounded-full border border-border/70 bg-surface-muted/40 px-2.5 py-1 text-xs font-medium text-heading"
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}

interface PatientInfoCardProps {
  patientName: string;
  patientPhone: string;
  userId: string;
  isSelfCase: boolean;
  patient: Patient | null;
}

export default function PatientInfoCard({ patientName, patientPhone, userId, isSelfCase, patient }: PatientInfoCardProps) {
  const { t } = useTranslation("requests");

  return (
    <SectionCard
      title={t("details.adminLayout.sections.patientRequest.title")}
      icon={<UserRound className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.patientRequest.subtitle")}
    >
      <div className="space-y-4">
        {/* Basic info */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FieldItem label={t("details.adminLayout.fields.patientName")} value={patientName || "-"} />
          <FieldItem label={t("details.adminLayout.fields.patientPhone")} value={patientPhone || "-"} dir="ltr" />
          <FieldItem label={t("details.adminLayout.fields.userId")} value={userId || "-"} dir="ltr" />
          <FieldItem
            label={t("details.adminLayout.fields.selfCase")}
            value={isSelfCase ? t("details.adminLayout.yes") : t("details.adminLayout.no")}
          />
        </div>

        {/* Patient account details */}
        {patient && (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldItem label={t("details.adminLayout.fields.patientEmail", "Email")} value={patient.email || "-"} dir="ltr" />
              <FieldItem label={t("details.adminLayout.fields.patientId", "Patient ID")} value={patient.id || "-"} dir="ltr" />
            </div>

            {/* Profile */}
            {patient.profile && (
              <>
                <div className="my-1 border-t border-border/60" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t("details.adminLayout.sections.patientProfile", "Medical Profile")}
                </p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <FieldItem label={t("details.adminLayout.fields.bloodType", "Blood Type")} value={patient.profile.bloodType || "-"} />
                  <FieldItem
                    label={t("details.adminLayout.fields.weight", "Weight")}
                    value={patient.profile.weightKg ? `${patient.profile.weightKg} kg` : "-"}
                  />
                  <FieldItem
                    label={t("details.adminLayout.fields.height", "Height")}
                    value={patient.profile.heightCm ? `${patient.profile.heightCm} cm` : "-"}
                  />
                  <FieldItem
                    label={t("details.adminLayout.fields.pregnancy", "Pregnancy")}
                    value={patient.profile.pregnancyStatus ? t("details.adminLayout.yes") : t("details.adminLayout.no")}
                  />
                </div>

                {patient.profile.medicalNotes && patient.profile.medicalNotes !== "-" && (
                  <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                    <p className="text-xs text-muted">{t("details.adminLayout.fields.medicalNotes", "Medical Notes")}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-body">{patient.profile.medicalNotes}</p>
                  </div>
                )}

                {/* Lists */}
                {patient.profile.chronicDiseases.length > 0 && (
                  <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                    <p className="mb-2 text-xs text-muted">{t("details.adminLayout.fields.chronicDiseases", "Chronic Diseases")}</p>
                    <TagList items={patient.profile.chronicDiseases} emptyLabel="-" />
                  </div>
                )}

                {patient.profile.allergies.length > 0 && (
                  <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                    <p className="mb-2 text-xs text-muted">{t("details.adminLayout.fields.allergies", "Allergies")}</p>
                    <TagList items={patient.profile.allergies} emptyLabel="-" />
                  </div>
                )}

                {patient.profile.medications.length > 0 && (
                  <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                    <p className="mb-2 text-xs text-muted">{t("details.adminLayout.fields.medications", "Medications")}</p>
                    <TagList items={patient.profile.medications} emptyLabel="-" />
                  </div>
                )}

                {patient.profile.pastSurgeries.length > 0 && (
                  <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
                    <p className="mb-2 text-xs text-muted">{t("details.adminLayout.fields.pastSurgeries", "Past Surgeries")}</p>
                    <TagList items={patient.profile.pastSurgeries} emptyLabel="-" />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </SectionCard>
  );
}
