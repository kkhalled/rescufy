import { faHospital } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import { useTranslation } from "react-i18next";

interface HospitalCardProps {
  name: string;
  address: string;
  department: string;
  beds: number;
  distance: string;
}

const HospitalCard = ({ name, address, department, beds, distance }: HospitalCardProps) => {
  const { t } = useTranslation("requests");
  return (
    <InfoCard title={t("details.hospital")} icon={<FontAwesomeIcon icon={faHospital} />}>
      <p style={{ color: "var(--text-heading)" }} className="font-semibold">
        {name}
      </p>
      <p style={{ color: "var(--text-muted)" }} className="text-sm">
        {address}
      </p>

      <hr style={{ borderColor: "var(--border-default)" }} className="my-3" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p style={{ color: "var(--text-muted)" }}>{t("details.type")}</p>
          <p style={{ color: "var(--text-heading)" }} className="font-semibold">
            {department}
          </p>
        </div>
        <div>
          <p style={{ color: "var(--text-muted)" }}>{t("details.distance")}</p>
          <p style={{ color: "var(--success)" }} className="font-semibold">
            {beds}
          </p>
        </div>
      </div>

      <div
        style={{ borderColor: "var(--border-default)" }}
        className="mt-3 pt-3 border-t"
      >
        <p style={{ color: "var(--text-body)" }} className="text-sm">
          <span style={{ color: "var(--text-heading)" }} className="font-semibold">
            {distance}
          </span>{" "}
          {t("details.distance")}
        </p>
      </div>
    </InfoCard>
  );
};

export default HospitalCard;
