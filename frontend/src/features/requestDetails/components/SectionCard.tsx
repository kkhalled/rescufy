import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  subtitle?: string;
  children: ReactNode;
}

export default function SectionCard({ title, icon, subtitle, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-border/80 bg-bg-card p-5 shadow-card">
      <div className="mb-4 flex items-start gap-3 border-b border-border pb-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <h3 className="text-base font-semibold text-heading">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
