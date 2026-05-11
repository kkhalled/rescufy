import { motion } from "framer-motion";

export default function TacticalMap() {
  return (
    <div
      className="
        relative h-full w-full overflow-hidden rounded-2xl

        border border-slate-200/80

        bg-slate-100/90

        dark:border-white/5
        dark:bg-[#070d16]
      "
    >
      {/* Ambient */}
      <div className="absolute inset-0">
        {/* Emergency glow */}
        <div className="absolute left-[10%] top-[62%] h-44 w-44 rounded-full bg-red-500/8 blur-3xl" />

        {/* Hospital glow */}
        <div className="absolute right-[8%] top-[12%] h-40 w-40 rounded-full bg-emerald-500/6 blur-3xl" />

        {/* AI glow */}
        <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Minimal Roads */}
        <g opacity="0.14">
          <path
            d="M0 50 H100"
            stroke="rgba(148,163,184,0.45)"
            strokeWidth="0.4"
          />

          <path
            d="M52 0 V100"
            stroke="rgba(148,163,184,0.45)"
            strokeWidth="0.4"
          />

          <path
            d="M0 18 Q30 18 50 30 T100 28"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth="0.4"
            fill="none"
          />

          <path
            d="M0 74 Q20 68 36 72 T70 68 T100 72"
            stroke="rgba(148,163,184,0.28)"
            strokeWidth="0.35"
            fill="none"
          />
        </g>

        {/* Route Glow */}
        <path
          d="M18 72 C28 58 52 42 82 24"
          stroke="rgba(34,211,238,0.22)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Main Route */}
        <motion.path
          d="M18 72 C28 58 52 42 82 24"
          stroke="#22d3ee"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(34,211,238,0.45))",
          }}
        />

        {/* Secondary Route */}
        <motion.path
          d="M18 72 C32 74 48 72 66 64"
          stroke="rgba(129,140,248,0.45)"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />

        {/* Moving Signal */}
        <motion.circle
          r="2.2"
          fill="#22d3ee"
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            offsetPath: "path('M18 72 C28 58 52 42 82 24')",
            filter: "drop-shadow(0 0 6px #22d3ee)",
          }}
        />

        {/* Emergency Pulse */}
        <g>
          <motion.circle
            cx="18"
            cy="72"
            r="6"
            stroke="#ef4444"
            strokeWidth="0.4"
            fill="none"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0.1, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            style={{
              transformOrigin: "18% 72%",
            }}
          />

          <circle
            cx="18"
            cy="72"
            r="2.6"
            fill="#ef4444"
            style={{
              filter: "drop-shadow(0 0 6px rgba(239,68,68,0.7))",
            }}
          />
        </g>

        {/* Hospital */}
        <g>
          <motion.circle
            cx="82"
            cy="24"
            r="5"
            stroke="#34d399"
            strokeWidth="0.4"
            fill="none"
            animate={{
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <rect
            x="79"
            y="21"
            width="6"
            height="6"
            rx="1"
            fill="rgba(52,211,153,0.12)"
            stroke="#34d399"
            strokeWidth="0.5"
          />

          <line
            x1="82"
            y1="22.5"
            x2="82"
            y2="25.5"
            stroke="#34d399"
            strokeWidth="0.7"
          />

          <line
            x1="80.5"
            y1="24"
            x2="83.5"
            y2="24"
            stroke="#34d399"
            strokeWidth="0.7"
          />
        </g>
      </svg>

      {/* AI Center */}
      <motion.div
        className="
          absolute left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2

          rounded-full

          border border-cyan-400/15

          bg-cyan-400/10

          px-4 py-2

          backdrop-blur-xl
        "
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]

            text-cyan-300
          "
        >
          AI ROUTING
        </span>
      </motion.div>

      {/* Ambulance Card */}
      <motion.div
        className="
          absolute left-[12%] top-[50%]

          rounded-xl

          border border-cyan-400/8

          bg-white/85

          dark:bg-[#07111f]/80

          px-3 py-2

          backdrop-blur-xl
        "
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]

              text-cyan-300
            "
          >
            AMB-047
          </span>
        </div>

        <p className="mt-1 text-[11px] font-semibold text-slate-900 dark:text-white">En Route</p>

        <p className="mt-0.5 text-[9px] text-slate-600 dark:text-slate-500">ETA · 2.4 min</p>
      </motion.div>

      {/* Incident Badge */}
      <div
        className="
          absolute left-[4%] top-[64%]

          rounded-lg

          border border-red-500/15

          bg-red-500/10

          px-2.5 py-1.5

          backdrop-blur-sm
        "
      >
        <span
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.12em]

            text-red-400
          "
        >
          INC-4421 · P1
        </span>
      </div>
    </div>
  );
}
