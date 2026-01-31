import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputFiled({
  label,
  id,
  name,
  icon,
  placeholder,
  type,
  value,
  onBlur,
  onChange,
  error,
}: {
  label: string;
  id: string;
  name: string;
  icon: any;
  placeholder: string;
  type: string;
  value?: string;
  onBlur?: any;
  onChange?: any;
  error?: string;
}) {
  return (
    <div className=" text-sm mb-4">
      {/* Label */}
      <label htmlFor={id} className=" mb-1  font-medium text-gray-600 ">
        {label}
      </label>
      <div className="relative">
        {/* Input wrapper */}
        <div>
          {/* Icon */}
          <FontAwesomeIcon
            icon={icon}
            className="absolute left-4 top-1/2 -translate-y-1/3 text-gray-400 "
          />

          {/* Input */}
          <input
            type={type}
            name={name}
            id={id}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            className="
            w-full pl-11 pr-4 py-3 rounded-lg
            bg-gray-100 
            dark:bg-background-second
            text-gray-900 dark:text-gray-100
            border border-gray-200 dark:border-gray-300/10
            placeholder:text-gray-400 
            focus:outline-none focus:ring-1
            focus:ring-gray-300/50 dark:focus:ring-gray-300/50
          "
          />
          
        </div>
        
      </div>
      {error && <p className="mt-2 ml-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
