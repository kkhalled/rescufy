import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

export default function AdminNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="  border-b border-border py-3  ">
      
      {/* Search */}
<div className="h-14 container w-9/10 mx-auto text-heading md:h-16 px-3 md:px-4 flex items-center justify-between gap-2 md:gap-4  bg-background/80 backdrop-blur">
      <div className="hidden md:block w-full max-w-xl">
  <div
    className="
      relative flex items-center
      h-10 md:h-11
      rounded-md
      bg-muted/40
      px-3 md:px-4
      transition
      focus-within:bg-muted/50
    "
  >
    {/* Icon */}
    <Search
      size={16}
      className="text-foreground/70 mr-2 md:mr-3 flex-shrink-0"
    />

    {/* Input */}
    <input
      placeholder="Search anything..."
      className="
        flex-1
        bg-transparent
        px-2 md:px-3
        text-xs md:text-sm
        text-foreground
        placeholder:text-gray-700
        dark:placeholder:text-gray-300
        outline-none
      "
    />

    {/* Shortcut */}
    
  </div>
</div>

      {/* Mobile Search Icon */}
      <button className="md:hidden p-2 rounded-lg hover:bg-muted transition">
        <Search size={18} />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* User */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3 cursor-pointer">
          <div className="hidden md:block text-right leading-tight">
            <p className="text-xs font-semibold text-foreground">
              Dr. Abdullah
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              ADMIN
            </span>
          </div>

          <div className="relative">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              AR
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 border-2 border-background rounded-full" />
          </div>
        </div>
      </div>
</div>
    </header>
  );
}
