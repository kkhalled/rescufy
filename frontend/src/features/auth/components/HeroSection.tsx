import { motion } from "framer-motion";

import TacticalMap from "./TacticalMap";
import StatusBadge from "./StatusBadge";
import MetricsGrid from "./MetricsGrid";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  return (
    <section className="hidden lg:block w-8/10">
      <StatusBadge />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: EASE,
        }}
        className="
          mt-6

          max-w-lg

          text-[2rem]
          font-black

          leading-[0.94]
          tracking-[-0.05em]

          text-white
        "
      >
        AI Emergency
        <br />
        <span className="text-slate-500">Dispatch &</span>
        <br />
        Coordination
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.18,
          ease: EASE,
        }}
        className="
          mt-5

          max-w-sm

          text-[13px]
          leading-[1.8]

          text-slate-500
        "
      >
        Real-time fleet routing, intelligent hospital coordination, and live
        emergency dispatch systems.
      </motion.p>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.25,
          ease: EASE,
        }}
        className="
          mt-8

          overflow-hidden

          rounded-[24px]

          border border-white/[0.05]

          bg-white/[0.02]

          p-4
        "
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]

              text-slate-500
            "
          >
            Tactical Dispatch
          </span>

          <div className="flex items-center gap-1.5">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-cyan-400"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            <span className="text-[9px] font-mono text-slate-600">LIVE</span>
          </div>
        </div>

        <div className="h-[260px]">
          <TacticalMap />
        </div>

        <MetricsGrid />
      </motion.div>
    </section>
  );
}
