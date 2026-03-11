import { useEffect, useState } from "react";
import { Download, Upload, Star, BookOpen } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { downloadNote, fetchNotes, rateNote, uploadNote } from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";

export default function Notes() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ branch: "", year: "", subject: "", search: "" });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", branch: "", year: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:5000";

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await fetchNotes(filters);
      setNotes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !filters.branch && !filters.year) {
      setFilters((f) => ({ ...f, branch: user.branch || "", year: user.year || "" }));
      setForm((f) => ({ ...f, branch: user.branch || "", year: user.year || "" }));
    }
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.branch, filters.year, filters.subject, filters.search, user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", form.title);
    fd.append("subject", form.subject);
    fd.append("branch", form.branch);
    fd.append("year", form.year);

    try {
      await uploadNote(fd);
      setMessage("Uploaded successfully. Awaiting admin approval.");
      setForm({ ...form, title: "", subject: "" });
      setFile(null);
      loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (id, url) => {
    const fullUrl = url?.startsWith("http") ? url : `${backendOrigin}${url}`;
    await downloadNote(id);
    window.open(fullUrl, "_blank");
  };

  const handleRate = async (id, rating) => {
    await rateNote(id, rating);
    loadNotes();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Notes Library</h1>
        <p className="page-subtitle">Browse approved notes and upload your study material for admin review.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-heading font-bold text-slate-900">Approved Notes</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap w-full md:w-auto">
              {[
                ["branch", "Branch"],
                ["year", "Year"],
                ["subject", "Subject"],
                ["search", "Search"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  placeholder={label}
                  className="input-field md:w-32 bg-slate-50"
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                />
              ))}
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium w-full text-center">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <article key={note.id} className="group rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-default">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">{note.title}</h3>
                    <span className="badge badge-neutral uppercase tracking-widest text-[10px]">{note.file_type}</span>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-700">{note.subject}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">Uploaded by <span className="text-slate-700">{note.uploaded_by_name}</span></div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{note.branch}</span>
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Year {note.year}</span>
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{note.downloads} Downloads</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-slate-100">
                    <button
                      className="btn btn-secondary text-xs px-3 py-1.5"
                      onClick={() => handleDownload(note.id, note.file_url)}
                    >
                      <Download size={14} className="mr-1.5" />
                      Download
                    </button>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= Math.round(note.rating_avg || 0);
                        return (
                          <button
                            key={star}
                            onClick={() => handleRate(note.id, star)}
                            className={`h-7 w-7 rounded-lg inline-flex items-center justify-center border transition-all ${
                              active
                                ? "text-amber-500 border-amber-200 bg-amber-50"
                                : "text-slate-300 border-slate-100 bg-slate-50 hover:bg-slate-100"
                            }`}
                            title={`Rate ${star}`}
                          >
                            <Star size={12} fill="currentColor" strokeWidth={active ? 1.5 : 2} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                    Rating {Number(note.rating_avg || 0).toFixed(1)} ({note.rating_count})
                  </div>
                </article>
              ))}

              {notes.length === 0 && <div className="col-span-2 text-sm font-medium text-slate-500 bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">No notes found. Try adjusting your filters.</div>}
            </div>
          )}
        </div>

        <div className="card p-6 h-fit sticky top-24 bg-gradient-to-br from-white to-slate-50">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-heading font-bold text-slate-900">Upload Notes</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Share your study material with the community.</p>
          </div>

          <form className="space-y-4" onSubmit={handleUpload}>
            {[
              ["title", "Title", "e.g. Unit 1 Summary"],
              ["subject", "Subject", "e.g. Operating Systems"],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  required
                  placeholder={placeholder}
                  className="input-field bg-white"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              {[
                ["branch", "Branch", "e.g. CSE"],
                ["year", "Year", "e.g. 3"],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input
                    required
                    placeholder={placeholder}
                    className="input-field bg-white"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="label">File Document</label>
              <input
                type="file"
                required
                className="input-field bg-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <button type="submit" disabled={uploading} className="btn btn-primary w-full py-3 mt-2 shadow-primary/20 shadow-lg">
              <Upload size={16} className="mr-2" />
              {uploading ? "Uploading..." : "Upload for Approval"}
            </button>
          </form>

          {message && <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium text-center">{message}</div>}

          <p className="mt-4 text-xs font-medium text-slate-400 text-center px-4">
            Uploaded files go to admins for approval before appearing in the public notes library.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
