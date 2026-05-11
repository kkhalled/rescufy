import { Search, Sun, Moon, Menu, LogOut } from "lucide-react";
import { useTheme } from "../shared/hooks/useTheme";
import { useAuth } from "@/app/provider/AuthContext";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import LanguageSwitcher from "../shared/ui/LanguageSwitcher";
import NotificationBell from "@/features/notifications/components/NotificationBell";
// ...existing code...

type AdminNavbarProps = {
  onMenuClick: () => void;
  isExpanded: boolean;
  setIsExpanded: (arg0: boolean) => void;
};

export default function AdminNavbar({
  onMenuClick,
  
  setIsExpanded,
}: AdminNavbarProps) {
  const { theme, toggleTheme } = useTheme();

  const { user } = useAuth();
  const { t } = useTranslation(["navigation", "common", "auth"]);
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0  md:rtl:left-0 bg-background-second/95 backdrop-blur-md border-b border-border z-49">
      <div className="h-14 md:h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left Section - Mobile Menu + Search */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={()=>{
              onMenuClick()
              setIsExpanded(true)
            }}
            className="md:hidden p-2 -ml-2 rtl:-mr-2 rtl:ml-0 rounded-lg hover:bg-muted transition-colors"
            aria-label={t("common:aria.openMenu")}
          >
            <Menu size={22} className="text-heading" />
          </button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Icon */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={t("common:aria.search")}
          >
            <Search size={18} className="text-heading" />
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={t("common:aria.toggleTheme")}
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-heading" />
            ) : (
              <Moon size={18} className="text-heading" />
            )}
          </button>

          <NotificationBell />

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* User Profile */}
          <div className="relative group">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
              {/* User Info - Hidden on small screens */}
              <div className="hidden md:flex flex-col items-center space-y-1 text-right rtl:text-left">
                <p className="text-sm font-semibold text-heading leading-tight">
                  {user?.FullName || t("auth:defaultUser")}
                </p>

                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                  {user?.Role
                    ? t(`auth:roles.${user.Role}`)
                    : t("auth:roles.SuperAdmin")}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-2 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-2 bg-background-second">
                <div className="relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                    {user?.UserName
                      ? user.UserName.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "AU"}
                  </div>
                  <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-success border-2 border-background-second rounded-full" />
                </div>
                <FontAwesomeIcon
                  className="text-heading transition-transform group-hover:rotate-180 duration-300"
                  icon={faAngleDown}
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-background-second border border-border rounded-lg shadow-lg overflow-hidden ">
                {/* User Info in Dropdown (Mobile) */}
                <div className="md:hidden px-2 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-heading">
                    {user?.FullName || "Admin User"}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {user?.Email || "admin@rescufy.com"}
                  </p>
                </div>

                {/* Logout Button */}
                <div className="">
                  <button
                    onClick={logout}
                    className="w-full cursor-pointer px-4 py-3 text-xs font-bold text-danger hover:bg-danger transition-colors hover:text-white  flex items-center gap-1 text-left rtl:text-right"
                  >
                    <LogOut size={16} />
                    <span>{t("auth:logout.title")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
