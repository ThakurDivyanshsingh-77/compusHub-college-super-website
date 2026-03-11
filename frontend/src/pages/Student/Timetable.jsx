import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { fetchTimetable } from "../../services/studentService";
import { DAYS } from "../../utils/constants";

export default function Timetable() {
  const [filters, setFilters] = useState({ branch: "", year: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchTimetable(filters.branch ? filters : {});
      setData(res.data);
      setLoading(false);
    };
    load();
  }, [filters]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Weekly Timetable</h1>
        <p className="page-subtitle">Track your classes from Monday to Friday with branch and year filters.</p>
      </div>

      <div className="card p-6 min-h-[400px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">Class Schedule</h2>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <input
              placeholder="Branch"
              className="input-field md:w-36 bg-slate-50"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            />
            <input
              placeholder="Year"
              className="input-field md:w-28 bg-slate-50"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable
            columns={[
              { 
                label: "Day", 
                render: (row) => <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">{row.day.substring(0, 3)}</span>
              },
              { label: "Subject", accessor: "subject", className: "font-semibold text-slate-900" },
              { label: "Teacher", accessor: "teacher", className: "text-slate-600 font-medium" },
              { 
                label: "Room", 
                render: (row) => <span className="badge badge-neutral bg-slate-100 border border-slate-200">{row.room}</span> 
              },
              { 
                label: "Timing", 
                render: (row) => <span className="text-slate-600 font-medium whitespace-nowrap">{row.start_time} - {row.end_time}</span> 
              },
            ]}
            data={data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
