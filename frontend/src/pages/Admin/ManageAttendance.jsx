import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { fetchAllAttendance, upsertAttendance } from "../../services/adminService";

const emptyForm = { student_id: "", subject: "", total_classes: "", attended_classes: "" };

export default function ManageAttendance() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ branch: "", year: "" });

  const load = async () => {
    const res = await fetchAllAttendance();
    setRows(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await upsertAttendance({
        student_id: form.student_id,
        subject: form.subject,
        total_classes: Number(form.total_classes),
        attended_classes: Number(form.attended_classes),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Manage Attendance</h1>
        <p className="page-subtitle">Search attendance records and upsert subject-wise counts for any student.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <ClipboardList size={20} />
              </div>
              <h2 className="text-xl font-heading font-bold text-slate-900">Attendance Records</h2>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <input
                placeholder="Branch filter"
                className="input-field md:w-40 bg-slate-50"
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              />
              <input
                placeholder="Year filter"
                className="input-field md:w-32 bg-slate-50"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              />
            </div>
          </div>

          <DataTable
            columns={[
              { 
                label: "Student", 
                render: (r) => (
                  <div className="font-medium text-slate-900">
                    {r.student_name} <span className="text-xs text-slate-500 font-normal block">{r.student_id}</span>
                  </div>
                ) 
              },
              { 
                label: "Branch/Year", 
                render: (r) => <span className="badge badge-neutral bg-slate-100">{r.branch} / {r.year}</span> 
              },
              { label: "Subject", accessor: "subject", className: "font-semibold text-slate-700" },
              { label: "Attended/Total", render: (r) => <span className="text-slate-600 font-medium">{r.attended_classes} / {r.total_classes}</span> },
              { 
                label: "Percent", 
                render: (r) => {
                  const pct = r.percentage || 0;
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
            data={rows.filter(
              (r) =>
                (!filters.branch || r.branch.toLowerCase().includes(filters.branch.toLowerCase())) &&
                (!filters.year || String(r.year).toLowerCase().includes(filters.year.toLowerCase()))
            )}
          />
        </div>

        <div className="card p-6 h-fit sticky top-24 bg-gradient-to-br from-white to-slate-50">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-heading font-bold text-slate-900">Add or Update Record</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Updates existing record if matched.</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="label">Student ID</label>
              <input
                required
                placeholder="e.g. S12345"
                className="input-field"
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              />
            </div>
            
            <div>
              <label className="label">Subject</label>
              <input
                required
                placeholder="e.g. Database Systems"
                className="input-field"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Total Classes</label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="input-field"
                  value={form.total_classes}
                  onChange={(e) => setForm({ ...form, total_classes: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Attended</label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="input-field"
                  value={form.attended_classes}
                  onChange={(e) => setForm({ ...form, attended_classes: e.target.value })}
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

            <button type="submit" disabled={saving} className="btn btn-primary w-full mt-2 py-3 text-sm">
              {saving ? "Saving..." : "Save Record"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
