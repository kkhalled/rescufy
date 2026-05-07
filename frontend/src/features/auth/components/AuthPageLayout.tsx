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
    <div className="relative min-h-screen overflow-hidden bg-[#060a12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="login-grid-animated absolute -inset-24 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-500/8 blur-[130px]" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            {t("signIn.systemOperational", "All Systems Operational")}
          </span>
        </div>
        <LanguageSwitcher showLabel />
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-8 px-4 pb-8 pt-2 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Rescufy Platform
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
              {t("signIn.controlPanel", "Emergency Control Panel")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              {t(
                "signIn.secureSession",
                "256-bit encrypted session · Authorized personnel only",
              )}
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Monitoring
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  Live dispatch and incident control in one workspace.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Security
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  Role-based access with secure authenticated sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-5 text-center lg:hidden">
            <h2 className="text-2xl font-bold text-white">Rescufy</h2>
            <p className="mt-1 text-sm text-slate-400">
              {subtitle ?? t("signIn.controlPanel", "Emergency Control Panel")}
            </p>
          </div>

          <div className="mb-4 hidden text-center lg:block">
            <h2 className="text-2xl font-bold text-white">Rescufy</h2>
            <p className="mt-1 text-sm text-slate-400">
              {subtitle ?? t("signIn.controlPanel", "Emergency Control Panel")}
            </p>
          </div>

          {children}

          <p className="mt-5 text-center text-[11px] text-slate-600">
            v2.4.0
          </p>
        </section>
      </main>
    </div>
  );
}
