import { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getUsers, getExams, getResults } from "../../services/localStorageService";
import { exportAdminCSV } from "../../utils/csvExport";
import { printReport, buildAdminReport } from "../../utils/pdfExport";

const DATE_FILTERS = [
  { label: "All Time", days: 0 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
];

export default function AdminReports() {
  const { isDark } = useTheme();
  const [dateFilter, setDateFilter] = useState(0);
  const [examFilter, setExamFilter] = useState("all");

  const users = getUsers();
  const exams = getExams();
  const allResults = getResults();

  const filtered = useMemo(() => {
    let r = allResults;
    if (dateFilter > 0) {
      const cutoff = Date.now() - dateFilter * 86400000;
      r = r.filter(x => new Date(x.submittedAt).getTime() >= cutoff);
    }
    if (examFilter !== "all") r = r.filter(x => x.examId === examFilter);
    return r;
  }, [allResults, dateFilter, examFilter]);

  const avgScore = filtered.length ? Math.round(filtered.reduce((s,r)=>s+r.percentage,0)/filtered.length) : 0;
  const passRate = filtered.length ? Math.round(filtered.filter(r=>r.passed).length/filtered.length*100) : 0;

  const examAnalytics = exams.map(exam => {
    const er = filtered.filter(r => r.examId === exam.id);
    if (!er.length) return { ...exam, attempts: 0, avg: 0, highest: 0, lowest: 0, passRate: 0 };
    const pcts = er.map(r => r.percentage);
    return {
      ...exam,
      attempts: er.length,
      avg: Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length),
      highest: Math.max(...pcts),
      lowest: Math.min(...pcts),
      passRate: Math.round(er.filter(r=>r.passed).length/er.length*100),
    };
  }).filter(e => e.attempts > 0);

  const handlePrint = () => {
    const stats = { students: users.length, exams: exams.length, attempts: filtered.length, avgScore };
    const studentRows = filtered.map(r => {
      const user = users.find(u => u.id === r.studentId) || { name: "?", username: "?" };
      const exam = exams.find(e => e.id === r.examId) || { title: "Deleted" };
      return `<tr><td>${user.name}</td><td>${user.username}</td><td>${exam.title}</td><td>${r.score}/${r.maxScore}</td><td>${r.percentage}%</td><td class="${r.passed?'pass':'fail'}">${r.passed?"PASS":"FAIL"}</td></tr>`;
    }).join("");
    const examRows = examAnalytics.map(e =>
      `<tr><td>${e.title}</td><td>${e.attempts}</td><td>${e.avg}%</td><td>${e.highest}%</td><td>${e.lowest}%</td><td>${e.passRate}%</td></tr>`
    ).join("");
    printReport(buildAdminReport(stats, studentRows, examRows), "Admin Report — ExamPortal");
  };

  const card = (label, value, color = "text-accent") => (
    <div className={`p-6 rounded-2xl border ${isDark ? "bg-surface-700 border-surface-500" : "bg-white border-light-border shadow-sm"}`}>
      <div className={`font-display font-bold text-3xl ${color}`}>{value}</div>
      <div className={`font-body text-sm mt-1 ${isDark ? "text-gray-400" : "text-light-muted"}`}>{label}</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
    </div>
  );
}
