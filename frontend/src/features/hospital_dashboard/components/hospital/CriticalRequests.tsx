import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CriticalRequestCard from "./CriticalRequestCard";

export default function CriticalRequests() {
  const { t } = useTranslation("dashboard");
  const shouldReduceMotion = useReducedMotion();

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 18,
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.section
      className="relative overflow-hidden rounded-lg border border-red-500/20 px-1 py-2 text-heading shadow-[0_0_60px_rgba(230,57,70,0.15)] md:rounded-2xl md:px-3 md:py-6"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {!shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl border border-red-500/30"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.008, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-0.5 w-20 bg-linear-to-r from-transparent via-red-500/90 to-transparent"
            animate={{ x: [-90, 420] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          />
        </>
      )}

      <div className="relative">
        <header className="mb-4 flex items-center gap-2 border-b border-red-500/20 py-3 rtl:space-x-reverse md:mb-6 md:py-1">
          <motion.span
            animate={shouldReduceMotion ? undefined : { rotate: [0, -12, 10, -7, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          >
            <FontAwesomeIcon icon={faBell} style={{ color: "#E63946" }} />
          </motion.span>

          {!shouldReduceMotion && (
            <motion.span
              aria-hidden
              className="h-2 w-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
            />
          )}

          <span className="text-sm font-medium md:text-base">{t("criticalRequests.title")}</span>
        </header>

        <motion.div
          className="grid space-y-2"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[0, 1].map((item, index) => (
            <motion.div
              key={`critical-${item}-${index}`}
              variants={itemVariants}
              whileHover={shouldReduceMotion ? undefined : { x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <CriticalRequestCard />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}