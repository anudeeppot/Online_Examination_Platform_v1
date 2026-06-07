import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getUsers, getResults, getExams } from "../../services/localStorageService";

export default function AdminStudents() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const users = getUsers();
  const results = getResults();
  const exams = getExams();

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentStats = (userId) => {
    const studentResults = results.filter(r => r.studentId === userId);
    const avg = studentResults.length ? Math.round(studentResults.reduce((s,r)=>s+r.percentage,0)/studentResults.length) : 0;
    const passed = studentResults.filter(r => r.passed).length;
    return { attempts: studentResults.length, avg, passed, results: studentResults };
  };

  return (
    <div className="space-y-6 animate-fade-in">
    </div>
  );
}
