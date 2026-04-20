import SelectField from "@/shared/ui/SelectField";
import { useTranslation } from "react-i18next";

type RequestsStateMenuProps = {
  value: string;
  onChange: (value: string) => void;
};
export default function RequestsStateMenu({
  value,
  onChange,
}: RequestsStateMenuProps) {
  const { t } = useTranslation('requests');

  const AllStatuses = [
    { label: t('status.all'), value: "all" },
    { label: t('status.pending'), value: "pending" },
    { label: t('status.assigned'), value: "assigned" },
    { label: t('status.enRoute'), value: "enRoute" },
    { label: t('status.completed'), value: "completed" },
    { label: t('status.cancelled'), value: "cancelled" },
  ];


  return (
    <>
      <SelectField
        label=""
        placeholder={t('status.all')}
        value={value} // ✅ FROM PARENT
        onChange={onChange} // ✅ EMIT TO PARENT
        options={AllStatuses}
      />
    </>
  );
}
