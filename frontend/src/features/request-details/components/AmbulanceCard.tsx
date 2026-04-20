import { faTruckMedical, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import { useTranslation } from "react-i18next";

interface AmbulanceCardProps {
  vehicle: string;
  type: string;
  eta: string;
  location: string;
  crew: string[];
}

const AmbulanceCard = ({ vehicle, type, eta, location, crew }: AmbulanceCardProps) => {
  const { t } = useTranslation("requests");
  return (
    <InfoCard title={t("details.ambulance")} icon={<FontAwesomeIcon icon={faTruckMedical} />}>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p style={{ color: "var(--text-muted)" }}>{t("details.vehicle")}</p>
          <p style={{ color: "var(--text-heading)" }} className="font-semibold">
            {vehicle}
          </p>
        </div>
        <div>
          <p style={{ color: "var(--text-muted)" }}>{t("details.type")}</p>
          <p style={{ color: "var(--text-heading)" }} className="font-semibold">
            {type}
          </p>
        </div>
        <div>
          <p style={{ color: "var(--text-muted)" }}>{t("details.eta")}</p>
          <p style={{ color: "var(--success)" }} className="font-semibold">
            {eta}
          </p>
        </div>
      </div>

      <p style={{ color: "var(--text-body)" }} className="text-sm">
        {location}
      </p>

      <div className="flex justify-between items-center">
        <p style={{ color: "var(--text-body)" }} className="text-sm">
          {crew.join(" / ")}
        </p>
        <button
          style={{
            backgroundColor: "var(--surface-soft)",
            color: "var(--text-heading)",
          }}
          className="p-2 rounded-full hover:opacity-80 transition"
        >
          <FontAwesomeIcon icon={faPhone} />
        </button>
      </div>
    </InfoCard>
  );
};

export default AmbulanceCard;
