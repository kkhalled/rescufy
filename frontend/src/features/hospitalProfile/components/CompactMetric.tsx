
export default function CompactMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?:
    | "default"
    | "success"
    | "warning"
    | "danger";
}) {
  const tones = {
    default: "text-heading",
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-red-300",
  };

  return (
    <div
      className="
        rounded-2xl
        border border-white/[0.05]
        bg-background-second/40
        px-4 py-3
      "
    >
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.08em]
          text-muted
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-2
          text-lg font-bold
          ${tones[tone]}
        `}
      >
        {value}
      </p>
    </div>
  );
}
