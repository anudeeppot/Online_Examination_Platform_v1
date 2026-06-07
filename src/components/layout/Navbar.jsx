import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b ${isDark ? "bg-surface-800/90 border-surface-500 backdrop-blur-xl" : "bg-white/90 border-light-border backdrop-blur-xl"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-surface-900 font-display font-bold text-sm">EP</span>
          </div>
          <span className="font-display font-bold text-lg gradient-text">ExamPortal</span>
        </Link>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-accent hover:bg-accent/10" : "text-light-muted hover:text-accent hover:bg-accent/10"}`}>
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className={`text-sm font-body ${isDark ? "text-gray-300" : "text-light-muted"}`}>
                {user.name || user.username}
              </span>
              <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-4">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
