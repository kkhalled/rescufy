import { FileText, Pencil, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TripReport } from "../types/requestDetails.types";
import SectionCard from "./SectionCard";
import FieldItem from "./FieldItem";
import { useAuth } from "@/app/provider/AuthContext";

function formatDateTime(iso: string, locale: string): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TripReportSectionCardProps {
  tripReport: TripReport | null;
  onOpenModal: () => void;
}

export default function TripReportSectionCard({ tripReport, onOpenModal }: TripReportSectionCardProps) {
  const { t, i18n } = useTranslation("requests");

  // get user role from context
  const { user } = useAuth();

  if (user?.Role !== "hospitaladmin") {
    return null;
  }

  return (
    <SectionCard
      title={t("details.adminLayout.sections.tripReport.title")}
      icon={<FileText className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.tripReport.subtitle")}
    >
      {tripReport ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FieldItem
              label={t("details.adminLayout.fields.admissionTime", "Admission Time")}
              value={formatDateTime(tripReport.admissionTime, i18n.language)}
            />
            <FieldItem
              label={t("details.adminLayout.fields.dischargeTime", "Discharge Time")}
              value={formatDateTime(tripReport.dischargeTime, i18n.language)}
            />
          </div>
          <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
            <p className="text-xs text-muted">
              {t("details.adminLayout.fields.medicalProcedures", "Medical Procedures")}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-body">
              {tripReport.medicalProcedures || "-"}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
          >
            <Pencil className="h-3 w-3" />
            Edit Report
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted">{t("details.adminLayout.noTripReport")}</p>
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
          >
            <Plus className="h-3 w-3" />
            Add Report
          </button>
        </div>
      )}
    </SectionCard>
  );
}
