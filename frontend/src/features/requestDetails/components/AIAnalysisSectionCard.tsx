import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RequestAiAnalysis } from "../types/requestDetails.types";
import SectionCard from "./SectionCard";
import FieldItem from "./FieldItem";

interface AIAnalysisSectionCardProps {
  aiAnalysis: RequestAiAnalysis | null;
}

export default function AIAnalysisSectionCard({ aiAnalysis }: AIAnalysisSectionCardProps) {
  const { t } = useTranslation("requests");

  const aiConfidence = aiAnalysis
    ? Math.max(0, Math.min(100, aiAnalysis.confidence <= 1
        ? Math.round(aiAnalysis.confidence * 100)
        : Math.round(aiAnalysis.confidence)))
    : 0;

  return (
    <SectionCard
      title={t("details.aiAnalysis")}
      icon={<Sparkles className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.ai.subtitle")}
    >
      {aiAnalysis ? (
        <div className="space-y-3">
          <FieldItem label={t("details.adminLayout.fields.summary")} value={aiAnalysis.summary || "-"} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FieldItem label={t("details.adminLayout.fields.urgency")} value={aiAnalysis.urgency || "-"} />
            <FieldItem label={t("details.adminLayout.fields.condition")} value={aiAnalysis.condition || "-"} />
            <FieldItem label={t("details.adminLayout.fields.severity", "Severity")} value={aiAnalysis.severity || "-"} />
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
  );
}
