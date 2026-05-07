import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background-second/95 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-2xl flex flex-wrap items-center justify-between gap-3 px-10 py-3 text-sm">

        {/* Left — brand + nav */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Animated brand dot */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.65)]" />
            </div>
            <span className="text-[13.5px] font-semibold text-heading">Rescufy</span>
          </div>

          <div className="h-3.5 w-px bg-border/50" />

          {/* Nav links */}
          <nav className="flex items-center gap-4 text-muted">
            <Link to="/admin" className="transition hover:text-primary">Dashboard</Link>
            <Link to="/admin/requests" className="transition hover:text-primary">Requests</Link>
            <Link to="/admin/analytics" className="transition hover:text-primary">Analytics</Link>
          </nav>
        </div>

        {/* Right — status pill + copyright */}
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2.5 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            All systems operational
          </div>

          <span className="text-xs text-muted">© 2026 Rescufy</span>
        </div>

      </div>
    </footer>
  );
}