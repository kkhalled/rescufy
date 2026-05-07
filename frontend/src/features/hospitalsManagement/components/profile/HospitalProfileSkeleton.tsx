import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const panelClass = "rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm";

type HospitalProfileSkeletonProps = {
  title: string;
  subtitle: string;
  backToList: string;
};

export function HospitalProfileSkeleton({ title, subtitle, backToList }: HospitalProfileSkeletonProps) {
  return (
    <section className="w-full xl:px-12 py-6">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>

        <Link
          to="/admin/hospitals_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {backToList}
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <article className={`${panelClass} xl:col-span-8 animate-pulse`}>
          <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-surface-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-surface-muted" />
                <div className="h-5 w-52 rounded bg-surface-muted" />
              </div>
            </div>
            <div className="h-6 w-24 rounded-full bg-surface-muted" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4 md:col-span-2">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-4/5 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="h-10 w-44 rounded-lg border border-border/70 bg-surface-muted" />
          </div>
        </article>

        <aside className={`${panelClass} xl:col-span-4 animate-pulse`}>
          <div className="h-4 w-28 rounded bg-surface-muted" />
          <div className="mt-4 space-y-3">
            {[28, 24, 24].map((w, i) => (
              <div key={i} className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
                <div className="h-3 w-24 rounded bg-surface-muted" />
                <div className={`mt-2 h-4 w-${w} rounded bg-surface-muted`} />
              </div>
            ))}
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-surface-muted" />
                <div className="h-3 w-10 rounded bg-surface-muted" />
              </div>
              <div className="h-2 w-full rounded-full bg-surface-muted" />
            </div>
          </div>
          <div className="mt-5 space-y-3 border-t border-border pt-5">
            {[40, 40, 24].map((w, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-28 rounded bg-surface-muted" />
                <div className={`h-4 w-${w} rounded bg-surface-muted`} />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
