import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  LineChart,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const featureCards = [
  {
    icon: CalendarDays,
    title: "Smart Timetable",
    description: "Daily classes, rooms, and quick filters by branch and year in one focused view.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: LineChart,
    title: "Attendance Intelligence",
    description: "Track subject-level attendance and get instant visibility on the 75% threshold.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: NotebookPen,
    title: "Notes Pipeline",
    description: "Students upload notes, admins review, and approved material becomes instantly discoverable.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Bot,
    title: "AI Study Helper",
    description: "Explain topics, generate quick quizzes, and summarize concepts directly inside the app.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const moduleGroups = [
  {
    icon: GraduationCap,
    label: "Student Workspace",
    bullets: ["Dashboard overview", "Bunk calculator", "Events registration", "Profile and files"],
  },
  {
    icon: ShieldCheck,
    label: "Admin Control Center",
    bullets: ["Manage students", "Moderate notes", "Update attendance", "Publish timetable/events"],
  },
  {
    icon: Users,
    label: "Campus Collaboration",
    bullets: ["Unified data model", "Role-based access", "Fast API integration", "Single source of truth"],
  },
];

const launchSteps = [
  "Sign in with student or admin role",
  "Open your role dashboard instantly",
  "Manage classes, attendance, notes, and events",
  "Use AI helper for faster revision and prep",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const { user } = useAuth();
  const dashboardPath = user ? (user.role === "admin" ? "/admin/dashboard" : "/student/dashboard") : "/login";

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-[#FAFAFA] selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-heading font-black tracking-tight text-slate-900">CampusHub</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#modules" className="hover:text-slate-900 transition-colors">Modules</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
          </nav>

          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block px-4 py-2">
                Log in
              </Link>
            )}
            <Link to={dashboardPath} className="btn btn-primary shadow-primary/20 shadow-md transform hover:-translate-y-0.5 transition-all">
              {user ? "Dashboard" : "Get Started"}
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-16 pb-24">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                  <Sparkles size={14} /> Campus OS 2.0
                </span>
                <h1 className="text-5xl sm:text-6xl font-heading font-black leading-[1.1] tracking-tight text-slate-900 mt-4">
                  Manage college life <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">beautifully.</span>
                </h1>
                <p className="max-w-xl text-lg text-slate-500 mt-6 leading-relaxed font-medium">
                  CampusHub unifies timetable, attendance, notes, events, and AI study help so students and admins work from one delightfully clean workspace.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                <Link to={dashboardPath} className="btn btn-primary py-3.5 px-6 text-base shadow-xl shadow-primary/20 transform hover:-translate-y-1 transition-all">
                  {user ? "Continue to workspace" : "Launch CampusHub"}
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-outline py-3.5 px-6 text-base bg-white">
                    Create free account
                  </Link>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/60 w-fit">
                <div>
                  <div className="text-3xl font-heading font-black text-slate-900">10x</div>
                  <div className="text-sm font-medium text-slate-500 mt-1">Faster workflow</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-slate-900">100%</div>
                  <div className="text-sm font-medium text-slate-500 mt-1">Cloud synced</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-slate-900">24/7</div>
                  <div className="text-sm font-medium text-slate-500 mt-1">AI available</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Dashboard Preview Mockup */}
              <div className="relative rounded-2xl md:rounded-[2rem] border border-slate-200/60 bg-white/50 backdrop-blur-md p-2 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-50 z-0"></div>
                <div className="card border-slate-200/50 shadow-sm relative z-10 p-6 flex flex-col gap-6 bg-white overflow-hidden pointer-events-none">
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                      <div>
                        <div className="h-3 w-24 bg-slate-200 rounded-full"></div>
                        <div className="h-2 w-16 bg-slate-100 rounded-full mt-2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 hidden sm:block"></div>
                       <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 hidden sm:block"></div>
                    </div>
                  </div>

                  {/* Mockup Content */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                       <div>
                         <div className="text-sm font-bold text-slate-900">Attendance Health</div>
                         <div className="text-xs font-medium text-slate-500 mt-1">Overall 84% • 2 subjects need attention</div>
                       </div>
                       <div className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold uppercase tracking-wider">Action Needed</div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                       <CalendarDays size={16} className="text-slate-400 mb-2" />
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Next Class</div>
                       <div className="text-sm font-bold text-slate-800">DBMS - 10:15</div>
                       <div className="text-xs font-medium text-slate-500 mt-1">Room A-203</div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                       <NotebookPen size={16} className="text-slate-400 mb-2" />
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Notes Queue</div>
                       <div className="text-sm font-bold text-slate-800">12 Approved</div>
                       <div className="text-xs font-medium text-slate-500 mt-1">3 Pending Review</div>
                    </div>

                    <div className="col-span-2 p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-accent/5 to-transparent flex items-start gap-3 mt-2">
                      <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 mb-1">AI Study Helper</div>
                        <div className="text-xs font-medium text-slate-600 leading-relaxed max-w-[90%]">"Generate 5 MCQs from the Operating Systems deadlock chapter for my upcoming midterms..."</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Decorative graphic elements around mockup */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-gradient-to-br from-primary to-orange-500 rounded-2xl -z-10 blur-xl opacity-30"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 bg-gradient-to-br from-accent to-emerald-500 rounded-full -z-10 blur-xl opacity-30"></div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32 pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Core Features</h2>
            <p className="text-3xl md:text-4xl font-heading font-black text-slate-900">Everything required for a productive college week.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.article 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card p-6 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200/60"
                >
                  <div className={`h-12 w-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="bg-slate-900 py-24 my-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Architecture</h2>
              <p className="text-3xl md:text-4xl font-heading font-black text-white">Built for scale, speed, and simplicity.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {moduleGroups.map((group, i) => {
                const Icon = group.icon;
                return (
                  <motion.div 
                    key={group.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="rounded-3xl border border-slate-800 bg-slate-800/50 p-8 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-slate-700/50 rounded-xl text-white">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{group.label}</h3>
                    </div>
                    <ul className="space-y-4">
                      {group.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-slate-300">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32 pt-10">
          <div className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Fast Onboarding</h2>
            <p className="text-3xl md:text-4xl font-heading font-black text-slate-900">Start using it in minutes.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {launchSteps.map((step, idx) => (
              <motion.div 
                key={step} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Arrow graphic for md+ screens */}
                {idx < launchSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-slate-300 z-10 -translate-y-1/2">
                    <ArrowRight size={24} />
                  </div>
                )}
                <div className="card p-6 border-slate-200/60 bg-white h-full relative z-0">
                  <div className="text-4xl font-heading font-black text-slate-100 absolute top-4 right-4 pointer-events-none">0{idx + 1}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 relative z-10">Step {idx + 1}</div>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed relative z-10">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-600 p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 max-w-2xl text-white">Ready to upgrade your campus workflow?</h2>
              <p className="text-lg text-white/80 max-w-xl mb-10 font-medium pb-2">
                Join with a student or admin account and start managing your daily operations from one beautiful place.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link to={dashboardPath} className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-xl font-bold text-base hover:bg-slate-50 transition-colors shadow-lg shadow-black/10 transform hover:-translate-y-1">
                  {user ? "Open Dashboard" : "Get Started Now"}
                </Link>
                {!user && (
                  <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-dark/30 hover:bg-primary-dark/40 text-white rounded-xl font-bold text-base transition-colors border border-white/20">
                    Create free account
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 font-heading">CampusHub</span>
          </div>
          <div className="text-xs font-medium text-slate-500">
            &copy; {new Date().getFullYear()} CampusHub Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
