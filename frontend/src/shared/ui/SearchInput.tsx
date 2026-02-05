import { Search } from "lucide-react";

type SearchInputProps = {
  value: string ;
  onSearchChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  placeholder = "Search anything",
  value,
  onSearchChange,
}: SearchInputProps) {
  return (
    <div className="flex bg-background-second px-3 shadow border border-gray-200 dark:border-gray-800 rounded-md items-center">
      <Search size={16} className="text-gray-500" />

      <input
        value={value }
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1
          px-2 md:px-3
          py-2
          text-xs md:text-sm
          placeholder:text-gray-700
          dark:placeholder:text-gray-300
          text-heading
          outline-none
        "
      />
    </div>
  );
}
