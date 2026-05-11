import {
  LayoutDashboard,
  PhoneCall,
  Hospital,
  Ambulance,
  UsersIcon,
  Settings,
  ChartPie,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import logo from "@/assets/mini-logo.png";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import i18n from "@/i18n";
import { useAuth } from "@/app/provider/AuthContext";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  setIsExpanded: (arg0: boolean) => void;
}

const navSections = [
  {
    title: "operations",
    items: [
      { key: "dashboard", icon: LayoutDashboard, path: "/admin", end: true },
      { key: "requests", icon: PhoneCall, path: "/admin/requests" },
      { key: "hospitals", icon: Hospital, path: "/admin/hospitals_management" },
      { key: "ambulances", icon: Ambulance, path: "/admin/ambulances_management" },
    ],
  },
  {
    title: "monitoring",
    items: [{ key: "analytics", icon: ChartPie, path: "/admin/analytics" }],
  },
  {
    title: "management",
    items: [
      { key: "users", icon: UsersIcon, path: "/admin/users" },
      { key: "settings", icon: Settings, path: "/admin/settings" },
    ],
  },
];

const navItemsConfig = [
  {
    title: "operations",
    items: [
      { key: "dashboard", icon: LayoutDashboard, path: "/hospital", end: true },
    ],
  },
  {
    title: "requests",
    items: [{ key: "requests", icon: PhoneCall, path: "/hospital/requests" }],
  },
  {
    title: "hospitalProfile",
    items: [
      { key: "hospitalProfile", icon: Hospital, path: "/hospital/profile" },
    ],
  },
  {
    title: "settings",
    items: [{ key: "settings", icon: Settings, path: "/hospital/settings" }],
  },
];

interface NavItem {
  key: string;
  icon: React.ElementType;
  path: string;
  end?: boolean;
}
type NavSection = {
  title: string;
  items: NavItem[];
};

// Easing curve for all sidebar transitions
const SIDEBAR_EASE = [0.25, 0.46, 0.45, 0.94] as const;
const DURATION = 0.28;

export default function SideBar({
  isOpen,
  onClose,
  isExpanded,
  setIsExpanded,
}: SideBarProps) {
  const { user } = useAuth();
  const navItems: NavSection[] =
    user?.Role === "hospitaladmin" ? navItemsConfig : navSections;

  function handleLinkClick() {
    setIsExpanded(false);
    onClose();
  }

  const { t } = useTranslation("navigation");
  const isRTL = i18n.dir() === "rtl";

  // Staggered nav item animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.055, delayChildren: 0.05 },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: isRTL ? 14 : -14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.32, ease: SIDEBAR_EASE },
    },
  };

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.55) 100%)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar shell ── */}
      <motion.aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        key={isRTL ? "rtl-sidebar" : "ltr-sidebar"}
        /* Slide in/out on mobile */
        initial={{ x: isRTL ? "100%" : "-100%" }}
        animate={{ x: isOpen ? 0 : isRTL ? "100%" : "-100%" }}
        transition={{ duration: DURATION, ease: SIDEBAR_EASE }}
        /* Expand/collapse width on desktop */
        style={{
          /* CSS custom properties let children inherit the transition timing */
          ["--sidebar-duration" as string]: `${DURATION}s`,
        }}
        className={[
          // Position
          "fixed top-0 z-50 h-screen",
          isRTL ? "right-0" : "left-0",

          // Width: collapsed = icon-only (72px), expanded = 256px
          // Tailwind JIT: keep both classes present so they're compiled
          "w-72",
          "md:w-[72px]",
          isExpanded ? "md:!w-64" : "",

          // Border
          isRTL ? "border-l" : "border-r",

          // ── Light mode surface ──
          "border-slate-200/80",
          "bg-white/90",

          // ── Dark mode surface ──
          "dark:border-white/[0.06]",
          "dark:bg-[#0d0f16]/95",

          // Blur + overflow
          "backdrop-blur-2xl",
          "overflow-hidden",

          // Smooth width change
          "transition-[width] duration-[280ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ── Ambient glows (theme-aware) ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Light mode: subtle warm tones */}
          <div className="absolute -left-8 -top-8 h-60 w-60 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-900/[0.15] dark:blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-52 w-52 rounded-full bg-violet-100/50 blur-3xl dark:bg-violet-900/[0.12] dark:blur-3xl" />
          {/* Light mode noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
        </div>

        {/* ── Inner layout ── */}
        <div className="relative z-10 flex h-full flex-col px-2.5 py-5 pb-3">

          {/* ── Logo row ── */}
          <div className="mb-5 flex items-center gap-3 border-b border-slate-200/70 pb-5 px-1 dark:border-white/[0.06]">
            {/* Icon badge */}
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-indigo-500 to-violet-600
                shadow-[0_4px_20px_rgba(99,102,241,0.45)]
                ring-1 ring-indigo-400/30
              "
            >
              <img src={logo} alt="Rescufy" className="h-6 w-6 object-contain" />
            </div>

            {/* Brand text — fades with width */}
            <motion.div
              animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
              transition={{ duration: DURATION, ease: SIDEBAR_EASE }}
              className="overflow-hidden hidden md:block"
            >
              <h2 className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                Rescufy
              </h2>
              <p className="whitespace-nowrap text-[11px] text-slate-400 dark:text-slate-500">
                Emergency Operations
              </p>
            </motion.div>

            {/* Always visible on mobile */}
            <div className="md:hidden overflow-hidden">
              <h2 className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                Rescufy
              </h2>
              <p className="whitespace-nowrap text-[11px] text-slate-400 dark:text-slate-500">
                Emergency Operations
              </p>
            </div>
          </div>

          {/* ── Navigation ── */}
          <motion.nav
            className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((section) => (
              <div key={section.title} className="space-y-0.5">

                {/* Section label */}
                <motion.div
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    height: isExpanded ? "auto" : 0,
                  }}
                  transition={{ duration: DURATION, ease: SIDEBAR_EASE }}
                  className="overflow-hidden px-2 hidden md:block"
                >
                  <p className="mb-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400/70 dark:text-slate-600">
                    {t(`sidebar.${section.title}`)}
                  </p>
                </motion.div>

                {/* Section label always shown on mobile */}
                <div className="md:hidden overflow-hidden px-2">
                  <p className="mb-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400/70 dark:text-slate-600">
                    {t(`sidebar.${section.title}`)}
                  </p>
                </div>

                {/* Nav items */}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.key} variants={navItemVariants}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          [
                            "relative flex items-center gap-3",
                            "rounded-xl px-2 py-2.5",
                            // Smooth color change
                            "transition-colors duration-200",
                            isActive
                              ? [
                                  // Light active
                                  "bg-indigo-50 text-indigo-600",
                                  // Dark active
                                  "dark:bg-indigo-500/[0.12] dark:text-indigo-400",
                                ].join(" ")
                              : [
                                  // Light idle/hover
                                  "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                                  // Dark idle/hover
                                  "dark:text-slate-500 dark:hover:bg-white/[0.04] dark:hover:text-slate-300",
                                ].join(" "),
                          ].join(" ")
                        }
                      >
                        {({ isActive }: { isActive: boolean }) => (
                          <>
                            {/* Active indicator bar */}
                            <motion.span
                              animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className={[
                                "absolute bottom-1 top-1 w-[3px] rounded-full",
                                isRTL ? "right-0" : "left-0",
                                // Light
                                "bg-indigo-500",
                                // Dark
                                "dark:bg-indigo-400",
                              ].join(" ")}
                              style={{ transformOrigin: "center" }}
                            />

                            {/* Icon */}
                            <div
                              className={[
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                "transition-all duration-200",
                                isActive
                                  ? "bg-indigo-100 dark:bg-indigo-500/20"
                                  : "bg-transparent",
                              ].join(" ")}
                            >
                              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                            </div>

                            {/* Label */}
                            <motion.span
                              animate={{
                                opacity: isExpanded ? 1 : 0,
                                width: isExpanded ? "auto" : 0,
                              }}
                              transition={{ duration: DURATION, ease: SIDEBAR_EASE }}
                              className="whitespace-nowrap text-[13.5px] font-medium overflow-hidden hidden md:block"
                            >
                              {t(`sidebar.${item.key}`)}
                            </motion.span>

                            {/* Label always visible on mobile */}
                            <span className="md:hidden whitespace-nowrap text-[13.5px] font-medium">
                              {t(`sidebar.${item.key}`)}
                            </span>
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.nav>

          {/* ── Status footer ── */}
          <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-white/[0.05]">
            <div
              className={[
                "flex items-center rounded-xl px-2 py-2",
                // Light
                "bg-emerald-50 border border-emerald-200/60",
                // Dark
                "dark:bg-emerald-500/[0.06] dark:border-emerald-500/[0.12]",
                // Smooth size change
                isExpanded ? "gap-2.5" : "justify-center",
                "transition-all duration-[280ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
              ].join(" ")}
            >
              {/* Pulsing dot — always visible */}
              <div className="relative flex shrink-0 h-2 w-2 items-center justify-center">
                <span className="absolute h-3.5 w-3.5 rounded-full bg-emerald-400/30 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
              </div>

              {/* Status text */}
              <motion.div
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
                transition={{ duration: DURATION, ease: SIDEBAR_EASE }}
                className="overflow-hidden hidden md:block"
              >
                <p className="whitespace-nowrap text-[12.5px] font-medium text-emerald-600 dark:text-emerald-400">
                  System Operational
                </p>
                <p className="whitespace-nowrap text-[10.5px] text-emerald-500/70 dark:text-emerald-600">
                  All services running
                </p>
              </motion.div>

              {/* Always visible on mobile */}
              <div className="md:hidden overflow-hidden">
                <p className="whitespace-nowrap text-[12.5px] font-medium text-emerald-600 dark:text-emerald-400">
                  System Operational
                </p>
                <p className="whitespace-nowrap text-[10.5px] text-emerald-500/70 dark:text-emerald-600">
                  All services running
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}