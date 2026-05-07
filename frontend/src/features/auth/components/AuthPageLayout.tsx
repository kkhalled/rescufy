import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { pageTransition } from "@/animation/motion";

interface AuthPageLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function AuthPageLayout({
  children,
  subtitle,
}: AuthPageLayoutProps) {
  const { t } = useTranslation("auth");

  return (
    <div
      className="
        relative isolate min-h-screen overflow-hidden

        bg-[#07111f]

        text-white

        dark:bg-[#07111f]

        light:bg-[#f3f7fb]
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Atmospheric Layer */}
        <div
          className="
            absolute inset-0

            bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.92),transparent_60%)]

            dark:block
          "
        />

        {/* Grid */}
        <div
          className="
            absolute inset-0

            opacity-[0.035]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute left-[10%] top-[5%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/8 blur-[140px]" />

        <div className="absolute right-[5%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-indigo-500/8 blur-[130px]" />

        <div className="absolute bottom-[-10%] left-[35%] h-[22rem] w-[22rem] rounded-full bg-slate-700/30 blur-[120px]" />

        {/* Light Mode */}
        <div
          className="
            absolute inset-0 hidden

            dark:hidden

            bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_22%),linear-gradient(to_bottom,#f8fbff,#eef4fa)]
          "
        />
      </div>

      <motion.main
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition as any}
        className="
          relative z-10

          mx-auto

          flex min-h-screen
          w-full max-w-7xl

          items-center
          justify-center

          px-4 py-6

          sm:px-6

          lg:px-10
        "
      >
        <div
          className="
            grid w-full items-center gap-10

            lg:grid-cols-[1.05fr_0.85fr]
          "
        >
          {/* LEFT */}
          <section
            className="
              hidden

              lg:flex
              lg:justify-center
            "
          >
            <div className="w-full max-w-[34rem]">
              {/* Status */}
              <div
                className="
                  inline-flex items-center gap-2

                  rounded-full

                  border border-emerald-400/15

                  bg-emerald-400/10

                  px-3 py-1
                "
              >
                <span className="h-2 w-2 rounded-full bg-emerald-300" />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]

                    text-emerald-200
                  "
                >
                  {t(
                    "signIn.systemOperational",
                    "All Systems Operational"
                  )}
                </span>
              </div>

              {/* Heading */}
              <h1
                className="
                  mt-5

                  max-w-md

                  text-4xl
                  font-bold

                  leading-[0.95]
                  tracking-tight

                  text-white
                "
              >
                AI-Powered Emergency Coordination
              </h1>

              {/* Description */}
              <p
                className="
                  mt-4

                  max-w-md

                  text-xs
                  leading-relaxed

                  text-slate-400
                "
              >
                Live ambulance dispatch, hospital coordination,
                and intelligent routing from one operational
                system.
              </p>

              {/* Operations Preview */}
              <div
                className="
                  relative

                  mt-6

                  overflow-hidden

                  rounded-2xl

                  border border-white/[0.06]

                  bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.95))]

                  p-4

                  shadow-[0_20px_80px_-50px_rgba(34,211,238,0.25)]
                "
              >
                {/* Grid */}
                <div
                  className="
                    pointer-events-none
                    absolute inset-0

                    opacity-[0.04]
                  "
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]

                        text-cyan-200
                      "
                    >
                      Live Operations
                    </p>

                    <span
                      className="
                        rounded-full

                        border border-cyan-400/15

                        bg-cyan-400/10

                        px-2 py-1

                        text-[9px]
                        font-semibold
                        uppercase

                        tracking-[0.1em]

                        text-cyan-200
                      "
                    >
                      SignalR Live
                    </span>
                  </div>

                  {/* Network */}
                  <div
                    className="
                      relative

                      h-44

                      overflow-hidden

                      rounded-xl

                      border border-white/[0.05]

                      bg-[#07101f]
                    "
                  >
                    {/* Lines */}
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M18 28 L42 18 L72 36"
                        stroke="rgba(34,211,238,0.65)"
                        strokeWidth="0.6"
                        fill="none"
                      />

                      <path
                        d="M42 18 L56 66 L26 72"
                        stroke="rgba(139,92,246,0.55)"
                        strokeWidth="0.6"
                        fill="none"
                      />

                      <path
                        d="M26 72 L56 66 L72 36"
                        stroke="rgba(59,130,246,0.55)"
                        strokeWidth="0.6"
                        fill="none"
                      />
                    </svg>

                    {/* Nodes */}
                    <div className="absolute left-[18%] top-[28%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />

                    <div className="absolute left-[42%] top-[18%] h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.85)]" />

                    <div className="absolute left-[72%] top-[36%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.85)]" />

                    <div className="absolute left-[56%] top-[66%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />

                    <div className="absolute left-[26%] top-[72%] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.85)]" />

                    {/* Tags */}
                    <div className="absolute left-[14%] top-[48%] rounded-md border border-white/10 bg-slate-900/80 px-2 py-1 text-[9px] text-slate-200">
                      Unit A-12 ETA 3.8m
                    </div>

                    <div className="absolute left-[60%] top-[54%] rounded-md border border-white/10 bg-slate-900/80 px-2 py-1 text-[9px] text-slate-200">
                      Hospital Intake Open
                    </div>

                    <div className="absolute left-[45%] top-[42%] rounded-md border border-cyan-400/15 bg-cyan-400/10 px-2 py-1 text-[9px] font-semibold text-cyan-200">
                      AI ROUTING
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Active Ambulances",
                        value: "24",
                        color: "text-cyan-200",
                      },
                      {
                        label: "Hospitals Connected",
                        value: "12",
                        color: "text-blue-200",
                      },
                      {
                        label: "Avg Response",
                        value: "4.2m",
                        color: "text-emerald-200",
                      },
                      {
                        label: "AI Dispatch",
                        value: "Online",
                        color: "text-violet-200",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="
                          rounded-xl

                          border border-white/[0.05]

                          bg-white/[0.025]

                          px-3 py-2
                        "
                      >
                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.12em]

                            text-slate-500
                          "
                        >
                          {item.label}
                        </p>

                        <p
                          className={`mt-1 text-base font-bold ${item.color}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Encrypted",
                  "AI Assisted",
                  "Live Dispatch",
                  "SignalR",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="
                      rounded-full

                      border border-white/[0.06]

                      bg-white/[0.03]

                      px-3 py-1

                      text-[10px]

                      text-slate-300
                    "
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section
            className="
              mx-auto

              flex w-full max-w-sm
              flex-col
              justify-center
            "
          >
            {/* Logo */}
            <div className="mb-4 mt-10 text-center">
              <h2 className="text-3xl font-bold text-white">
                Rescufy
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {subtitle ??
                  t(
                    "signIn.controlPanel",
                    "Emergency Control Panel"
                  )}
              </p>
            </div>

            {/* Auth Card */}
            <div
              className="
                relative overflow-hidden
              "
            >
              <div className="relative z-10">
                {children}
              </div>
            </div>

            {/* Footer */}
            <p
              className="
                mt-4

                text-center

                text-[10px]

                text-slate-600
              "
            >
              v2.4.0
            </p>
          </section>
        </div>
      </motion.main>
    </div>
  );
}