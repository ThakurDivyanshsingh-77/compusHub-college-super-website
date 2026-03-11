import { useEffect, useState } from "react";
import { FileText, UserCircle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchProfile, updateProfile } from "../../services/studentService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({ photo: null, resume: null });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:5000";

  const resolveUrl = (value) => {
    if (!value) return "";
    return value.startsWith("http") ? value : `${backendOrigin}${value}`;
  };

  const load = async () => {
    setLoading(true);
    const res = await fetchProfile();
    setProfile(res.data);
    setForm({
      name: res.data.name || "",
      branch: res.data.branch || "",
      year: res.data.year || "",
      skills: res.data.skills || "",
      cgpa: res.data.cgpa || "",
      internship_experience: res.data.internship_experience || "",
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (files.photo) fd.append("profile_photo", files.photo);
      if (files.resume) fd.append("resume", files.resume);
      const res = await updateProfile(fd);
      setProfile(res.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your personal details, skills, profile photo, and resume.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 h-fit space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-heading font-bold text-slate-900">Profile Snapshot</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  {profile.profile_photo ? (
                    <img
                      src={resolveUrl(profile.profile_photo)}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full border-4 border-white shadow-md ring-2 ring-slate-100 bg-gradient-to-br from-slate-100 to-slate-200 inline-flex items-center justify-center text-slate-400">
                      <UserCircle size={40} />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                  <div className="font-heading font-bold text-xl text-slate-900">{profile.name}</div>
                  <div className="text-sm font-medium text-slate-500">{profile.email}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Academic Info</span>
                  <span className="font-semibold text-slate-900">{profile.branch} • Year {profile.year}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">CGPA</span>
                  <span className="badge badge-primary bg-primary/10 text-primary border-primary/20">{profile.cgpa || "N/A"}</span>
                </div>
                
                <div className="pt-3 border-t border-slate-200">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Skills</span>
                  <span className="text-sm font-medium text-slate-800">{profile.skills || "Add some skills to stand out!"}</span>
                </div>
                
                <div className="pt-2">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Internship</span>
                  <span className="text-sm font-medium text-slate-800">{profile.internship_experience || "No internship experience added yet."}</span>
                </div>
              </div>

              {profile.resume_url && (
                <a
                  className="btn btn-outline w-full shadow-sm hover:border-slate-300"
                  href={resolveUrl(profile.resume_url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={16} className="mr-2" />
                  View Current Resume
                </a>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 card p-6">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">Edit Profile</h2>

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { key: "name", label: "Full Name", placeholder: "e.g. John Doe" },
                { key: "branch", label: "Branch", placeholder: "e.g. Computer Science" },
                { key: "year", label: "Current Year", placeholder: "e.g. 3" },
                { key: "cgpa", label: "CGPA", placeholder: "e.g. 8.5" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  <input
                    className="input-field"
                    placeholder={field.placeholder}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                </div>
              ))}
              
              <div className="md:col-span-2">
                <label className="label">Skills</label>
                <input
                  className="input-field"
                  placeholder="e.g. React, Node.js, Python (comma separated)"
                  value={form.skills || ""}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="label">Internship Experience</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Describe your internship experiences..."
                  value={form.internship_experience || ""}
                  onChange={(e) => setForm({ ...form, internship_experience: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <label className="label">Profile Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="input-field text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all cursor-pointer" 
                  onChange={(e) => setFiles({ ...files, photo: e.target.files?.[0] || null })} 
                />
              </div>
              
              <div className="flex-1">
                <label className="label">Resume Document</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  className="input-field text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all cursor-pointer" 
                  onChange={(e) => setFiles({ ...files, resume: e.target.files?.[0] || null })} 
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <button type="submit" disabled={saving} className="btn btn-primary min-w-[160px] py-3 shadow-primary/20 shadow-lg">
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
              
              {message && <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex-1 text-center sm:text-left">{message}</div>}
              {error && <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex-1 text-center sm:text-left">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
