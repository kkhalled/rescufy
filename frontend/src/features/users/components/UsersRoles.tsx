import SelectField from "@/shared/ui/SelectFiled";
import { useTranslation } from "react-i18next";

export default function UsersRoles({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("users");

  const AllRoles = [
    { label: t("roles.all"), value: "all" },
    { label: t("roles.Admin"), value: "Admin" },
    { label: t("roles.HospitalAdmin"), value: "HospitalAdmin" },
    { label: t("roles.Paramedic"), value: "Paramedic" },
    { label: t("roles.AmbulanceDriver"), value: "AmbulanceDriver" },
  ];

  return (
    <>
      <SelectField
        label=""
        placeholder={t("roles.all")}
        value={value}
        onChange={onChange}
        options={AllRoles}
      />
    </>
  );
}
