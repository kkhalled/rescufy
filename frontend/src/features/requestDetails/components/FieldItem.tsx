interface FieldItemProps {
  label: string;
  value: string;
  dir?: "auto" | "ltr" | "rtl";
}

export default function FieldItem({ label, value, dir = "auto" }: FieldItemProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-muted/25 px-3 py-2.5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-heading break-all" dir={dir}>
        {value}
      </p>
    </div>
  );
}
