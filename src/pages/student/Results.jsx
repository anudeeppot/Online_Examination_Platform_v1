import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getResults, getExams } from "../../services/localStorageService";
import { downloadCSV } from "../../utils/csvExport";
import { printReport, buildResultReport } from "../../utils/pdfExport";
import { useState } from "react";

export default function StudentResults() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [selected, setSelected] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const allResults = getResults();
  const exams = getExams();
  const myResults = allResults.filter(r => r.studentId === user.id).reverse();

  const handleCSV = (result, exam) => {
    downloadCSV(
      `${exam.title.replace(/\s+/g,"_")}_result.csv`,
      ["Student","Username","Exam","Date","Total Q","Correct","Incorrect","Unanswered","Score","Max","Percentage","Status"],
      [[user.name||"?", user.username, exam.title,
        new Date(result.submittedAt).toLocaleDateString(),
        result.totalQuestions, result.correct, result.incorrect,
        result.unanswered, result.score, result.maxScore,
        result.percentage+"%", result.passed?"PASS":"FAIL"]]
    );
  };

  const handlePrint = (result, exam) => {
    printReport(buildResultReport(result, exam, user));
  };

  return (
    <div className="space-y-6 animate-fade-in">
    </div>
  );
}
