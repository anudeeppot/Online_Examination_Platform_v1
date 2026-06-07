import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useTheme } from "../../context/ThemeContext";

const features = [
  { icon: "🔐", title: "Secure Authentication", desc: "Role-based access control for students and administrators with session persistence." },
  { icon: "📊", title: "Real-time Analytics", desc: "Detailed performance insights, score breakdowns, and progress tracking dashboards." },
  { icon: "📋", title: "Smart Exam Management", desc: "Schedule, manage, and conduct exams with automated scoring and result publishing." },
  { icon: "📱", title: "Fully Responsive", desc: "Seamless experience across desktop, tablet, and mobile devices." },
  { icon: "🌙", title: "Dark & Light Themes", desc: "Eye-friendly themes with persistent preferences across sessions." },
  { icon: "⚡", title: "Lightning Fast", desc: "Built with Vite and React for blazing-fast load times and smooth interactions." },
];

export default function Landing() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-surface-900" : "bg-light-bg"}`}>
      <Navbar />

      {/* Hero */}
      <section className="hero-glow pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-accent text-sm font-mono">Online Examination Portal v2.0</span>
          </div>
          <h1 className={`font-display font-bold text-6xl md:text-7xl leading-tight mb-6 animate-slide-up ${isDark ? "text-white" : "text-light-text"}`}>
            The Future of<br />
            <span className="gradient-text">Academic Testing</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-12 font-body leading-relaxed animate-slide-up animate-delay-100 ${isDark ? "text-gray-400" : "text-light-muted"}`}>
            A professional online examination platform built for modern educational institutions. Secure, scalable, and beautifully designed.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap animate-slide-up animate-delay-200">
            <Link to="/register" className="btn-primary text-lg px-8 py-3.5">Get Started Free</Link>
            <Link to="/login" className="btn-ghost text-lg px-8 py-3.5">Sign In</Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 max-w-lg mx-auto gap-8 animate-slide-up animate-delay-300">
            {[["248+", "Students"], ["18", "Active Exams"], ["87%", "Pass Rate"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-3xl gradient-text">{val}</div>
                <div className={`text-sm font-body mt-1 ${isDark ? "text-gray-500" : "text-light-muted"}`}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-24 px-6 ${isDark ? "bg-surface-800" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`font-display font-bold text-4xl mb-4 ${isDark ? "text-white" : "text-light-text"}`}>Everything You Need</h2>
            <p className={`font-body text-lg ${isDark ? "text-gray-400" : "text-light-muted"}`}>Powerful features designed for modern educational environments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default animate-slide-up ${isDark ? "bg-surface-700 border-surface-500 hover:border-accent/30" : "bg-light-bg border-light-border hover:border-accent/30"}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className={`font-display font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-light-text"}`}>{f.title}</h3>
                <p className={`font-body text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-light-muted"}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className={`py-24 px-6 ${isDark ? "bg-surface-900" : "bg-light-bg"}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className={`font-display font-bold text-4xl mb-6 ${isDark ? "text-white" : "text-light-text"}`}>Built for Modern Education</h2>
            <p className={`font-body text-lg leading-relaxed mb-6 ${isDark ? "text-gray-400" : "text-light-muted"}`}>
              ExamPortal brings together students, educators, and administrators in one seamlessly integrated platform. Our architecture is designed for the future — ready for backend integration with Node.js, MongoDB, and more.
            </p>
            <ul className="space-y-3">
              {["Role-based access control", "Automated result computation", "Performance analytics & reports", "Secure exam environments"].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center">
                    <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                  <span className={`font-body ${isDark ? "text-gray-300" : "text-light-text"}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`p-8 rounded-3xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border"}`}>
            <div className="space-y-4">
              {[{ role: "Student", desc: "Access exams, view results, track performance", color: "from-accent to-blue-500" }, { role: "Administrator", desc: "Manage students, create exams, generate reports", color: "from-gold to-orange-500" }].map(r => (
                <div key={r.role} className={`p-5 rounded-2xl ${isDark ? "bg-surface-600" : "bg-light-bg"}`}>
                  <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${r.color} text-white text-xs font-mono font-medium mb-2`}>{r.role}</div>
                  <p className={`text-sm font-body ${isDark ? "text-gray-400" : "text-light-muted"}`}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-24 px-6 ${isDark ? "bg-surface-800" : "bg-white"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`font-display font-bold text-5xl mb-6 ${isDark ? "text-white" : "text-light-text"}`}>Ready to Get Started?</h2>
          <p className={`font-body text-lg mb-10 ${isDark ? "text-gray-400" : "text-light-muted"}`}>Join hundreds of students already using ExamPortal for their academic journey.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary text-lg px-10 py-4">Create Free Account</Link>
            <Link to="/login" className={`text-lg px-10 py-4 rounded-xl font-display font-semibold transition-colors ${isDark ? "text-gray-300 hover:text-white" : "text-light-muted hover:text-light-text"}`}>Already have an account →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 ${isDark ? "border-surface-500 bg-surface-900" : "border-light-border bg-light-bg"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <span className="text-surface-900 font-bold text-xs">EP</span>
            </div>
            <span className="font-display font-bold gradient-text">ExamPortal</span>
          </div>
          <p className={`font-body text-sm ${isDark ? "text-gray-500" : "text-light-muted"}`}>© 2026 ExamPortal. Built with React, Vite & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
