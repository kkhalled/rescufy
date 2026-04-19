import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion, useReducedMotion } from 'framer-motion'

export default function CriticalRequestCard() {
  const shouldReduceMotion = useReducedMotion()

  return <>
    <motion.article
      className="relative overflow-hidden bg-bg-card/80 rounded-2xl px-1 py-4 text-heading shadow-card border border-red-500/10"
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {!shouldReduceMotion && (
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 h-full w-1 bg-red-500"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
        />
      )}

      <div className="flex flex-col gap-2 px-3">
        {/* ID + Badge */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span>REQ-2025-001</span>
          <motion.span
            className="rounded-full critical-gradient px-2 py-0.5 text-[10px] font-semibold text-white"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          >
            URGENT
          </motion.span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-heading leading-tight">
          Ahmed Hassan
        </h3>

        {/* Description */}
        <p className="text-xs text-muted max-w-xl">
          Severe chest pain, difficulty breathing
        </p>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-red-400">
          <motion.span
            animate={shouldReduceMotion ? undefined : { rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
          >
            <FontAwesomeIcon icon={faClock} />
          </motion.span>
          <span>2 mins ago</span>
        </div>
      </div>
    </motion.article>


  </>
}
