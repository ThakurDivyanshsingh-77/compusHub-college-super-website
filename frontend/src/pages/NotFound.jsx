import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen app-shell flex items-center justify-center px-4">
      <div className="soft-panel max-w-lg w-full p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 text-slate-700 inline-flex items-center justify-center">
          <AlertCircle size={26} />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-secondary">
            Go home
          </Link>
          <Link to="/dashboard" className="btn-primary">
            Open dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
