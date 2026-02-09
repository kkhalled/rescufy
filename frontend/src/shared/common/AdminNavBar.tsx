import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuth } from "@/app/provider/AuthContext";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 md:left-22 bg-background-second/95 backdrop-blur-md border-b border-border z-30">
      <div className="h-14 md:h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left Section - Mobile Menu + Search */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} className="text-heading" />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-muted dark:bg-surface-soft border border-border rounded-xl text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            <Search size={18} className="text-heading" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-heading" />
            ) : (
              <Moon size={18} className="text-heading" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell size={18} className="text-heading" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
          </button>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* User Profile */}
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            {/* User Info - Hidden on small screens */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-heading leading-tight">
                {user?.FullName || "Admin User"}
              </p>
             
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                {(user?.Role)?.toUpperCase() || "ADMIN"}
              </span>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                {user?.UserName
                  ? user.UserName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "AU"}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-success border-2 border-background-second rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
