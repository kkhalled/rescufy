import { motion } from "framer-motion";

type DashboardAmbientDecorProps = {
  shouldReduceMotion: boolean;
};

export function DashboardAmbientDecor({
  shouldReduceMotion,
}: DashboardAmbientDecorProps) {
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-primary/20 blur-xl"
        animate={{
          x: [0, 22, 0],
          y: [0, -14, 0],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-20 right-8 h-32 w-32 rounded-full bg-cyan-500/20 blur-xl"
        animate={{
          x: [0, -18, 0],
          y: [0, 12, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 9.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
      />
    </>
  );
}
