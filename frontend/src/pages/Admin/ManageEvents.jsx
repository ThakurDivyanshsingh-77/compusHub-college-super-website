import { useEffect, useState } from "react";
import { CalendarRange, X, Users } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { createEvent, deleteEvent, updateEvent, fetchEventRegistrations } from "../../services/adminService";
import { fetchEvents } from "../../services/studentService";

const emptyForm = { title: "", description: "", date: "", location: "" };

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [viewingEvent, setViewingEvent] = useState(null);

  const load = async () => {
    const res = await fetchEvents();
    setEvents(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateEvent(editingId, form);
    } else {
      await createEvent(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      description: row.description,
      date: row.date,
      location: row.location,
    });
  };

  const remove = async (id) => {
    if(!window.confirm("Are you sure you want to delete this event?")) return;
    await deleteEvent(id);
    load();
  };

  const loadRegistrations = async (row) => {
    setViewingEvent(row);
    setLoadingRegistrations(true);
    try {
      const res = await fetchEventRegistrations(row.id);
      setRegistrations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const closeRegistrations = () => {
    setViewingEvent(null);
    setRegistrations([]);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Manage Events</h1>
        <p className="page-subtitle">Publish and maintain event announcements visible to all students.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <CalendarRange size={20} />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">Events List</h2>
          </div>

          <DataTable
            columns={[
              { label: "Title", accessor: "title", className: "font-semibold text-slate-900" },
              { 
                label: "Date",
                render: (row) => (
                  <span className="badge badge-neutral bg-slate-100">{new Date(row.date).toLocaleDateString()}</span>
                )
              },
              { label: "Location", accessor: "location", className: "text-slate-600" },
              {
                label: "Actions",
                render: (row) => (
                  <div className="flex gap-2">
                    <button className="btn btn-primary bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none shadow-none text-xs px-2" onClick={() => loadRegistrations(row)} title="View Registrations">
                      <Users size={14} className="mr-1" />
                      View
                    </button>
                    <button className="btn btn-secondary text-xs px-2" onClick={() => startEdit(row)}>
                      Edit
                    </button>
                    <button className="btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-200 text-xs px-2" onClick={() => remove(row.id)}>
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            data={events}
          />
        </div>

        <div className="card p-6 h-fit sticky top-24 bg-gradient-to-br from-white to-slate-50">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-heading font-bold text-slate-900">{editingId ? `Edit Event #${editingId}` : "Create Event"}</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{editingId ? "Update the details below." : "Announce something new."}</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="label">Title</label>
              <input
                required
                placeholder="e.g. Annual Tech Fest"
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="label">Description</label>
              <textarea
                required
                placeholder="Details about the event..."
                className="input-field min-h-[100px] resize-y"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  className="input-field"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  required
                  placeholder="e.g. Main Auditorium"
                  className="input-field"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <button className="btn btn-primary w-full py-3 shadow-primary/20 shadow-lg" type="submit">
                {editingId ? "Update Event" : "Publish Event"}
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

      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl bg-white shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-heading font-bold text-slate-900">Registrations for {viewingEvent.title}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{registrations.length} students have signed up.</p>
              </div>
              <button className="btn btn-icon text-slate-400 hover:bg-slate-100" onClick={closeRegistrations}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {loadingRegistrations ? (
                <div className="flex items-center justify-center min-h-[100px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium">
                  No registrations found for this event yet.
                </div>
              ) : (
                <DataTable
                  columns={[
                    { label: "Name", accessor: "name", className: "font-semibold text-slate-900" },
                    { label: "Email", accessor: "email", className: "text-slate-500" },
                    { 
                      label: "Batch", 
                      render: (row) => (
                        <div className="flex flex-wrap gap-1">
                          <span className="badge badge-neutral bg-slate-100">{row.branch || 'N/A'}</span>
                          <span className="badge badge-neutral bg-slate-100">Year {row.year || 'N/A'}</span>
                        </div>
                      )
                    },
                    { 
                      label: "Registered On", 
                      render: (row) => <span className="text-slate-500">{new Date(row.registered_at).toLocaleDateString()}</span>
                    },
                  ]}
                  data={registrations}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
