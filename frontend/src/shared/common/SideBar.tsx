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
import { motion } from "framer-motion";
import i18n from "@/i18n";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItemsConfig = [
  { key: "dashboard", icon: LayoutDashboard, path: "/admin", end: true },
  { key: "requests", icon: PhoneCall, path: "/admin/requests" },
  { key: "hospitals", icon: Hospital, path: "/admin/hospitals_management" },
  { key: "ambulances", icon: Ambulance, path: "/admin/ambulances_management" },
  { key: "analytics", icon: ChartPie, path: "/admin/analytics" },
  { key: "users", icon: UsersIcon, path: "/admin/users" },
  { key: "settings", icon: Settings, path: "/admin/settings" },
];

export default function SideBar({
  isOpen,
  onClose,
}: SideBarProps) {
  const { t } = useTranslation("navigation");

  // Detect RTL/LTR dynamically
  const isRTL = i18n.dir() === "rtl";

  // Navigation item animation
  const navItemVariants = {
    hidden: {
      opacity: 0,
      x: isRTL ? 20 : -20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        key={isRTL ? "rtl" : "ltr"}
        initial={{
          x: isRTL ? "100%" : "-100%",
        }}
        animate={{
          x: isOpen
            ? 0
            : isRTL
            ? "100%"
            : "-100%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`
          fixed top-0 h-screen z-50

          ${isRTL ? "right-0" : "left-0"}

          w-72 sm:w-64 md:w-22

          bg-white dark:bg-background

          border-r border-border
          rtl:border-r-0 rtl:border-l

          px-4 sm:px-3 md:px-2

          flex flex-col

          text-xs sm:text-sm md:text-[10px]
          font-medium

          shadow-lg md:shadow-none
        `}
      >
        {/* Logo */}
        <div className="mx-auto mb-2 flex w-full items-center justify-center md:mb-8 md:h-20 md:overflow-hidden">
          <img
            src={logo}
            alt="Rescufy Logo"
            className="h-auto w-14 object-contain md:object-center"
          />
        </div>

        {/* Navigation */}
        <motion.nav
          className="mt-4 flex flex-col gap-2 md:mt-0 md:gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {navItemsConfig.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={navItemVariants}
              >
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center
                    md:flex-col md:items-center

                    justify-start md:justify-center

                    gap-3 sm:gap-2 md:gap-1

                    px-3 sm:px-4 md:px-0
                    py-3 sm:py-2.5 md:py-3

                    rounded-lg sm:rounded-xl

                    transition-all duration-200

                    min-h-12 sm:min-h-11 md:min-h-14

                    ${
                      isActive
                        ? "bg-primary text-gray-100 shadow-md shadow-primary/25"
                        : `
                          text-gray-600/90
                          dark:text-gray-300
                          hover:bg-primary/10
                          hover:text-primary
                        `
                    }
                  `
                  }
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Icon size={20} />
                  </motion.div>

                  {/* Label */}
                  <span className="leading-tight font-medium">
                    {t(`sidebar.${item.key}`)}
                  </span>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.nav>
      </motion.aside>
    </>
  );
}