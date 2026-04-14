import { BrainCircuit, Route, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export type DecisionInsight = {
  id: string;
  requestId: string;
  selectedAmbulance: string;
  etaMinutes: number;
  distanceKm: number;
  confidence: number;
  alternativesCount: number;
  reasoning: string;
};

type SystemDecisionInsightsProps = {
  insights: DecisionInsight[];
};

export function SystemDecisionInsights({ insights }: SystemDecisionInsightsProps) {
  const { t } = useTranslation("dashboard");

  return (
    <section className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card">
      <div className="border-b border-border/70 pb-4">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-heading">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <h3 className="text-lg">{t("decisionInsights.title")}</h3>
        </div>
        <p className="mt-1 text-sm text-muted">{t("decisionInsights.subtitle")}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-xl border border-border/70 bg-surface-muted/30 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                {t("decisionInsights.request", { id: insight.requestId })}
              </p>
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("decisionInsights.confidenceLabel", { value: insight.confidence.toFixed(0) })}
              </p>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-body">
              <p>
                <span className="text-muted">{t("decisionInsights.selectedAmbulance")}: </span>
                <span className="font-semibold text-heading">{insight.selectedAmbulance}</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <Route className="h-3.5 w-3.5 text-info" />
                <span>
                  {t("decisionInsights.etaDistance", {
                    eta: insight.etaMinutes,
                    distance: insight.distanceKm.toFixed(1),
                  })}
                </span>
              </p>
              <p>
                <span className="text-muted">{t("decisionInsights.alternatives")}: </span>
                <span className="font-semibold text-heading">{insight.alternativesCount}</span>
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-border/70 bg-bg-card px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t("decisionInsights.reasoning")}</p>
              <p className="mt-1 text-xs text-body">{insight.reasoning}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
