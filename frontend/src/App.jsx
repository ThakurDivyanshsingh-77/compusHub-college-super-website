import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/Student/Dashboard";
import Timetable from "./pages/Student/Timetable";
import Attendance from "./pages/Student/Attendance";
import BunkCalculator from "./pages/Student/BunkCalculator";
import Notes from "./pages/Student/Notes";
import Events from "./pages/Student/Events";
import AIHelper from "./pages/Student/AIHelper";
import Profile from "./pages/Student/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageStudents from "./pages/Admin/ManageStudents";
import ManageTimetable from "./pages/Admin/ManageTimetable";
import ManageNotes from "./pages/Admin/ManageNotes";
import ManageEvents from "./pages/Admin/ManageEvents";
import ManageAttendance from "./pages/Admin/ManageAttendance";
import NotFound from "./pages/NotFound";

export default function App() {
  const { user } = useAuth();
  const dashboardPath = user ? (user.role === "admin" ? "/admin/dashboard" : "/student/dashboard") : "/login";

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Navigate to={dashboardPath} replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/timetable"
        element={
          <ProtectedRoute role="student">
            <Timetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute role="student">
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/bunk-calculator"
        element={
          <ProtectedRoute role="student">
            <BunkCalculator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notes"
        element={
          <ProtectedRoute role="student">
            <Notes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/events"
        element={
          <ProtectedRoute role="student">
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/ai-helper"
        element={
          <ProtectedRoute role="student">
            <AIHelper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute role="admin">
            <ManageStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetable"
        element={
          <ProtectedRoute role="admin">
            <ManageTimetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notes"
        element={
          <ProtectedRoute role="admin">
            <ManageNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute role="admin">
            <ManageAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute role="admin">
            <ManageEvents />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
