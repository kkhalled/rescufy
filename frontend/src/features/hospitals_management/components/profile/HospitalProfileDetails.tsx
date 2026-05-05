import { useTranslation } from "react-i18next";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import type { Hospital } from "../../types/hospitals.types";
import { ProfileFieldCard } from "./ProfileFieldCard";

const panelClass = "rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm";

type Props = { hospital: Hospital; formattedStartingPrice: string };

export function HospitalProfileDetails({ hospital, formattedStartingPrice }: Props) {
  const { t } = useTranslation("hospitals");

  return (
    <article className={`${panelClass} xl:col-span-7`}>
      <h3 className="text-sm font-semibold text-heading mb-4">Profile Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileFieldCard
          label={t("adminProfile.address")}
          value={hospital.address?.trim() || "-"}
          className="md:col-span-2"
        />
        <ProfileFieldCard
          label={t("adminProfile.contactPhone")}
          value={hospital.contactPhone?.trim() || "-"}
          icon={faPhone}
          dir="ltr"
        />
        <ProfileFieldCard
          label={t("adminProfile.coordinates")}
          value={`${hospital.latitude.toFixed(6)}, ${hospital.longitude.toFixed(6)}`}
        />
        <ProfileFieldCard
          label={t("adminProfile.startingPrice")}
          value={formattedStartingPrice}
        />
      </div>
    </article>
  );
}
