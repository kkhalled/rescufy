import type { ReactNode } from "react";
import SearchInput from "../ui/SearchInput";

type searchProps = {
  children: ReactNode;
  value: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  placeholder,
  children,
  value,
  onSearchChange,
}: searchProps) {
  return (
    <>
      <div className="bg-bg-card py-4 px-8 flex items-center justify-between space-x-4  rounded-lg shadow-card">
        <div className=" w-1/2">
          <SearchInput value={value} onSearchChange={onSearchChange} placeholder={placeholder} />
        </div>
 
    {/* filter props */}
        {children}
      </div>
    </>
  );
}
