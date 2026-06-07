import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ExamProvider } from "./context/ExamContext";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import { seedDemoData } from "./services/localStorageService";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";

// Pages - Public
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Pages - Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminExams from "./pages/admin/Exams";
import AdminStudents from "./pages/admin/Students";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

// Pages - Student
import StudentDashboard from "./pages/student/Dashboard";
import StudentExams from "./pages/student/Exams";
import ExamInterface from "./pages/student/ExamInterface";
import StudentResults from "./pages/student/Results";
import StudentProfile from "./pages/student/Profile";

function AppInner() {
  useEffect(() => { seedDemoData(); }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="exams" element={<AdminExams />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="exams/:id" element={<ExamInterface />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExamProvider>
          <ToastProvider>
            <AppInner />
          </ToastProvider>
        </ExamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
