export function HospitalRequestsSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-215 animate-pulse divide-y divide-border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="relative flex flex-col gap-3 bg-card px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-6">
            <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-surface-muted" />

            <div className="w-28 shrink-0 space-y-2">
              <div className="h-3 rounded bg-surface-muted" />
              <div className="h-2.5 w-16 rounded bg-surface-muted" />
            </div>

            <div className="w-40 shrink-0 space-y-2">
              <div className="h-3 rounded bg-surface-muted" />
              <div className="h-2.5 w-24 rounded bg-surface-muted" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="h-3 w-4/5 rounded bg-surface-muted" />
              <div className="h-2.5 w-1/2 rounded bg-surface-muted" />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="h-6 w-16 rounded-full bg-surface-muted" />
              <div className="h-6 w-18 rounded-full bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
