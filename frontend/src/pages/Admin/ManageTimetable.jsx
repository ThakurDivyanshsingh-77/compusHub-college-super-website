import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { addTimetableEntry, deleteTimetableEntry, editTimetableEntry } from "../../services/adminService";
import { fetchTimetable } from "../../services/studentService";
import { DAYS } from "../../utils/constants";

const emptyForm = {
  day: "",
  subject: "",
  teacher: "",
  room: "",
  start_time: "",
  end_time: "",
  branch: "",
  year: "",
};

export default function ManageTimetable() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetchTimetable();
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (editingId) {
        await editTimetableEntry(editingId, form);
      } else {
        await addTimetableEntry(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save timetable entry");
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      ...row,
      start_time: row.start_time?.slice(0, 5) || "",
      end_time: row.end_time?.slice(0, 5) || "",
    });
  };

  const remove = async (id) => {
    await deleteTimetableEntry(id);
    load();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Manage Timetable</h1>
        <p className="page-subtitle">Create, update, and organize class schedules by day, branch, and year.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">Timetable List</h2>
          </div>

          <DataTable
            columns={[
              { 
                label: "Day", 
                render: (row) => <span className="font-semibold text-slate-900">{row.day.substring(0, 3)}</span>
              },
              { label: "Subject", accessor: "subject", className: "font-semibold text-slate-900" },
              { label: "Teacher", accessor: "teacher", className: "text-slate-600" },
              { 
                label: "Room", 
                render: (row) => <span className="badge badge-neutral bg-slate-100">{row.room}</span> 
              },
              { 
                label: "Time", 
                render: (row) => <span className="text-slate-600 font-medium">{row.start_time} - {row.end_time}</span> 
              },
              {
                label: "Actions",
                render: (row) => (
                  <div className="flex gap-2">
                    <button className="btn btn-secondary text-xs" onClick={() => startEdit(row)}>
                      Edit
                    </button>
                    <button className="btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-200 text-xs" onClick={() => remove(row.id)}>
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            data={list.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))}
          />
        </div>

        <div className="card p-6 h-fit sticky top-24 bg-gradient-to-br from-white to-slate-50">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-heading font-bold text-slate-900">{editingId ? `Edit Class #${editingId}` : "Add Class"}</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{editingId ? "Update class details below." : "Schedule a new class."}</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="label">Day of Week</label>
              <select
                required
                className="input-field bg-white"
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                <option value="">Select day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Subject</label>
              <input
                required
                placeholder="e.g. Data Structures"
                className="input-field"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Teacher</label>
              <input
                required
                placeholder="e.g. Prof. Smith"
                className="input-field"
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Room</label>
              <input
                required
                placeholder="e.g. 101A"
                className="input-field"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Time</label>
                <input
                  required
                  type="time"
                  className="input-field"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                />
              </div>
              <div>
                <label className="label">End Time</label>
                <input
                  required
                  type="time"
                  className="input-field"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Branch</label>
                <input
                  required
                  placeholder="e.g. CSE"
                  className="input-field"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Year</label>
                <input
                  required
                  placeholder="e.g. 2"
                  className="input-field"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

            <div className="pt-2">
              <button className="btn btn-primary w-full py-3" type="submit">
                {editingId ? "Update Class" : "Add Class"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-ghost w-full mt-2 text-slate-500"
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
