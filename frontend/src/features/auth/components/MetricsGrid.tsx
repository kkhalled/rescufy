const metrics = [
  {
    value: "24",
    label: "Units",
    accent: "text-cyan-400",
  },
  {
    value: "12",
    label: "Hospitals",
    accent: "text-indigo-400",
  },
  {
    value: "3.8m",
    label: "Response",
    accent: "text-emerald-400",
  },
  {
    value: "99.7%",
    label: "AI Uptime",
    accent: "text-violet-400",
  },
];

export default function MetricsGrid() {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {metrics.map((item) => (
        <div
          key={item.label}
          className="
            rounded-xl

            border border-slate-200/80

            bg-white/2

            dark:border-white/4
            dark:bg-white/2

            px-3 py-2.5
          "
        >
          <p
            className={`
              text-base
              font-black

              ${item.accent}
            `}
          >
            {item.value}
          </p>

          <p
            className="
              mt-1

              text-[8px]
              uppercase
              tracking-[0.12em]

              text-slate-600 dark:text-slate-600
            "
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
