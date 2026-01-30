import {
  LayoutDashboard,
  PhoneCall,
  Hospital,
  Ambulance,
  UsersIcon,
  FileText,
  Settings,
  Lock,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "../../shared/common/Logo";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Requests", icon: PhoneCall, path: "/requests" },
  { name: "Hospitals", icon: Hospital, path: "/hospitals" },
  { name: "Ambulances", icon: Ambulance, path: "/ambulances" },
  { name: "Users", icon: UsersIcon, path: "/users" },
  { name: "Audit", icon: FileText, path: "/audit" },
  { name: "Settings", icon: Settings, path: "/settings" },
  
];

export default function SideBar() {
  return (
    <>
    <aside className="fixed left-0 top-0 w-22 h-screen bg-white dark:bg-background border-r border-border px-2 py-6 grid grid-cols-1   text-[10px] font-medium z-40 md:sticky md:top-0">
      <div><Logo text={null}  /></div>

      <nav className="flex flex-col  gap-5">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition
              
                ${
                  isActive
                    ? "bg-primary text-gray-100"
                    : "text-gray-600/90 dark:text-gray-300 hover:bg-primary/20"
                }`
              }
            >
              <Icon size={20} />
              <span className="leading-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  </>);
}
