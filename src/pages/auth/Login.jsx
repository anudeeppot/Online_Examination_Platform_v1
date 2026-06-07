import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(form.username, form.password);
      if (result.ok) {
        navigate(result.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  const fill = (u, p) => setForm({ username: u, password: p });

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-surface-900" : "bg-light-bg"}`}>
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 hero-glow flex-col justify-between p-12 border-r border-surface-500/30">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <span className="text-surface-900 font-display font-bold">EP</span>
          </div>
          <span className="font-display font-bold text-xl gradient-text">ExamPortal</span>
        </Link>
        <div>
          <blockquote className={`font-display text-4xl font-bold leading-tight mb-6 ${isDark ? "text-white" : "text-light-text"}`}>
            "Education is the<br />most powerful weapon<br /><span className="gradient-text">you can use."</span>
          </blockquote>
          <p className={`font-body ${isDark ? "text-gray-500" : "text-light-muted"}`}>— Nelson Mandela</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-surface-700/50 border-surface-500" : "bg-white border-light-border"}`}>
          <p className={`font-mono text-xs mb-3 ${isDark ? "text-gray-500" : "text-light-muted"}`}>DEMO CREDENTIALS</p>
          <div className="space-y-2">
            <button onClick={() => fill("admin", "admin123")} className={`w-full text-left p-3 rounded-xl border transition-colors ${isDark ? "bg-surface-600 border-surface-400 hover:border-accent/50 text-gray-300" : "bg-light-bg border-light-border hover:border-accent/50 text-light-text"}`}>
              <span className="font-mono text-xs text-gold">ADMIN</span>
              <div className="text-sm mt-0.5">admin / admin123</div>
            </button>
            <button onClick={() => fill("arjun_s", "test123")} className={`w-full text-left p-3 rounded-xl border transition-colors ${isDark ? "bg-surface-600 border-surface-400 hover:border-accent/50 text-gray-300" : "bg-light-bg border-light-border hover:border-accent/50 text-light-text"}`}>
              <span className="font-mono text-xs text-accent">STUDENT</span>
              <div className="text-sm mt-0.5">Register new or use registered account</div>
            </button>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-surface-900 font-bold text-xs">EP</span>
              </div>
              <span className="font-display font-bold gradient-text">ExamPortal</span>
            </Link>
            <button onClick={toggleTheme} className={`ml-auto p-2 rounded-lg ${isDark ? "text-gray-400 hover:text-accent" : "text-light-muted hover:text-accent"}`}>
              {isDark ? "☀" : "🌙"}
            </button>
          </div>

          <h1 className={`font-display font-bold text-3xl mb-2 ${isDark ? "text-white" : "text-light-text"}`}>Welcome back</h1>
          <p className={`font-body mb-8 ${isDark ? "text-gray-400" : "text-light-muted"}`}>Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className={isDark ? "input-field" : "input-light"}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className={isDark ? "input-field" : "input-light"}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm font-body ${isDark ? "text-gray-400" : "text-light-muted"}`}>
            Don't have an account?{" "}
            <Link to="/register" className="text-accent hover:underline font-medium">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
