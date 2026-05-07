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
import { useState } from "react";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navSections = [
  {
    title: "operations",
    items: [
      { key: "dashboard", icon: LayoutDashboard, path: "/admin", end: true },
      { key: "requests", icon: PhoneCall, path: "/admin/requests" },
      { key: "hospitals", icon: Hospital, path: "/admin/hospitals_management" },
      {
        key: "ambulances",
        icon: Ambulance,
        path: "/admin/ambulances_management",
      },
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

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const [isExpanded, setIsExpanded] = useState(false); // For desktop, the sidebar is considered "expanded" when hovered, not just when open

  function handleLinkClick() {
    setIsExpanded(false); // Collapse the sidebar on link click (for desktop)
    onClose(); // Close the sidebar (for mobile)
  }
  const { t } = useTranslation("navigation");
  const isRTL = i18n.dir() === "rtl";

  const navItemVariants = {
    hidden: { opacity: 0, x: isRTL ? 16 : -16 },
    visible: { opacity: 1, x: 0 },
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
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
      onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            onMouseMove={() => setIsExpanded(true)}
        key={isRTL ? "rtl" : "ltr"}
        initial={{ x: isRTL ? "100%" : "-100%" }}
        animate={{
          x: isOpen ? 0 : isRTL ? "100%" : "-100%",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`
          group fixed top-0 z-50
          ${isRTL ? "right-0" : "left-0"}
          h-screen

          /* collapsed → icon-only; expands on hover (desktop) */
          w-72 md:w-18 ${isExpanded ? "md:w-64" : ""}

          /* border */
          border-border/10
          ${isRTL ? "border-l border-r-0" : "border-r"}

          /* glass surface */
          bg-[#0f1117]/95 backdrop-blur-2xl

          shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.4)]

          transition-[width] duration-300 ease-in-out
          overflow-hidden
        `}
      >
        {/* ── Ambient glows ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-6 -top-6 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-red-500/8 blur-3xl" />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 flex h-full flex-col px-2 py-5 pb-2">
          {/* Logo */}
          <div className="mb-5 flex items-center gap-3 border-b border-white/5 pb-5 px-1">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                bg-linear-to-br from-indigo-600 to-violet-700
                shadow-[0_0_20px_rgba(99,102,241,0.4)]
              "
            >
              <img
                src={logo}
                alt="Rescufy"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div
              className={`
                overflow-hidden transition-all duration-300
                md:w-0 md:opacity-0

                ${isExpanded ? "group-hover:md:w-40 group-hover:md:opacity-100" : " md:w-0 md:opacity-0"}
                
              `}
            >
              <h2 className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-slate-100">
                Rescufy
              </h2>
              <p className="whitespace-nowrap text-[11px] text-slate-500">
                Emergency Operations
              </p>
            </div>
          </div>

          {/* Navigation */}
          <motion.nav
            
            className="
    flex flex-1 flex-col gap-5
    overflow-y-auto
    overflow-x-hidden 
    nav-scrollbar
  "
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
          >
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {/* Section label */}
                <div
                  className={`
                    overflow-hidden px-2 transition-all duration-300
                    [scrollbar-width:none]
                    md:h-0 md:opacity-0
                    ${isExpanded ? "md:h-auto md:opacity-100" : "md:h-0 md:opacity-0"}
                  `}
                >
                  <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
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
                        className={({ isActive }) => `
                          group/item relative flex items-center gap-3
                          rounded-xl px-2 py-2.5
                          transition-all duration-200

                          ${
                            isActive
                              ? "bg-indigo-500/12 text-indigo-400"
                              : "text-slate-500 hover:bg-white/4 hover:text-slate-300"
                          }
                        `}
                      >
                        {/* Active left bar */}
                        {({ isActive }: { isActive: boolean }) => (
                          <>
                            <span
                              className={`
                                absolute bottom-0.75 top-0.75
                                flex 
                                items-center
                                ${isRTL ? "right-0" : "left-0"}
                                w-0.75 rounded-full
                                transition-all duration-200
                                ${isActive ? "bg-indigo-500 opacity-100" : "opacity-0"}
                              `}
                            />

                            {/* Icon container */}
                            <div
                              className={`
                                flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                                transition-all duration-200
                                
                              `}
                            >
                              <Icon
                                className="h-4.5 w-4.5"
                                strokeWidth={1.75}
                              />
                            </div>

                            {/* Label */}
                            <span
                              className={`
                                whitespace-nowrap text-[13.5px] font-medium
                                overflow-hidden transition-all duration-300
                                md:w-0 md:opacity-0
                                ${isExpanded ? "group-hover:md:w-32 group-hover:md:opacity-100" : ""}
                              `}
                            >
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

          {/* Status footer */}
          <div className="mt-4 border-t border-white/5 pt-4">
            <div
              className="
                flex items-center justify-center
                
                rounded-xl px-1 py-1
                bg-emerald-500/6 border border-emerald-500/10
              "
            >
              {/* Pulsing dot */}
              <div className="relative flex justify-center  group-hover:md:opacity-0 transition-all duration-300 h-2 w-2 shrink-0 items-center jus gap-1.5 ">
                <span className="absolute h-3.5 w-3.5 rounded-full bg-emerald-500/20 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              </div>

              <div
                className="
                  
                  overflow-hidden transition-all duration-300
                  md:w-0 md:opacity-0
                  group-hover:md:w-40 group-hover:md:opacity-100
                "
              >
                <p className="whitespace-nowrap text-[13px] font-medium text-emerald-400">
                  System Operational
                </p>
                <p className="whitespace-nowrap text-[11px] text-emerald-600">
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
