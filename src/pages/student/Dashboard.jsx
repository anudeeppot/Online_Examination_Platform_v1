import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getExams, getResults, getExamQuestions, hasAttempted } from "../../services/localStorageService";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const exams = getExams();
  const allResults = getResults();
  const myResults = allResults.filter(r => r.studentId === user.id);

  const attempted = new Set(myResults.map(r => r.examId));
  const availableExams = exams.filter(e => !attempted.has(e.id));
  const avgScore = myResults.length ? Math.round(myResults.reduce((s, r) => s + r.percentage, 0) / myResults.length) : 0;
  const passed = myResults.filter(r => r.passed).length;

  const stats = [
    { label: "Available Exams", value: availableExams.length, icon: "📋", color: "text-accent bg-accent/10" },
    { label: "Completed", value: myResults.length, icon: "✅", color: "text-emerald-400 bg-emerald-400/10" },
    { label: "Average Score", value: myResults.length ? `${avgScore}%` : "—", icon: "📊", color: "text-gold bg-gold/10" },
    { label: "Passed", value: passed, icon: "🏆", color: "text-purple-400 bg-purple-400/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className={`font-display font-bold text-3xl ${isDark ? "text-white" : "text-light-text"}`}>
          Hello, <span className="gradient-text">{user?.name?.split(" ")[0] || user?.username}</span> 👋
        </h1>
        <p className={`font-body mt-1 ${isDark ? "text-gray-400" : "text-light-muted"}`}>Your exam dashboard — track progress and take new exams</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`p-5 rounded-2xl border animate-slide-up transition-all hover:-translate-y-1 duration-300 ${isDark ? "bg-surface-700 border-surface-500 hover:border-accent/30" : "bg-white border-light-border shadow-sm hover:shadow-md"}`}
            style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`text-xl p-2 rounded-xl w-fit mb-3 ${s.color}`}>{s.icon}</div>
            <div className={`font-display font-bold text-2xl ${isDark ? "text-white" : "text-light-text"}`}>{s.value}</div>
            <div className={`font-body text-xs mt-1 ${isDark ? "text-gray-400" : "text-light-muted"}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Performance bar */}
      {myResults.length > 0 && (
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`font-display font-semibold ${isDark ? "text-white" : "text-light-text"}`}>Overall Performance</h2>
            <span className={`font-mono text-sm font-bold ${avgScore >= 80 ? "text-accent" : avgScore >= 60 ? "text-gold" : "text-rose-400"}`}>{avgScore}%</span>
          </div>
          <div className={`h-3 rounded-full ${isDark ? "bg-surface-500" : "bg-light-bg"}`}>
            <div className={`h-3 rounded-full transition-all duration-1000 ${avgScore >= 80 ? "bg-gradient-to-r from-accent to-emerald-400" : avgScore >= 60 ? "bg-gradient-to-r from-gold to-orange-400" : "bg-gradient-to-r from-rose-500 to-rose-400"}`}
              style={{ width: `${avgScore}%` }}></div>
          </div>
          <div className={`flex justify-between font-mono text-xs mt-2 ${isDark ? "text-gray-500" : "text-light-muted"}`}>
            <span>0%</span><span>Passing: 60%</span><span>100%</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available exams */}
        <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-surface-500" : "border-light-border"}`}>
            <h2 className={`font-display font-semibold ${isDark ? "text-white" : "text-light-text"}`}>Available Exams</h2>
            <Link to="/student/exams" className="text-accent text-xs font-body hover:underline">View all →</Link>
          </div>
          {availableExams.length === 0 ? (
            <div className={`px-6 py-12 text-center ${isDark ? "text-gray-500" : "text-light-muted"}`}>
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-body text-sm">You've completed all available exams!</p>
            </div>
          ) : availableExams.slice(0, 3).map(exam => (
            <div key={exam.id} className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${isDark ? "border-surface-500/30 hover:bg-surface-600/50" : "border-light-border hover:bg-light-bg"}`}>
              <div className="flex-1 min-w-0">
                <div className={`font-body font-medium text-sm ${isDark ? "text-gray-200" : "text-light-text"}`}>{exam.title}</div>
                <div className={`font-mono text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-light-muted"}`}>⏱ {exam.duration}min · {getExamQuestions(exam.id).length} questions</div>
              </div>
              <Link to={`/student/exams/${exam.id}`} className="text-xs px-4 py-2 rounded-xl bg-accent text-surface-900 font-semibold hover:bg-accent-dim transition-colors flex-shrink-0">Start</Link>
            </div>
          ))}
        </div>

        {/* Recent results */}
        <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-surface-500" : "border-light-border"}`}>
            <h2 className={`font-display font-semibold ${isDark ? "text-white" : "text-light-text"}`}>Recent Results</h2>
            <Link to="/student/results" className="text-accent text-xs font-body hover:underline">View all →</Link>
          </div>
          {myResults.length === 0 ? (
            <div className={`px-6 py-12 text-center ${isDark ? "text-gray-500" : "text-light-muted"}`}>
              <div className="text-3xl mb-2">📊</div>
              <p className="font-body text-sm">No exam results yet. Take an exam!</p>
            </div>
          ) : myResults.slice().reverse().slice(0, 4).map(result => {
            const exam = exams.find(e => e.id === result.examId);
            return (
              <div key={result.id} className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${isDark ? "border-surface-500/30 hover:bg-surface-600/50" : "border-light-border hover:bg-light-bg"}`}>
                <div className="flex-1 min-w-0">
                  <div className={`font-body font-medium text-sm ${isDark ? "text-gray-200" : "text-light-text"}`}>{exam?.title || "Deleted Exam"}</div>
                  <div className={`font-mono text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-light-muted"}`}>{new Date(result.submittedAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-mono text-sm font-bold ${result.percentage >= 80 ? "text-accent" : result.percentage >= 60 ? "text-gold" : "text-rose-400"}`}>{result.percentage}%</div>
                  <div className={`font-mono text-xs ${result.passed ? "text-emerald-400" : "text-rose-400"}`}>{result.passed ? "PASS" : "FAIL"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
