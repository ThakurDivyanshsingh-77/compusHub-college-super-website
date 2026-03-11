export default function StatCard({ label, value, accent = "primary", children }) {
  const accentMap = {
    primary: "from-primary to-orange-500 shadow-primary/20",
    orange: "from-orange-500 to-amber-500 shadow-orange-500/20",
    green: "from-accent to-emerald-500 shadow-accent/20",
    purple: "from-indigo-500 to-purple-500 shadow-indigo-500/20",
  };

  const accentClass = accentMap[accent] || accentMap.primary;

  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-1 tracking-wide">{label}</div>
          <div className="text-3xl font-heading font-bold text-slate-900 tracking-tight">{value}</div>
        </div>
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${accentClass} text-white shadow-lg flex-shrink-0`}>
          {children}
        </div>
      </div>
    </div>
  );
}
