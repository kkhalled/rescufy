import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import { useTranslation } from "react-i18next";

interface PatientCardProps {
  name: string;
  age: number | null;
  gender: string;
  blood: string;
  conditions: string[];
  history: string;
}

const PatientCard = ({ name, age, gender, blood, conditions, history }: PatientCardProps) => {
  const { t } = useTranslation("requests");
  const genderKey = typeof gender === 'string' ? gender.toLowerCase() : '';
  const displayGender = genderKey ? t(`details.gender.${genderKey}`, { defaultValue: gender }) : gender;
  const ageLabel = age == null ? "-" : `${age}yo`;

  return (
    <InfoCard title={t("details.patient")} icon={<FontAwesomeIcon icon={faUser} />}>
      <p style={{ color: "var(--text-heading)" }} className="font-semibold">
        {name}
      </p>
      <p style={{ color: "var(--text-muted)" }} className="text-sm">
        {ageLabel} • {displayGender} • {blood}
      </p>

      <div className="flex flex-wrap gap-2">
        {conditions.map((c) => (
          <span
            key={c}
            style={{
              backgroundColor: "rgba(230, 57, 70, 0.1)",
              color: "var(--danger)",
            }}
            className="text-xs px-2 py-1 rounded-full font-medium"
          >
            {c}
          </span>
        ))}
      </div>

      <p style={{ color: "var(--text-body)" }} className="text-sm">
        {history}
      </p>
    </InfoCard>
  );
};

export default PatientCard;
