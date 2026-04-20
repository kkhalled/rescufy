import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import { useTranslation } from "react-i18next";

interface DescriptionCardProps {
  description: string;
  additionalNotes?: string | null;
}

const DescriptionCard = ({ description, additionalNotes }: DescriptionCardProps) => {
  const { t } = useTranslation("requests");
  return (
    <InfoCard title={t("details.description")} icon={<FontAwesomeIcon icon={faClipboard} />}>
      <p
        style={{ color: "var(--text-body)" }}
        className="text-sm whitespace-pre-wrap"
      >
        {description}
      </p>
      {additionalNotes && (
        <div
          style={{
            backgroundColor: "rgba(100, 77, 255, 0.05)",
            borderColor: "rgba(100, 77, 255, 0.2)",
          }}
          className="mt-3 p-3 rounded-lg border"
        >
          <p
            style={{ color: "var(--brand-primary)" }}
            className="text-xs font-semibold mb-1"
          >
            {t("details.additionalNotes")}
          </p>
          <p
            style={{ color: "var(--text-body)" }}
            className="text-xs"
          >
            {additionalNotes}
          </p>
        </div>
      )}
    </InfoCard>
  );
};

export default DescriptionCard;
