import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getExams, getExamQuestions, hasAttempted } from "../../services/localStorageService";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function StudentExams() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const exams = getExams();

  const enriched = exams.map(exam => ({
    ...exam,
    questions: getExamQuestions(exam.id),
    attempted: hasAttempted(user.id, exam.id),
  }));

  const filtered = enriched.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "available") return matchSearch && !e.attempted;
    if (filter === "completed") return matchSearch && e.attempted;
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">

    </div>
  );
}
