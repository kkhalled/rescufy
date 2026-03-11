import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import useLanguage from "@/i18n/useLanguage";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  placeholder: string;
  icon?: IconDefinition;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
};

export default function SelectField({
  label,
  placeholder,
  icon,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="text-sm ">
      <label className=" font-medium text-gray-600 block">{label}</label>

      <Select
        dir="auto"
        value={value}
        onValueChange={(value) => {
          onChange(value);
        }}
      >
        <SelectTrigger className="w-full   rounded-md bg-background-second  data-placeholder:text-gray-700   border-gray-200  dark:border-gray-800   dark:text-white  transition">
          <div className="flex items-center gap-3">
            {icon && <FontAwesomeIcon icon={icon} className="text-gray-400" />}
            <SelectValue
              className="placeholder-shown:text-2xl"
              placeholder={placeholder}
            />
          </div>
        </SelectTrigger>

        <SelectContent dir="auto" className=" bg-background-second">
          {options.map((option) => (
            <SelectItem
              dir="auto"
              className="text-heading focus:bg-blue-100 dark:hover:bg-gray-500 dark:text-white"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
