import SelectField from "@/shared/ui/SelectField";
import { useTranslation } from "react-i18next";

export default function HospitalsStates({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation('hospitals');

  const AllStates = [
    { label: t('filters.allStates'), value: "all" },
    { label: t('status.critical'), value: "CRITICAL" },
    { label: t('status.full'), value: "FULL" },
    { label: t('status.busy'), value: "BUSY" },
    { label: t('status.normal'), value: "NORMAL" },
  ];

  return (
    <>
      <SelectField
        label=""
        placeholder={t('filters.allStates')}
        value={value}
        onChange={onChange}
        options={AllStates}
      />
    </>
  );
}
