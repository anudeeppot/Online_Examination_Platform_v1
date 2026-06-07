export const downloadCSV = (filename, headers, rows) => {
  const escape = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.map(escape).join(","),
    ...rows.map(r => r.map(escape).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export const exportResultCSV = (result, exam, student) => {
  downloadCSV(`${exam.title.replace(/\s+/g,"_")}_result.csv`,
    ["Student Name","Username","Exam","Date","Total Q","Correct","Incorrect","Unanswered","Score","Max Score","Percentage","Status"],
    [[student.name, student.username, exam.title,
      new Date(result.submittedAt).toLocaleDateString(),
      result.totalQuestions, result.correct, result.incorrect,
      result.unanswered, result.score, result.maxScore,
      result.percentage + "%", result.passed ? "PASS" : "FAIL"]]
  );
};

export const exportAdminCSV = (results, exams, users) => {
  downloadCSV("exam_portal_report.csv",
    ["Student","Username","Exam","Date","Score","Max","Percentage","Status"],
    results.map(r => {
      const exam = exams.find(e => e.id === r.examId) || { title: "Unknown" };
      const user = users.find(u => u.id === r.studentId) || { name: "Unknown", username: "?" };
      return [user.name, user.username, exam.title,
        new Date(r.submittedAt).toLocaleDateString(),
        r.score, r.maxScore, r.percentage + "%", r.passed ? "PASS" : "FAIL"];
    })
  );
};
