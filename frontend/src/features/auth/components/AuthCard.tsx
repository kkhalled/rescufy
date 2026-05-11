import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  subtitle?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AuthCard({
  children,
  subtitle,
}: Props) {
  const { t } = useTranslation("auth");

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: EASE,
      }}
      className="
        mx-auto
        md:mt-15
        flex w-full max-w-90
        flex-col
        justify-center
      "
    >
      {/* Logo */}
      <div className="mb-7 text-center">
        

        <h2
          className="
            text-[1.8rem]
            font-black

            tracking-[-0.04em]

            text-slate-900

            dark:text-white
          "
        >
          Rescufy
        </h2>

        <p className="mt-2 text-[12px] text-slate-600 dark:text-slate-500">
          {subtitle ??
            t(
              "signIn.controlPanel",
              "Emergency Operations Access",
            )}
        </p>
      </div>

      {/* Card */}
      <div
        className="
          relative overflow-hidden

          rounded-[22px]

          border border-slate-200/80

          bg-white/85

          shadow-[0_24px_70px_rgba(15,23,42,0.08)]

          dark:border-white/6
          dark:bg-white/3
          dark:shadow-none

          

          backdrop-blur-xl
        "
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.section>
  );
}