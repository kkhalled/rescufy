import SearchBar from "@/shared/common/SearchBar";
import SelectField from "@/shared/ui/SelectFiled";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

type RequestsStateMenuProps = {
  value: string;
  onChange: (value: string) => void;
};
export default function RequestsStateMenu({
  value,
  onChange,
}: RequestsStateMenuProps) {
  const AllStatuses = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Assigned", value: "assigned" },
    { label: "En Route", value: "enRoute" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

    
  return (
    <>
      <SelectField
        label=""
        placeholder="All Statuses"
        value={value} // ✅ FROM PARENT
        onChange={onChange} // ✅ EMIT TO PARENT
        options={AllStatuses}
      />
    </>
  );
}
