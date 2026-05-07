import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard";

interface CaseDescriptionCardProps {
  description: string;
  comment: string | null;
}

export default function CaseDescriptionCard({ description, comment }: CaseDescriptionCardProps) {
  const { t } = useTranslation("requests");

  return (
    <SectionCard
      title={t("details.adminLayout.sections.caseDescription.title")}
      icon={<AlertCircle className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.caseDescription.subtitle")}
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
          <p className="text-xs text-muted">{t("details.description")}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-body">{description || "-"}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-surface-muted/25 p-3">
          <p className="text-xs text-muted">{t("details.adminLayout.fields.comment")}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-body">
            {comment?.trim() || t("details.adminLayout.noComment")}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
