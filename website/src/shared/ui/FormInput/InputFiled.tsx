import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputFiled({ label, id, icon, placeholder, type } : { label: string; id: string; icon: any; placeholder: string; type: string }) {
  return (
    <div className=" text-sm mb-4">
      {/* Label */}
      <label
        htmlFor={id}
        className=" mb-1  font-medium text-gray-600 "
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon */}
        <FontAwesomeIcon
          icon={icon}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 "
        />

        {/* Input */}
        <input
          type={type}
          name={id}
          id={id}
          placeholder={placeholder}
          className="
            w-full pl-11 pr-4 py-3 rounded-lg
            bg-gray-100 
            dark:bg-background-second
            
            border border-gray-200 dark:border-gray-300/10
            placeholder:text-gray-400 
            focus:outline-none focus:ring-1
            focus:ring-gray-300/50 dark:focus:ring-gray-300/50
          "
        />
      </div>
    </div>
  );
}
