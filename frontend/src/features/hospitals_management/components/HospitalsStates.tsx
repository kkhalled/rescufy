import SelectField from "@/shared/ui/SelectFiled";

export default function HospitalsStates({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const AllStates = [
    { label: "All States", value: "all" },
    { label: "Critical", value: "CRITICAL" },
    { label: "Full", value: "FULL" },
    { label: "Busy", value: "BUSY" },
    { label: "Normal", value: "NORMAL" },
  ];

  return (
    <>
      <SelectField
        label=""
        placeholder="All States"
        value={value}
        onChange={onChange}
        options={AllStates}
      />
    </>
  );
}
