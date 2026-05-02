import { BarChart3, ExternalLink } from "lucide-react";

const REPORT_URL =
  "https://app.powerbi.com/reportEmbed?reportId=dd6d782c-e1ad-42d6-b3e4-5b624447fed3&autoAuth=true&ctid=def512e0-feee-407d-be2f-f68c954e75b7&actionBarEnabled=true&reportCopilotInEmbed=true";

export default function Analytics() {
  return (
    <section className="page-enter flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className="relative flex-1 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative flex h-full w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">Analytics Overview</h1>
                <p className="text-sm text-muted">Live operational insights, acceptance rates, and request metrics.</p>
              </div>
            </div>

            <a
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary/50"
              href={REPORT_URL}
              rel="noreferrer"
              target="_blank"
            >
              Open in Power BI
              <ExternalLink className="h-4 w-4" />
            </a>
          </header>

          {/* Iframe Card Container */}
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface-card shadow-card">
            {/* Card Header Strip */}
            <div className="flex items-center justify-between border-b border-border bg-background-second/50 px-5 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-heading">System SuperAdmin Dashboard</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                </span>
                Live Connected
              </div>
            </div>

            {/* Iframe Wrapper - Takes remaining height */}
            <div className="relative flex-1 bg-background">
              <iframe
                title="rescufy-analytics"
                src={REPORT_URL}
                allowFullScreen
                className="absolute inset-0 h-full w-full border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
