import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Bot,
  ArrowRight,
  MapPin,
  GraduationCap,
  NotebookPen,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { fetchStudentDashboard } from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";

const MetricCard = ({ label, value, meta, icon: Icon, tone = "primary" }) => {
  const toneMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    amber: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    mint: "bg-accent/10 text-accent border-accent/20",
  };

  const badgeTone = toneMap[tone] || toneMap.primary;

  return (
    <div className="card p-5 card-hover flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-1">{label}</div>
          <div className="text-3xl font-heading font-bold text-slate-900 tracking-tight">{value}</div>
        </div>
        <span className={`h-12 w-12 rounded-xl inline-flex items-center justify-center border shadow-sm ${badgeTone}`}>
          <Icon size={22} strokeWidth={2.5} />
        </span>
      </div>
      {meta && <p className="text-sm font-medium text-slate-600 border-t border-slate-100 pt-3 mt-1">{meta}</p>}
    </div>
  );
};

const ProgressBar = ({ value }) => (
  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
    <div
      className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500"
      style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
    />
  </div>
);

const CompactClassRow = ({ item }) => (
  <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
    <div>
      <div className="text-sm font-heading font-semibold text-slate-900">{item.subject}</div>
      <div className="text-xs font-medium text-slate-500 mt-0.5">{item.teacher}</div>
    </div>
    <div className="flex flex-col items-end gap-1 text-xs font-medium text-slate-600">
      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
        <Clock3 size={12} className="text-primary" />
        <span>
          {item.start_time} - {item.end_time}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-slate-400">Room {item.room}</span>
    </div>
  </div>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchStudentDashboard();
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="card bg-red-50 border-red-200 p-6 text-red-600 text-center font-medium">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const overview = data?.overview || {};
  const classes = data.classes || [];
  const nextClass = classes[0];
  const otherClasses = classes.slice(1, 4);
  const firstEvent = data.events?.[0];
  const name = user?.name?.split(" ")?.[0] || "Student";
  const attendance = overview.attendancePercentage ?? 0;
  const attendanceStatus = attendance >= 75 ? "Safe for 75% rule ✓" : "Below 75% - prioritise presence ⚠️";

  return (
    <DashboardLayout>
      <div className="space-y-1 mb-8">
        <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Today's Overview</div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 tracking-tight">
            Hi {name}, here is your day at a glance.
          </h1>
          <span className="badge badge-primary text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
            {overview.todayClasses || 0} classes today
          </span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          label="Today's load"
          value={`${overview.todayClasses || 0} classes`}
          meta={nextClass ? `Next at ${nextClass.start_time}` : "You are free after this."}
          icon={CalendarDays}
          tone="primary"
        />
        <MetricCard
          label="Attendance"
          value={`${attendance}%`}
          meta={attendanceStatus}
          icon={GraduationCap}
          tone={attendance >= 75 ? "mint" : "amber"}
        />
        <MetricCard
          label="Notes ready"
          value={overview.notesAvailable || 0}
          meta={`For ${user?.branch || "your"} batch`}
          icon={NotebookPen}
          tone="amber"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Next Class Widget */}
        <div className="card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Up Next</div>
              <h3 className="text-2xl font-heading font-bold text-slate-900">
                {nextClass ? nextClass.subject : "No class scheduled"}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {nextClass ? `With ${nextClass.teacher}` : "Enjoy the breather or plan ahead."}
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 text-primary font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm whitespace-nowrap">
              {nextClass ? `${nextClass.start_time} - ${nextClass.end_time}` : "Free block"}
            </div>
          </div>

          {nextClass && (
            <div className="pt-5 flex-1 flex flex-col justify-between">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="badge badge-neutral">📍 Room {nextClass.room}</span>
                {user?.branch && <span className="badge badge-neutral bg-slate-100">{user.branch}</span>}
                {user?.year && <span className="badge badge-neutral bg-slate-100">Year {user.year}</span>}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Following Classes</div>
                <div className="space-y-3">
                  {otherClasses.length ? (
                    otherClasses.map((cls, idx) => <CompactClassRow key={`${cls.subject}-${idx}`} item={cls} />)
                  ) : (
                    <div className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">No more classes on the roster today.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
            <Link to="/student/timetable" className="btn btn-secondary flex-1 sm:flex-none">
              View full timetable
            </Link>
            <Link to="/student/bunk-calculator" className="btn btn-ghost flex-1 sm:flex-none">
              Bunk calculator
            </Link>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6 flex flex-col">
          {/* Attendance Health Widget */}
          <div className="card p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Health</div>
                <div className="text-4xl font-heading font-bold text-slate-900 tracking-tight">{attendance}%</div>
                <p className="text-xs font-medium text-slate-500 mt-1">{attendanceStatus}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <GraduationCap size={20} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="mb-6 flex-1">
              <ProgressBar value={attendance} />
              <div className="mt-3">
                {overview.lowAttendanceSubjects?.length ? (
                  <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                    <span className="font-bold">Low in:</span> {overview.lowAttendanceSubjects.join(", ")}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-accent bg-accent/10 p-2 rounded-lg border border-accent/20">
                    All subjects above 75%. Great job!
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Link to="/student/attendance" className="btn btn-primary text-xs w-full">
                Details
              </Link>
              <Link to="/student/ai-helper" className="btn btn-outline text-xs w-full">
                Get Help
              </Link>
            </div>
          </div>

          {/* AI Helper Quick Widget */}
          <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">AI Assistant</div>
                <div className="text-lg font-heading font-bold text-white">Quick Question?</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <Bot size={20} />
              </div>
            </div>
            
            <div className="space-y-2 mb-5">
              <div className="rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/5 p-3 text-xs font-medium cursor-pointer">
                Explain DBMS joins simply
              </div>
              <div className="rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/5 p-3 text-xs font-medium cursor-pointer">
                Generate 5 quiz questions
              </div>
            </div>
            
            <Link to="/student/ai-helper" className="btn w-full bg-primary hover:bg-primary/90 text-white border-none shadow-primary/30 shadow-lg">
              Open AI Assistant <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timetable Overview */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <CalendarDays size={18} />
              </div>
              <h2 className="text-lg font-heading font-bold text-slate-900">Upcoming classes</h2>
            </div>
            <Link to="/student/timetable" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View full <ArrowRight size={14} />
            </Link>
          </div>
          <DataTable
            columns={[
              { label: "Subject", accessor: "subject", className: "font-semibold text-slate-900" },
              { label: "Teacher", accessor: "teacher", className: "text-slate-600 font-medium" },
              { 
                label: "Time", 
                render: (row) => (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
                    <Clock3 size={12} className="text-primary" />
                    {row.start_time} - {row.end_time}
                  </span>
                ) 
              },
              { label: "Room", accessor: "room", className: "text-slate-500 font-medium" },
            ]}
            data={classes}
          />
        </div>

        {/* Events & Tips Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-heading font-bold text-slate-900">Events</h2>
              <Link to="/student/events" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {data.events?.length ? (
                data.events.slice(0, 3).map((event, idx) => (
                  <div key={`${event.title}-${idx}`} className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all p-3">
                    <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{event.date.split(' ')[0]}</span>
                      <span className="text-lg font-heading font-bold text-slate-900">{event.date.split(' ')[1] || '01'}</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-heading font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{event.title}</div>
                      <div className="flex items-center gap-2 mt-1.5 xs:mt-2 text-[11px] font-medium text-slate-500">
                        <MapPin size={12} className="text-slate-400 group-hover:text-accent transition-colors" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">No upcoming events.</div>
              )}
            </div>
          </div>

          <div className="card p-6 border-primary/20 bg-gradient-to-br from-white to-orange-50/50">
            <div className="text-sm font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs">💡</span>
              Study Tips
            </div>
            <ul className="space-y-3">
              {(data.tips || []).map((tip, idx) => (
                <li key={idx} className="flex gap-3 items-start text-sm font-medium text-slate-600">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
