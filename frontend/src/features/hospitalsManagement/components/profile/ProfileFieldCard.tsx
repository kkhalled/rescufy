import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type ProfileFieldCardProps = {
  label: string;
  value: string;
  icon?: IconDefinition;
  dir?: "ltr" | "rtl" | "auto";
  className?: string;
};

export function ProfileFieldCard({
  label,
  value,
  icon,
  dir = "auto",
  className,
}: ProfileFieldCardProps) {
  return (
    <div className={`rounded-xl border border-border/70 bg-surface-muted/20 p-4 ${className ?? ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p dir={dir} className="mt-2 flex items-center gap-2 text-sm font-semibold text-heading break-all">
        {icon ? <FontAwesomeIcon icon={icon} className="text-muted" /> : null}
        <span>{value}</span>
      </p>
    </div>
  );
}
