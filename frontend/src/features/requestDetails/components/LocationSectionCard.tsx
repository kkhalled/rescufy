import { MapPin, Route } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard";
import FieldItem from "./FieldItem";

interface LocationSectionCardProps {
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationSectionCard({ address, latitude, longitude }: LocationSectionCardProps) {
  const { t } = useTranslation("requests");
  const mapHref = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <SectionCard
      title={t("details.adminLayout.sections.location.title")}
      icon={<MapPin className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.location.subtitle")}
    >
      <div className="space-y-3">
        <FieldItem label={t("details.adminLayout.fields.address")} value={address || "-"} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FieldItem label={t("details.adminLayout.fields.latitude")} value={String(latitude)} dir="ltr" />
          <FieldItem label={t("details.adminLayout.fields.longitude")} value={String(longitude)} dir="ltr" />
        </div>
        <a
          href={mapHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
        >
          <Route className="h-4 w-4" />
          {t("details.adminLayout.openInMaps")}
        </a>
      </div>
    </SectionCard>
  );
}
