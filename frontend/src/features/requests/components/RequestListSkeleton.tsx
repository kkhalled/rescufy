export function RequestListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-bg-card">
      <div className="animate-pulse divide-y divide-border/70">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="relative flex items-center gap-4 px-4 py-4 md:px-5">
            <span className="absolute inset-y-0 left-0 w-1 rounded-r bg-surface-muted" />

            <div className="w-22 shrink-0 space-y-2">
              <div className="h-3 rounded bg-surface-muted" />
              <div className="h-2.5 w-16 rounded bg-surface-muted" />
            </div>

            <div className="w-34 shrink-0 space-y-2">
              <div className="h-3 rounded bg-surface-muted" />
              <div className="h-2.5 w-20 rounded bg-surface-muted" />
            </div>

            <div className="hidden flex-1 space-y-2 md:block">
              <div className="h-3 w-3/4 rounded bg-surface-muted" />
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
