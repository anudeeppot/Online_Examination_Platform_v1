import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    setTimeout(() => {
      const result = register({ name: form.name, username: form.username, email: form.email, password: form.password });
      if (result.ok) { navigate("/login?registered=1"); }
      else { setError(result.error); }
      setLoading(false);
    }, 600);
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? "bg-surface-900" : "bg-light-bg"}`}>
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-surface-900 font-bold text-xs">EP</span>
            </div>
            <span className="font-display font-bold gradient-text">ExamPortal</span>
          </Link>
          <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? "text-gray-400 hover:text-accent" : "text-light-muted hover:text-accent"}`}>
            {isDark ? "☀" : "🌙"}
          </button>
        </div>

        <div className={`p-8 rounded-3xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <h1 className={`font-display font-bold text-3xl mb-2 ${isDark ? "text-white" : "text-light-text"}`}>Create Account</h1>
          <p className={`font-body mb-8 ${isDark ? "text-gray-400" : "text-light-muted"}`}>Join ExamPortal as a student today</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Full Name</label>
                <input type="text" placeholder="John Doe" value={form.name} onChange={set("name")} className={isDark ? "input-field" : "input-light"} required />
              </div>
              <div>
                <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Username</label>
                <input type="text" placeholder="johndoe" value={form.username} onChange={set("username")} className={isDark ? "input-field" : "input-light"} required />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Email Address</label>
              <input type="email" placeholder="john@student.edu" value={form.email} onChange={set("email")} className={isDark ? "input-field" : "input-light"} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Password</label>
                <input type="password" placeholder="Min 6 chars" value={form.password} onChange={set("password")} className={isDark ? "input-field" : "input-light"} required />
              </div>
              <div>
                <label className={`block text-sm font-body font-medium mb-2 ${isDark ? "text-gray-300" : "text-light-text"}`}>Confirm</label>
                <input type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} className={isDark ? "input-field" : "input-light"} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm font-body ${isDark ? "text-gray-400" : "text-light-muted"}`}>
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
