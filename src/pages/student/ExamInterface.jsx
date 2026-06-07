import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useExam } from "../../context/ExamContext";
import { getExams, getExamQuestions, hasAttempted } from "../../services/localStorageService";
import { downloadCSV } from "../../utils/csvExport";
import { printReport, buildResultReport } from "../../utils/pdfExport";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Instructions({ exam, questions, onStart, isDark }) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className={`p-8 rounded-3xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-3xl mb-6">📋</div>
        <h1 className={`font-display font-bold text-3xl mb-2 ${isDark ? "text-white" : "text-light-text"}`}>{exam.title}</h1>
        <p className={`font-body text-sm mb-8 ${isDark ? "text-gray-400" : "text-light-muted"}`}>{exam.description}</p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Duration", value: `${exam.duration} min`, icon: "⏱" },
            { label: "Questions", value: questions.length, icon: "❓" },
            { label: "Passing", value: `${exam.passingPercentage}%`, icon: "🎯" },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-2xl text-center ${isDark ? "bg-surface-600" : "bg-light-bg"}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`font-display font-bold text-lg ${isDark ? "text-white" : "text-light-text"}`}>{s.value}</div>
              <div className={`font-mono text-xs ${isDark ? "text-gray-500" : "text-light-muted"}`}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className={`p-5 rounded-2xl border mb-8 ${isDark ? "bg-surface-600 border-surface-400" : "bg-light-bg border-light-border"}`}>
          <h3 className={`font-display font-semibold text-sm mb-3 ${isDark ? "text-gray-200" : "text-light-text"}`}>📌 Instructions</h3>
          <ul className={`space-y-2 font-body text-sm ${isDark ? "text-gray-400" : "text-light-muted"}`}>
            <li>• Each question has 4 options. Select the best answer.</li>
            <li>• You can navigate between questions freely.</li>
            <li>• Use "Mark for Review" to flag uncertain questions.</li>
            <li>• Answers are auto-saved as you go.</li>
            <li>• Exam auto-submits when the timer reaches zero.</li>
            <li>• Total marks: {questions.reduce((s, q) => s + q.marks, 0)}</li>
          </ul>
        </div>
        <button onClick={onStart} className="btn-primary w-full py-4 text-lg">Begin Exam →</button>
      </div>
    </div>
  );
}

function ResultView({ result, exam, user, isDark, navigate }) {
  const [showReview, setShowReview] = useState(false);

  const handleCSV = () => {
    downloadCSV(
      `${exam.title.replace(/\s+/g, "_")}_result.csv`,
      ["Student","Username","Exam","Date","Total Q","Correct","Incorrect","Unanswered","Score","Max","Percentage","Status"],
      [[user.name||"?", user.username||"?", exam.title,
        new Date(result.submittedAt).toLocaleDateString(),
        result.totalQuestions, result.correct, result.incorrect,
        result.unanswered, result.score, result.maxScore,
        result.percentage+"%", result.passed?"PASS":"FAIL"]]
    );
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <div className={`p-8 rounded-3xl border text-center ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl mb-5 ${result.passed ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
          {result.passed ? "🏆" : "📚"}
        </div>
        <h1 className={`font-display font-bold text-4xl mb-1 ${result.passed ? "text-emerald-400" : "text-rose-400"}`}>
          {result.passed ? "Congratulations!" : "Keep practising!"}
        </h1>
        <p className={`font-body text-sm mb-6 ${isDark ? "text-gray-400" : "text-light-muted"}`}>{exam.title}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Score", value: `${result.score}/${result.maxScore}` },
            { label: "Percentage", value: `${result.percentage}%` },
            { label: "Correct", value: result.correct },
            { label: "Incorrect", value: result.incorrect },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-2xl ${isDark ? "bg-surface-600" : "bg-light-bg"}`}>
              <div className="font-display font-bold text-2xl gradient-text">{s.value}</div>
              <div className={`font-mono text-xs mt-1 ${isDark ? "text-gray-500" : "text-light-muted"}`}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className={`h-3 rounded-full mb-2 ${isDark ? "bg-surface-500" : "bg-light-bg"}`}>
          <div className={`h-3 rounded-full ${result.passed ? "bg-gradient-to-r from-accent to-emerald-400" : "bg-gradient-to-r from-rose-500 to-orange-400"}`}
            style={{ width: `${result.percentage}%` }}></div>
        </div>
        <p className={`font-mono text-xs ${isDark ? "text-gray-500" : "text-light-muted"}`}>Passing threshold: {exam.passingPercentage}%</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <button onClick={() => setShowReview(p => !p)}
            className={`px-5 py-2.5 rounded-xl border text-sm font-body transition-colors ${isDark ? "border-surface-400 text-gray-300 hover:border-accent hover:text-accent" : "border-light-border text-light-muted hover:border-accent hover:text-accent"}`}>
            {showReview ? "Hide" : "📖 Review"} Answers
          </button>
          <button onClick={handleCSV}
            className={`px-5 py-2.5 rounded-xl border text-sm font-body transition-colors ${isDark ? "border-surface-400 text-gray-300 hover:border-accent hover:text-accent" : "border-light-border text-light-muted hover:border-accent hover:text-accent"}`}>
            ⬇ CSV
          </button>
          <button onClick={() => printReport(buildResultReport(result, exam, user))}
            className={`px-5 py-2.5 rounded-xl border text-sm font-body transition-colors ${isDark ? "border-surface-400 text-gray-300 hover:border-accent hover:text-accent" : "border-light-border text-light-muted hover:border-accent hover:text-accent"}`}>
            🖨 Print
          </button>
          <button onClick={() => navigate("/student/exams")} className="btn-primary text-sm py-2.5 px-5">Back to Exams</button>
        </div>
      </div>

      {showReview && (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
          <h2 className={`font-display font-semibold text-lg ${isDark ? "text-white" : "text-light-text"}`}>Question Review</h2>
          {result.answers.map((a, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${a.isCorrect ? "border-emerald-500/25 bg-emerald-500/5" : !a.selected ? isDark ? "border-surface-400 bg-surface-600/50" : "border-light-border bg-light-bg" : "border-rose-500/25 bg-rose-500/5"}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className={`text-lg flex-shrink-0 ${a.isCorrect ? "text-emerald-400" : !a.selected ? isDark ? "text-gray-500" : "text-light-muted" : "text-rose-400"}`}>
                  {a.isCorrect ? "✓" : !a.selected ? "—" : "✗"}
                </span>
                <p className={`font-body text-sm font-medium ${isDark ? "text-gray-200" : "text-light-text"}`}>
                  <span className={`font-mono text-xs mr-2 ${isDark ? "text-gray-500" : "text-light-muted"}`}>Q{i+1}.</span>{a.question}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-mono ml-7">
                <span className={`px-3 py-1.5 rounded-lg border ${isDark ? "bg-surface-600 border-surface-400 text-gray-400" : "bg-light-bg border-light-border text-light-muted"}`}>
                  Your: {a.selected ? `Option ${a.selected}` : "Not answered"}
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  Correct: Option {a.correct}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExamInterface() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { activeAttempt, timeLeft, startExam, saveAnswer, toggleMark, submitExam } = useExam();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("loading");
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const ex = getExams().find(e => e.id === id);
    if (!ex) { navigate("/student/exams"); return; }
    const qs = getExamQuestions(id);
    if (!qs.length) { navigate("/student/exams"); return; }
    setExam(ex); setQuestions(qs);
    if (hasAttempted(user.id, id)) { navigate("/student/results"); return; }
    setPhase("instructions");
  }, [id]);

  const handleStart = () => { startExam(exam, questions, user.id); setPhase("exam"); };

  const handleSubmit = useCallback(() => {
    const result = submitExam();
    if (result) { setLastResult(result); setPhase("result"); }
  }, [submitExam]);

  if (phase === "loading") return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  if (phase === "instructions") return <Instructions exam={exam} questions={questions} onStart={handleStart} isDark={isDark} />;
  if (phase === "result" && lastResult) return <ResultView result={lastResult} exam={exam} user={user} isDark={isDark} navigate={navigate} />;
  if (!activeAttempt) return null;

  const q = questions[current];
  const answers = activeAttempt.answers;
  const marked = activeAttempt.markedForReview;
  const answered = Object.keys(answers).length;
  const urgent = timeLeft > 0 && timeLeft <= 60;

  const getQStatus = (q) => {
    if (marked.includes(q.id)) return "review";
    if (answers[q.id]) return "answered";
    return "unanswered";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-fade-in">
    </div>
  );
}
