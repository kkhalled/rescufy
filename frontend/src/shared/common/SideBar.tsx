import {
  LayoutDashboard,
  PhoneCall,
  Hospital,
  Ambulance,
  UsersIcon,
  FileText,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "../../shared/common/Logo";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" ,end: true},
  { name: "Requests", icon: PhoneCall, path: "/admin/requests" },
  { name: "Hospitals", icon: Hospital, path: "/admin/hospitals_management" },
  { name: "Ambulances", icon: Ambulance, path: "/admin/ambulances_management" },
  { name: "Users", icon: UsersIcon, path: "/admin/users" },
  { name: "Audit", icon: FileText, path: "/admin/audit" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-50
        w-64 md:w-22
        bg-white dark:bg-background 
        border-r border-border 
        px-3 md:px-2 py-6 
        flex flex-col
        text-sm md:text-[10px] font-medium
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-6 md:mb-0">
        <Logo text={null} />
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} className="text-muted" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 md:gap-5 mt-4 md:mt-6">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center md:flex-col md:items-center justify-start md:justify-center 
                 gap-3 md:gap-1 
                 px-4 md:px-0 py-3 
                 rounded-xl transition-all duration-200
                 ${isActive
                  ? "bg-primary text-gray-100 shadow-md shadow-primary/25"
                  : "text-gray-600/90 dark:text-gray-300 hover:bg-primary/10 hover:text-primary"
                }`
              }
            >
              <Icon size={20} />
              <span className="leading-tight font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
