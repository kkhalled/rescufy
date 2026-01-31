import type { ReactNode } from "react";
import SearchInput from "../ui/SearchInput";

type searchProps = {
  children: ReactNode;
  value: string ;
    onSearchChange: (value: string) => void;
};

export default function SearchBar({ children, value , onSearchChange }: searchProps) {
  return (
    <>
      <div className="bg-bg-card py-4 px-8 grid grid-cols-2 items-center  gap-8  rounded-lg shadow-card">
        <div className="  ">
          <SearchInput value={value}  onSearchChange={ onSearchChange}  />
        </div>

        <div className="">
          <div className="flex *:grow gap-4">{children}</div>
        </div>
      </div>
    </>
  );
}
