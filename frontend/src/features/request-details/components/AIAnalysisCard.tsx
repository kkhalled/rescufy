import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import { useTranslation } from "react-i18next";

interface AIAnalysisCardProps {
  diagnosis: string;
  confidence: number;
}

const AIAnalysisCard = ({ diagnosis, confidence }: AIAnalysisCardProps) => {
  const { t } = useTranslation("requests");
  return (
    <InfoCard title={t("details.aiAnalysis")} icon={<FontAwesomeIcon icon={faBrain} />}>
      <p style={{ color: "var(--text-heading)" }} className="font-medium">
        {diagnosis}
      </p>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--text-body)" }}>{t("details.confidence")}</span>
          <span style={{ color: "var(--success)" }} className="font-semibold">
            {confidence}%
          </span>
        </div>

        <div
          style={{
            backgroundColor: "var(--surface-soft)",
          }}
          className="h-2 rounded-full overflow-hidden"
        >
          <div
            style={{
              height: "100%",
              backgroundColor: "var(--success)",
              width: `${confidence}%`,
            }}
          />
        </div>
      </div>
    </InfoCard>
  );
};

export default AIAnalysisCard;
