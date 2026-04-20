import SelectField from "@/shared/ui/SelectField";
import { useTranslation } from "react-i18next";

export default function AmbulancesStates({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation('ambulances');

  const AllStates = [
    { label: t('status.all'), value: "all" },
    { label: t('status.available'), value: "AVAILABLE" },
    { label: t('status.inTransit'), value: "IN_TRANSIT" },
    { label: t('status.busy'), value: "BUSY" },
    { label: t('status.maintenance'), value: "MAINTENANCE" },
  ];

  return (
    <>
      <SelectField
        label=""
        placeholder={t('status.all')}
        value={value}
        onChange={onChange}
        options={AllStates}
      />
    </>
  );
}
