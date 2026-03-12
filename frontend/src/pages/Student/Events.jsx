import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchEvents, registerEvent } from "../../services/studentService";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    const res = await fetchEvents();
    setEvents(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegister = async (id) => {
    const res = await registerEvent(id);
    setMessage(res.message);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Campus Events</h1>
        <p className="page-subtitle">Discover upcoming events and register directly from the app.</p>
      </div>

      <div className="card p-6 min-h-[500px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">Event Feed</h2>
          </div>
          {message && <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">{message}</div>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <article key={event.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-3xl -z-10 transition-transform group-hover:scale-110"></div>
                
                <div>
                  <h3 className="text-lg font-heading font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                </div>

                <div className="space-y-2 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-purple-500" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <button className="btn btn-primary w-full shadow-primary/20 shadow-lg mt-2 group-hover:bg-primary-hover transition-colors" onClick={() => handleRegister(event.id)}>
                  Register Now
                </button>
              </article>
            ))}

            {events.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-2xl border border-slate-100">
                 <CalendarDays size={48} className="text-slate-300 mb-4" />
                 <h3 className="text-lg font-semibold text-slate-700">No Upcoming Events</h3>
                 <p className="text-sm text-slate-500 mt-1">Check back later for new university events and activities.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
