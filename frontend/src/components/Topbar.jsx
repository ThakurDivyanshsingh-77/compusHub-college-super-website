import { Bell, LogOut, Search, Command, Compass, Menu } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }).format(new Date()),
    []
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="h-10 w-full rounded-xl bg-slate-100/50 border-transparent pl-10 pr-12 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm text-xs font-medium text-slate-600">
            <Compass size={14} className="text-primary" />
            <span>{todayLabel}</span>
          </div>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
          </button>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">{user?.name || "Guest"}</span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {user?.role === "admin" ? "Admin" : "Student"}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>

          <button
            onClick={logout}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm ml-1"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
