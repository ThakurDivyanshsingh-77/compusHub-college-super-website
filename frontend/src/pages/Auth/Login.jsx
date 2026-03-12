import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, GraduationCap, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-shell flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 pattern-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.35),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(168,85,247,0.3),transparent_36%)]" />

        <div className="relative z-10 flex flex-col justify-center px-14 xl:px-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center shadow-strong">
              <GraduationCap size={27} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CampusHub</h1>
              <p className="text-slate-300">College Super App</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight text-white">
            Welcome back to your
            <span className="block text-gradient">academic command center</span>
          </h2>

          <p className="mt-5 max-w-md text-slate-300 text-lg">
            Continue with timetable tracking, attendance insights, notes access, event updates, and AI-powered study help.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Smart daily dashboard",
              "Realtime attendance tracking",
              "Fast notes and events access",
              "AI helper for revision",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2 text-slate-200">
                <span className="h-6 w-6 rounded-full bg-white/10 border border-white/15 inline-flex items-center justify-center">
                  <Sparkles size={12} className="text-purple-300" />
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Back to home
            </Link>
            <div className="lg:hidden inline-flex items-center gap-2 text-slate-900">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-purple-800 text-white flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
              <span className="font-semibold">CampusHub</span>
            </div>
          </div>

          <div className="soft-panel p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Sign in</h3>
              <p className="mt-1 text-slate-500">Access your student or admin workspace</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</span>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-9"
                    placeholder="student@college.edu"
                  />
                </div>
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Password</span>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-9"
                    placeholder="Enter your password"
                  />
                </div>
              </label>

              {error && <div className="badge badge-danger w-full justify-center py-2">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              New here?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
