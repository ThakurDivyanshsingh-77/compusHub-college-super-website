import { useEffect, useState } from "react";
import { BarChart3, CalendarClock, NotebookPen, Users } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import DataTable from "../../components/DataTable";
import { fetchAdminDashboard } from "../../services/adminService";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetchAdminDashboard();
      setData(res);
      setLoading(false);
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Monitor platform activity and manage operational bottlenecks quickly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Students" value={data.overview.totalStudents} accent="primary">
          <Users size={24} className="text-white" />
        </StatCard>
        <StatCard label="Notes" value={data.overview.uploadedNotes} accent="purple">
          <NotebookPen size={24} className="text-white" />
        </StatCard>
        <StatCard label="Events" value={data.overview.events} accent="purple">
          <CalendarClock size={24} className="text-white" />
        </StatCard>
        <StatCard label="Attendance Alerts" value={data.overview.attendanceReports} accent="primary">
          <BarChart3 size={24} className="text-white" />
        </StatCard>
      </div>

      <div className="card p-6 mt-8">
        <h2 className="section-title mb-6">Low Attendance Alerts</h2>
        <DataTable
          columns={[
            { label: "Student", accessor: "name", className: "font-medium text-slate-900" },
            { label: "Subject", accessor: "subject", className: "text-slate-600" },
            { 
              label: "Percentage", 
              className: "text-right",
              render: (row) => (
                <div className="flex justify-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    (row.percentage || 0) < 75 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {row.percentage || 0}%
                  </span>
                </div>
              ) 
            },
          ]}
          data={data.lowAttendance}
        />
      </div>
    </DashboardLayout>
  );
}
