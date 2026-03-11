import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
  /** Override the subtitle under the Rescufy logo */
  subtitle?: string;
}

/**
 * Shared dark SOC-style layout for all auth pages
 * (SignIn, ForgotPassword, ResetPassword, etc.)
 */
export default function AuthPageLayout({ children, subtitle }: AuthPageLayoutProps) {
  const { t } = useTranslation("auth");

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#060a12] relative overflow-hidden select-none">

      {/* ── Layer 1: Animated grid ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="login-grid-animated absolute -inset-24 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Layer 2: Ambient glow orbs ── */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-130 h-130 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(101,77,255,0.08) 0%, rgba(101,77,255,0.02) 50%, transparent 70%)",
        }}
      />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full pointer-events-none blur-[100px] bg-primary/4" />
      <div className="absolute top-10 right-1/4 w-60 h-60 rounded-full pointer-events-none blur-[80px] bg-blue-500/3" />

      {/* ── Layer 3: Scanner line ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 w-full h-px opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(101,77,255,0.6), transparent)",
            animation: "login-scanner 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-50">
        <div className="login-fade-up flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-[0.15em]">
              {t("signIn.systemOperational", "All Systems Operational")}
            </span>
          </div>
        </div>
        <div className="login-fade-up">
          <LanguageSwitcher showLabel />
        </div>
      </div>

      {/* ══════════ Main Content ══════════ */}
      <div className="relative z-10 w-full max-w-120 px-4 sm:px-5">

        {/* ── System Identity ── */}
        <div className="text-center mb-4 sm:mb-4 login-fade-up">
          <div className="relative inline-flex items-center justify-center mb-4 sm:mb-6">
            {/* Outer pulse ring */}
            <div
              className="absolute w-20 h-20 rounded-2xl border border-primary/10"
              style={{ animation: "login-pulse-ring 3s ease-in-out infinite" }}
            />
            {/* Icon container */}
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center border border-white/8 overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(101,77,255,0.15), rgba(101,77,255,0.03))",
              }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(101,77,255,0.3), transparent 60%)",
                }}
              />
              <svg
                className="relative w-7 h-7 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Rescufy</h1>
          <p className="text-[12px] sm:text-[13px] text-slate-500 mt-1.5 sm:mt-2 font-medium tracking-wide">
            {subtitle ?? t("signIn.controlPanel", "Emergency Control Panel")}
          </p>
        </div>

        {/* ── Page Content (form) ── */}
        <div className="login-fade-up-delay-1">
          {children}
        </div>

        {/* ── Separator ── */}
        <div className="login-fade-up-delay-2 mt-5 sm:mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/4" />
          <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <div className="flex-1 h-px bg-white/4" />
        </div>

        {/* ── Footer ── */}
        <div className="login-fade-up-delay-3 mt-4 sm:mt-6 text-center space-y-2">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {t("signIn.secureSession", "256-bit encrypted session · Authorized personnel only")}
          </p>
          <p className="text-[10px] text-slate-700/60 tracking-wide">v2.4.0</p>
        </div>
      </div>

      {/* ── Bottom bar decoration ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/10 to-transparent" />
    </div>
  );
}
