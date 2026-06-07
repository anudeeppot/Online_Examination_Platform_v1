import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/student/exams", label: "Exams", icon: "📋" },
  { to: "/student/results", label: "Results", icon: "📊" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];
const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/admin/students", label: "Students", icon: "👥" },
  { to: "/admin/exams", label: "Exam Management", icon: "📋" },
  { to: "/admin/reports", label: "Reports", icon: "📊" },
  { to: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => { logout(); navigate("/login"); if (onClose) onClose(); };

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 flex flex-col sidebar-glow z-40 transition-transform duration-300
      ${isDark ? "bg-surface-800 border-r border-surface-500" : "bg-white border-r border-light-border"}
      ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className={`p-6 border-b ${isDark ? "border-surface-500" : "border-light-border"} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <span className="text-surface-900 font-display font-bold">EP</span>
          </div>
          <div>
            <div className="font-display font-bold gradient-text text-sm">ExamPortal</div>
            <div className={`text-xs ${isDark ? "text-gray-500" : "text-light-muted"}`}>{isAdmin ? "Admin Panel" : "Student Portal"}</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white text-xl">✕</button>
      </div>

      <div className={`px-4 py-4 border-b ${isDark ? "border-surface-500" : "border-light-border"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-display font-bold text-white text-sm">
            {(user?.name || user?.username || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-body font-medium text-sm truncate ${isDark ? "text-gray-100" : "text-light-text"}`}>{user?.name || user?.username}</div>
            <div className={`text-xs truncate ${isDark ? "text-gray-500" : "text-light-muted"}`}>{user?.email}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-body text-sm ${
                isActive
                  ? isDark ? "text-accent bg-accent/10 border border-accent/20" : "text-accent bg-accent/5 border border-accent/20"
                  : isDark ? "text-gray-400 hover:text-accent hover:bg-accent/5" : "text-light-muted hover:text-accent hover:bg-accent/5"
              }`}>
            <span className="text-base">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 border-t ${isDark ? "border-surface-500" : "border-light-border"} space-y-2`}>
        <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-colors ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-surface-600" : "text-light-muted hover:text-light-text hover:bg-light-bg"}`}>
          <span>{isDark ? "☀" : "🌙"}</span>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-colors text-rose-400 hover:bg-rose-400/10">
          <span>↩</span><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
