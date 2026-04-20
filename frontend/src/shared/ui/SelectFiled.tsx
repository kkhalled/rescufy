import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui/select";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "@radix-ui/react-select";
// import { useState } from "react";

export default function SelectFiled({
  label,
  id,
  role,
}: {
  label: string;
  id: string;
  role: string;
}) {
  // const [selectValue, setSelectValue] = useState<string>("");

  // setSelectItemArr(selectItems.toString());
  return (
    <div className="text-sm mb-4">
      <label className="mb-1 font-medium text-gray-600 block">{label}</label>

      <Select   >
        <SelectTrigger 
          className="w-full pl-4 pr-4 py-4 rounded-lg bg-gray-100 dark:bg-background-second border border-gray-200 dark:border-gray-300/10 text-gray-900 dark:text-white
            placeholder:text-gray-400 
            focus:outline-none focus:ring-1 focus:ring-gray-300/50 dark:focus:ring-gray-300/50
            transition"
        >
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon className="text-gray-400" icon={faBriefcase} />
            <SelectValue
              className="text-gray-400 font-medium"
              placeholder={id}
            />
          </div>
        </SelectTrigger>
        <SelectContent className="">
          {/* map{selectItemArr.split(",").map((item , index) => (
            <SelectItem key={index} value={item}>{item}</SelectItem>
          ))} */}
          <SelectItem id="role" value="admin" className="text-gray-500">
            Admin
          </SelectItem>
          <SelectItem id="role" value="Dispatcher">
            Dispatcher
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
