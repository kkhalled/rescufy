import { Ambulance } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RequestAssignment } from "../types/requestDetails.types";
import SectionCard from "./SectionCard";
import FieldItem from "./FieldItem";

function formatDateTime(iso: string, locale: string): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AssignmentItem({ assignment }: { assignment: RequestAssignment }) {
  const { t, i18n } = useTranslation("requests");

  return (
    <article className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted">
          {t("details.adminLayout.assignments.assignmentPrefix", { id: assignment.id })}
        </p>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {assignment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <FieldItem label={t("details.adminLayout.assignments.ambulancePlate")} value={assignment.ambulancePlate || "-"} />
        <FieldItem label={t("details.adminLayout.assignments.driverName")} value={assignment.driverName || "-"} />
        <FieldItem
          label={t("details.adminLayout.assignments.hospitalId")}
          value={assignment.hospitalId == null ? "-" : String(assignment.hospitalId)}
        />
        <FieldItem label={t("details.adminLayout.assignments.hospitalName")} value={assignment.hospitalName || "-"} />
        <FieldItem
          label={t("details.distance")}
          value={Number.isFinite(assignment.distanceKm)
            ? `${assignment.distanceKm.toLocaleString(i18n.language, { maximumFractionDigits: 3 })} km`
            : "-"}
        />
        <FieldItem
          label={t("details.adminLayout.assignments.assignedAt")}
          value={formatDateTime(assignment.assignedAt, i18n.language)}
        />
        <FieldItem
          label={t("details.adminLayout.assignments.completedAt")}
          value={assignment.completedAt ? formatDateTime(assignment.completedAt, i18n.language) : "-"}
        />
      </div>
    </article>
  );
}

interface AssignmentsSectionCardProps {
  assignments: RequestAssignment[];
}

export default function AssignmentsSectionCard({ assignments }: AssignmentsSectionCardProps) {
  const { t } = useTranslation("requests");

  return (
    <SectionCard
      title={t("details.adminLayout.sections.assignments.title")}
      icon={<Ambulance className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.assignments.subtitle")}
    >
      {assignments.length > 0 ? (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <AssignmentItem key={assignment.id} assignment={assignment} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{t("details.adminLayout.noAssignments")}</p>
      )}
    </SectionCard>
  );
}
