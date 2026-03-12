import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { askStudyHelper } from "../../services/studentService";

const TASKS = [
  { key: "explain", label: "Explain concept" },
  { key: "quiz", label: "Generate MCQs" },
  { key: "summary", label: "Summarize notes" },
  { key: "programming", label: "Explain programming" },
  { key: "exam", label: "Exam prep" },
];

export default function AIHelper() {
  const [prompt, setPrompt] = useState("");
  const [task, setTask] = useState("explain");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await askStudyHelper({ prompt, task });
      setAnswer(res.answer);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="space-y-2">
        <div className="eyebrow">Student Module</div>
        <h1 className="page-title">AI Study Helper</h1>
        <p className="page-subtitle">Ask questions, generate quizzes, and simplify complex concepts quickly.</p>
      </section>

      <div className="soft-panel p-4 sm:p-5 space-y-4">
        <div className="inline-flex items-center gap-2 text-slate-900">
          <Bot size={18} className="text-primary" />
          <span className="section-title">Ask AI</span>
        </div>

        <form className="space-y-3" onSubmit={handleAsk}>
          <textarea
            className="textarea-field"
            placeholder="Example: Explain DBMS normalization with practical examples"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />

          <div className="flex flex-wrap gap-2">
            {TASKS.map((item) => (
              <button
                type="button"
                key={item.key}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                  task === item.key
                    ? "bg-primary text-white border-primary"
                    : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setTask(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && <div className="badge badge-danger w-full justify-center py-2">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            <Sparkles size={15} />
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap min-h-[160px]">
          {answer || "Your AI response will appear here."}
        </div>
      </div>
    </DashboardLayout>
  );
}
