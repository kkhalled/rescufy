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
import { cn } from "@/shared/ui/cn/cn";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label?: string;
  placeholder?: string;
  icon?: IconDefinition;
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  id?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
};

export default function SelectField({
  label,
  placeholder,
  icon,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  id,
  error,
  containerClassName,
  labelClassName,
  triggerClassName,
  contentClassName,
  itemClassName,
}: SelectFieldProps) {
  const { isRTL } = useLanguage();
  const direction = isRTL ? "rtl" : "ltr";
  const hasLabel = Boolean(label?.trim());

  const hasCurrentValue = options.some((option) => option.value === value);
  const selectedValue = hasCurrentValue ? value : undefined;

  return (
    <div className={cn("text-sm", containerClassName)}>
      {hasLabel ? (
        <label
          htmlFor={id}
          className={cn("mb-1 block text-sm font-medium text-body", labelClassName)}
        >
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
      ) : null}

      <Select dir={direction} value={selectedValue} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(
            "w-full rounded-md border border-border bg-background-second text-heading transition data-placeholder:text-muted",
            error ? "border-danger focus:ring-danger/20" : "focus:ring-primary/30 focus:border-primary",
            triggerClassName,
          )}
        >
          <div className="flex items-center gap-3">
            {icon && <FontAwesomeIcon icon={icon} className="text-gray-400" />}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent
          dir={direction}
          className={cn("bg-background-second", contentClassName)}
        >
          {options.map((option) => (
            <SelectItem
              dir={direction}
              className={cn(
                "text-heading focus:bg-blue-100 dark:hover:bg-gray-500 dark:text-white",
                itemClassName,
              )}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
