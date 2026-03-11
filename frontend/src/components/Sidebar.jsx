import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  CalendarDays,
  CheckCircle2,
  BookOpen,
  User,
  Bot,
  Calculator,
  Users,
  ClipboardList,
  CalendarRange,
  NotebookPen,
  Circle,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ADMIN_NAV, STUDENT_NAV } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

const iconMap = {
  Dashboard: LayoutDashboard,
  Timetable: CalendarDays,
  Attendance: CheckCircle2,
  "Bunk Calculator": Calculator,
  Notes: BookOpen,
  Events: CalendarRange,
  "AI Study Helper": Bot,
  Profile: User,
  "Manage Students": Users,
  "Manage Timetable": CalendarDays,
  "Manage Attendance": ClipboardList,
  "Manage Notes": NotebookPen,
  "Manage Events": CalendarRange,
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const links = user?.role === "admin" ? ADMIN_NAV : STUDENT_NAV;
  const location = useLocation();

  const roleMeta = useMemo(() => {
    if (user?.role === "admin") {
      return { label: "Admin Console", icon: ShieldCheck };
    }
    return { label: "Student Workspace", icon: GraduationCap };
  }, [user?.role]);

  const RoleIcon = roleMeta.icon;

  const brand = (
    <div className="flex h-16 items-center flex-shrink-0 px-6 mt-2">
      <Link to="/" className="flex items-center gap-3 w-full">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm flex-shrink-0">
          <GraduationCap size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 opacity-100">
          <span className="text-[15px] font-heading font-bold text-white truncate leading-tight">CampusHub</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 truncate">Workspace</span>
        </div>
      </Link>
    </div>
  );

  const content = (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin mt-6 px-3">
      <div className="mb-4 px-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          {roleMeta.label}
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((item) => {
          const active = location.pathname === item.path;
          const Icon = iconMap[item.label] || Circle;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon 
                size={18} 
                className={`flex-shrink-0 mr-3 ${active ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="truncate flex-1">{item.label}</span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>
      
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`lg:sticky lg:top-0 lg:block fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-out shadow-2xl lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {brand}
          {content}
        </div>
      </aside>
    </>
  );
}
