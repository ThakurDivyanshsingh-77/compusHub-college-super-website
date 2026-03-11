import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BarChart3 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { fetchAttendance, fetchAttendanceAnalytics } from "../../services/studentService";
import ProgressCircle from "../../components/ProgressCircle";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Attendance() {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchAttendance();
      const analytics = await fetchAttendanceAnalytics();
      setStats(res);
      setChart(analytics.data);
      setLoading(false);
    };
    load();
  }, []);

  const chartData =
    chart &&
    ({
      labels: chart.labels,
      datasets: [
        {
          label: "Attendance %",
          data: chart.percentages,
          backgroundColor: ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e"],
          borderWidth: 0,
        },
      ],
    });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Attendance Tracker</h1>
        <p className="page-subtitle">Monitor subject-wise percentages and stay above the minimum attendance target.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-xl font-heading font-bold text-slate-900">Subject Breakdown</h2>
            </div>
            <div className="bg-primary/10 border border-primary/20 text-primary font-bold px-3 py-1 rounded-lg text-sm shadow-sm">
              Overall {stats?.overallPercentage || 0}%
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable
              columns={[
                { label: "Subject", accessor: "subject", className: "font-semibold text-slate-900" },
                { 
                  label: "Attended", 
                  render: (row) => <span className="text-slate-600 font-medium">{row.attended_classes} / {row.total_classes}</span> 
                },
                { 
                  label: "Percentage", 
                  render: (row) => {
                    const pct = row.percentage || 0;
                    return (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                        pct < 75 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {pct}%
                      </span>
                    );
                  }
                },
              ]}
              data={stats?.data || []}
            />
          )}

          {stats?.lowAttendanceSubjects?.length ? (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium mt-4">
              <span className="font-bold">Low attendance in:</span> {stats.lowAttendanceSubjects.join(", ")}
            </div>
          ) : (
            <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl text-sm font-medium mt-4">
              All subjects are above 75%. Great job!
            </div>
          )}
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="card p-6 flex items-center justify-center min-h-[160px]">
            <ProgressCircle value={stats?.overallPercentage || 0} label="Overall Attendance" />
          </div>

          <div className="card p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-heading font-bold text-slate-900 mb-6">Attendance Analytics</h2>
            <div className="flex-1 flex items-center justify-center">
              {chartData ? (
                <div className="w-full max-w-[240px]">
                  <Doughnut 
                    data={chartData} 
                    options={{ 
                      plugins: { 
                        legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, font: { family: "'Inter', sans-serif", size: 11 } } } 
                      },
                      cutout: '75%',
                      borderWidth: 0,
                    }} 
                  />
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-100 w-full text-center">No chart data available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
