export type MetricCardProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function MetricCard({ label, value, valueClassName }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-2 text-sm font-semibold ${valueClassName ?? "text-heading"}`}>{value}</p>
    </div>
  );
}
