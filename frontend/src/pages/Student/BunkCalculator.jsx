import { useState } from "react";
import { Calculator } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { calculateBunk } from "../../services/studentService";

export default function BunkCalculator() {
  const [form, setForm] = useState({ totalClasses: "", attendedClasses: "", minimumAttendance: 75 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await calculateBunk(form);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Bunk Calculator</h1>
        <p className="page-subtitle">Plan your attendance and understand how many classes you can safely miss.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 h-fit bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">Calculate Allowance</h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Total Classes Conducted</label>
              <input
                type="number"
                required
                className="input-field bg-white"
                placeholder="e.g. 40"
                value={form.totalClasses}
                onChange={(e) => setForm({ ...form, totalClasses: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Classes Attended</label>
              <input
                type="number"
                required
                className="input-field bg-white"
                placeholder="e.g. 35"
                value={form.attendedClasses}
                onChange={(e) => setForm({ ...form, attendedClasses: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Minimum Attendance Target (%)</label>
              <input
                type="number"
                className="input-field bg-white font-medium"
                value={form.minimumAttendance}
                onChange={(e) => setForm({ ...form, minimumAttendance: e.target.value })}
              />
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

            <div className="pt-2">
              <button className="btn btn-primary w-full py-3 shadow-primary/20 shadow-lg" type="submit" disabled={loading}>
                {loading ? "Calculating..." : "Calculate My Fate"}
              </button>
            </div>
          </form>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">Prediction Results</h2>
          
          {result ? (
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-inner">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Current Status</span>
                <span className={`text-xl font-bold ${result.currentPercentage >= form.minimumAttendance ? 'text-green-600' : 'text-red-500'}`}>
                  {result.currentPercentage}%
                </span>
              </div>
              
              <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm ${
                result.allowedBunks > 0 
                  ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50' 
                  : 'border-red-200 bg-gradient-to-br from-red-50 to-red-100/50'
              }`}>
                <span className="text-sm font-bold uppercase tracking-widest mb-1 opacity-70">You can safely bunk</span>
                <span className={`text-5xl font-heading font-bold block my-2 shadow-sm ${result.allowedBunks > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.allowedBunks}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest mt-1 opacity-70">Classes</span>
              </div>
              
              <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4 mt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Future Prediction</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                    <span className="text-xs font-medium text-slate-500">If you attend next 10</span>
                    <span className="text-lg font-bold text-slate-700">{result.futurePrediction.ifAttendNext10}%</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                    <span className="text-xs font-medium text-slate-500">If you use bunks</span>
                    <span className="text-lg font-bold text-slate-700">{result.futurePrediction.ifUseAllAllowedBunks}%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-2xl border border-slate-100 h-[400px]">
              <div className="h-16 w-16 bg-slate-200/50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Calculator size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Awaiting Data</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-[250px]">Enter your current attendance stats on the left to see your bunk allowance.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
