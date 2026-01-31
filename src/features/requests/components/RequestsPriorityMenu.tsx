import SelectField from "@/shared/ui/SelectFiled";

export default function RequestsPriorityMenu({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const AllPriorities = [
    { label: "All priorities", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  
  return (
    <>
      <SelectField
        label=""
        placeholder="All priorities"
        value={value}
        onChange={onChange}
        options={AllPriorities}
      />
    </>
  );
}
