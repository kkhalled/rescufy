import { motion } from "framer-motion";

export default function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        inline-flex items-center gap-2

        rounded-full

        border border-emerald-500/[0.12]

        bg-emerald-500/[0.05]

        px-3 py-1
      "
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
        animate={{
          opacity: [1, 0.4, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      <span
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.16em]

          text-emerald-400/80
        "
      >
        Emergency Network Active
      </span>
    </motion.div>
  );
}