import SelectField from "@/shared/ui/SelectField";
import { useTranslation } from "react-i18next";

export default function RequestsPriorityMenu({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useTranslation('requests');

  const AllPriorities = [
    { label: t('priority.all'), value: "all" },
    { label: t('priority.critical'), value: "critical" },
    { label: t('priority.high'), value: "high" },
    { label: t('priority.medium'), value: "medium" },
    { label: t('priority.low'), value: "low" },
  ];


  return (
    <>
      <SelectField
        label=""
        placeholder={t('priority.all')}
        value={value}
        onChange={onChange}
        options={AllPriorities}
      />
    </>
  );
}
