import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Notebook,
  Clock,
  Zap,
  User,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  Rocket,
  Bot,
  TrendingUp,
  Award,
  Coffee,
} from 'lucide-react';

const ModernDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: Notebook },
    { id: 'events', label: 'Events', icon: Clock },
    { id: 'ai-helper', label: 'AI Helper', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Networking', teacher: 'Mehta Sir', time: '12:00 PM', room: 'A201', icon: Zap },
    { id: 2, subject: 'Operating Systems', teacher: 'Verma Sir', time: '2:00 PM', room: 'B105', icon: GraduationCap },
    { id: 3, subject: 'DBMS', teacher: 'Sharma Sir', time: '10:00 AM', room: 'C301', icon: Notebook },
    { id: 4, subject: 'Software Engg', teacher: 'Roy Mam', time: '1:00 PM', room: 'D401', icon: BookOpen },
  ];

  const eventAvatars = [
    { initials: 'AK', color: 'bg-orange-500' },
    { initials: 'MK', color: 'bg-emerald-500' },
    { initials: 'RJ', color: 'bg-pink-500' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-orange-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col border-r border-slate-200">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CH</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900">CampusHub</h1>
              <p className="text-xs text-slate-500">College Super App</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-emerald-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search classes, notes, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:shadow-lg transition-all duration-200">
                RK
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Rahul Kumar</span>
                <span className="text-xs text-slate-500">Student</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Rahul 👋</h1>
            <p className="text-slate-500">Here's what's happening today.</p>
          </div>

          {/* First Row - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Today's Classes Card */}
            <div className="group bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-20 text-white">
                <Rocket size={60} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span className="font-semibold">Today's Classes</span>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">4 classes</span>
                </div>

                <div className="mt-6 mb-4">
                  <h3 className="text-3xl font-bold mb-1">Data Structures</h3>
                  <p className="text-white/80">Room A101</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/90 mb-6">
                  <Clock size={16} />
                  <span>10:00 AM – 11:00 AM</span>
                  <span className="h-1 w-1 rounded-full bg-white/60 mx-1" />
                  <span>Dr. Mehta</span>
                </div>

                <button className="w-full bg-white text-orange-600 font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200">
                  View Timetable
                </button>
              </div>
            </div>

            {/* Attendance Card */}
            <div className="group bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} />
                    <span className="font-semibold">Attendance</span>
                  </div>
                  <Sparkles size={18} className="text-white/80" />
                </div>

                <div className="flex items-center justify-center my-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="212.06"
                        strokeDashoffset="32.02"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">85%</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-white/90 mb-6">Good standing</p>

                <div className="flex gap-2">
                  <div className="flex -space-x-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                  <button className="flex-1 bg-white/15 border border-white/30 font-semibold py-2 rounded-lg hover:bg-white/25 transition-all duration-200">
                    Track Attendance
                  </button>
                </div>
              </div>
            </div>

            {/* AI Study Helper Card */}
            <div className="group bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 opacity-20">
                <Bot size={80} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot size={18} />
                    <span className="font-semibold">AI Study Helper</span>
                  </div>
                  <span className="bg-white/10 px-2 py-1 rounded-md text-xs font-medium">Ask me</span>
                </div>

                <p className="text-sm text-white/80 my-3">Explain DBMS • Generate quiz</p>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button className="bg-white text-slate-900 font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                    Ask
                  </button>
                  <button className="border border-white/30 font-semibold py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                    Browse
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - 2 Cards + Table */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Notes Library */}
            <div className="group bg-gradient-to-br from-orange-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span className="font-semibold text-sm">Notes Library</span>
                  </div>
                  <Users size={16} className="opacity-70" />
                </div>

                <h3 className="text-2xl font-bold mb-1">24 files</h3>
                <p className="text-sm text-white/80 mb-6">Room 459</p>

                <button className="w-full bg-white text-emerald-600 font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm">
                  Browse Notes
                </button>
              </div>
            </div>

            {/* More Resources */}
            <div className="group bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award size={18} />
                    <span className="font-semibold text-sm">Resources</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-1">Premium</h3>
                <p className="text-sm text-white/80 mb-6">Access all resources</p>

                <button className="w-full bg-white text-emerald-700 font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm">
                  Explore
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="md:col-span-2 group bg-gradient-to-br from-lime-300 to-green-400 rounded-2xl p-6 text-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-white transition-opacity" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Upcoming Event</h3>
                  <TrendingUp size={18} className="text-slate-700" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Advanced Algorithms</h2>
                <p className="text-sm text-slate-700 mb-1">2026-03-19 | 18:30</p>
                <p className="text-sm text-slate-700 mb-4">Innovation Center Hall</p>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {eventAvatars.map((avatar, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 ${avatar.color} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/40`}
                      >
                        {avatar.initials}
                      </div>
                    ))}
                  </div>
                  <button className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm ml-auto">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Classes Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-orange-500" />
                Upcoming Classes
              </h3>
              <button className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 text-sm">
                View Full <ChevronRight size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingClasses.map((classItem, idx) => {
                    const Icon = classItem.icon;
                    return (
                      <tr
                        key={classItem.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                              <Icon size={16} />
                            </div>
                            <span className="font-medium text-slate-900">{classItem.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {classItem.teacher.charAt(0)}
                            </div>
                            <span className="text-slate-600">{classItem.teacher}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{classItem.time}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">{classItem.room}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-600">Showing 4 of 12 classes</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">←</button>
                <button className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">→</button>
              </div>
            </div>
          </div>

          {/* Study Tips Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Coffee size={18} className="text-amber-600" />
                <span className="font-semibold text-slate-900">Study Tip</span>
              </div>
              <p className="text-sm text-slate-600">Take breaks every 25-30 minutes for better focus and retention.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-600" />
                <span className="font-semibold text-slate-900">Progress</span>
              </div>
              <p className="text-sm text-slate-600">You're 78% through your semester goals. Keep it up!</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="text-yellow-600" />
                <span className="font-semibold text-slate-900">Achievement</span>
              </div>
              <p className="text-sm text-slate-600">Completed 5 assignments on time this week!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
