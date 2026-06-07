import { useTheme } from "../../context/ThemeContext";
import { getUsers, getExams, getResults, getLogs } from "../../services/localStorageService";

function StatCard({ label, value, sub, icon, color, isDark }) {
  return (
    <div className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 ${isDark ? "bg-surface-700 border-surface-500 hover:border-accent/30" : "bg-white border-light-border shadow-sm hover:shadow-md"}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`text-2xl p-2 rounded-xl ${isDark ? "bg-surface-600" : "bg-light-bg"}`}>{icon}</div>
        <span className={`font-mono text-xs px-2 py-1 rounded-full ${color}`}>{sub}</span>
      </div>
      <div className={`font-display font-bold text-3xl ${isDark ? "text-white" : "text-light-text"}`}>{value}</div>
      <div className={`font-body text-sm mt-1 ${isDark ? "text-gray-400" : "text-light-muted"}`}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const users = getUsers();
  const exams = getExams();
  const results = getResults();
  const logs = getLogs();

  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const passRate = results.length ? Math.round(results.filter(r => r.passed).length / results.length * 100) : 0;
  const recentStudents = users.slice(-5).reverse();

  const stats = [
    { label: "Total Students", value: users.length, sub: "Registered", icon: "👥", color: "text-accent bg-accent/10" },
    { label: "Total Exams", value: exams.length, sub: "Created", icon: "📋", color: "text-gold bg-gold/10" },
    { label: "Total Attempts", value: results.length, sub: "Completed", icon: "📊", color: "text-purple-400 bg-purple-400/10" },
    { label: "Average Score", value: `${avgScore}%`, sub: `${passRate}% pass`, icon: "🏆", color: "text-emerald-400 bg-emerald-400/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className={`font-display font-bold text-3xl ${isDark ? "text-white" : "text-light-text"}`}>Admin <span className="gradient-text">Dashboard</span></h1>
        <p className={`font-body mt-1 ${isDark ? "text-gray-400" : "text-light-muted"}`}>System-wide overview and activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div key={st.label} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <StatCard {...st} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <div className={`font-mono text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-light-muted"}`}>Pass Rate</div>
          <div className="font-display font-bold text-4xl gradient-text">{passRate}%</div>
          <div className={`h-2 rounded-full mt-3 ${isDark ? "bg-surface-500" : "bg-light-bg"}`}>
            <div className="h-2 rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-1000" style={{ width: `${passRate}%` }}></div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <div className={`font-mono text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-light-muted"}`}>Avg Score</div>
          <div className="font-display font-bold text-4xl gradient-text">{avgScore}%</div>
          <div className={`h-2 rounded-full mt-3 ${isDark ? "bg-surface-500" : "bg-light-bg"}`}>
            <div className="h-2 rounded-full bg-gradient-to-r from-gold to-orange-400 transition-all duration-1000" style={{ width: `${avgScore}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <div className={`px-6 py-4 border-b ${isDark ? "border-surface-500" : "border-light-border"}`}>
            <h2 className={`font-display font-semibold text-lg ${isDark ? "text-white" : "text-light-text"}`}>Recent Registrations</h2>
          </div>
          {recentStudents.length === 0 ? (
            <div className={`px-6 py-12 text-center ${isDark ? "text-gray-500" : "text-light-muted"}`}>
              <div className="text-4xl mb-3">👥</div>
              <p className="font-body text-sm">No students registered yet</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-500/20">
              {recentStudents.map(st => (
                <div key={st.id} className={`px-6 py-4 flex items-center gap-4 ${isDark ? "hover:bg-surface-600/50" : "hover:bg-light-bg"}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/40 to-purple-500/40 flex items-center justify-center font-display font-bold text-sm text-white">
                    {(st.name || st.username)[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-body font-medium text-sm ${isDark ? "text-gray-200" : "text-light-text"}`}>{st.name}</div>
                    <div className={`font-body text-xs ${isDark ? "text-gray-500" : "text-light-muted"}`}>{st.email}</div>
                  </div>
                  <div className={`font-mono text-xs ${isDark ? "text-gray-500" : "text-light-muted"}`}>{new Date(st.joinedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
{/* 
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <h2 className={`font-display font-semibold text-lg mb-5 ${isDark ? "text-white" : "text-light-text"}`}>Activity Feed</h2>
          {logs.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? "text-gray-500" : "text-light-muted"}`}><p className="text-sm font-body">No activity yet</p></div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
              {logs.slice(0, 10).map(log => (
                <div key={log.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${isDark ? "bg-surface-600" : "bg-light-bg"}`}>{log.icon}</div>
                  <div>
                    <p className={`font-body text-sm ${isDark ? "text-gray-300" : "text-light-text"}`}>{log.text}</p>
                    <p className={`font-mono text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-light-muted"}`}>{new Date(log.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>

      {/* Exam performance */}
      {exams.length > 0 && (
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <h2 className={`font-display font-semibold text-lg mb-5 ${isDark ? "text-white" : "text-light-text"}`}>Exam Performance Overview</h2>
          <div className="space-y-4">
            {exams.map(exam => {
              const examResults = results.filter(r => r.examId === exam.id);
              const avg = examResults.length ? Math.round(examResults.reduce((s,r) => s+r.percentage, 0)/examResults.length) : 0;
              return (
                <div key={exam.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-body">
                    <span className={isDark ? "text-gray-300" : "text-light-text"}>{exam.title} <span className={`font-mono text-xs ${isDark ? "text-gray-500" : "text-light-muted"}`}>({examResults.length} attempts)</span></span>
                    <span className={`font-mono font-medium ${avg >= 80 ? "text-accent" : avg >= 60 ? "text-gold" : "text-rose-400"}`}>{avg}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? "bg-surface-500" : "bg-light-bg"}`}>
                    <div className={`h-2 rounded-full ${avg >= 80 ? "bg-accent" : avg >= 60 ? "bg-gold" : "bg-rose-500"} transition-all duration-700`} style={{ width: `${avg}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
