// ──────────────────────────────────────────────
// localStorage Service — single source of truth
// ──────────────────────────────────────────────

const KEYS = {
  USERS: "ep_users",
  EXAMS: "ep_exams",
  QUESTIONS: "ep_questions",
  SUBMISSIONS: "ep_submissions",
  RESULTS: "ep_results",
  SESSION: "ep_session",
  THEME: "ep_theme",
  ACTIVITY_LOGS: "ep_activity_logs",
};

const read = (key, fallback = []) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ── Users ────────────────────────────────────
export const getUsers = () => read(KEYS.USERS, []);
export const saveUsers = (users) => write(KEYS.USERS, users);
export const addUser = (user) => { const u = getUsers(); write(KEYS.USERS, [...u, user]); };
export const updateUser = (id, data) => {
  const u = getUsers().map(u => u.id === id ? { ...u, ...data } : u);
  write(KEYS.USERS, u);
};

// ── Session ──────────────────────────────────
export const getSession = () => read(KEYS.SESSION, null);
export const saveSession = (user) => write(KEYS.SESSION, user);
export const clearSession = () => localStorage.removeItem(KEYS.SESSION);

// ── Exams ────────────────────────────────────
export const getExams = () => read(KEYS.EXAMS, []);
export const saveExams = (exams) => write(KEYS.EXAMS, exams);
export const addExam = (exam) => { const e = getExams(); write(KEYS.EXAMS, [...e, exam]); return exam; };
export const updateExam = (id, data) => {
  const e = getExams().map(e => e.id === id ? { ...e, ...data } : e);
  write(KEYS.EXAMS, e);
};
export const deleteExam = (id) => {
  write(KEYS.EXAMS, getExams().filter(e => e.id !== id));
  write(KEYS.QUESTIONS, getQuestions().filter(q => q.examId !== id));
};

// ── Questions ────────────────────────────────
export const getQuestions = () => read(KEYS.QUESTIONS, []);
export const getExamQuestions = (examId) => getQuestions().filter(q => q.examId === examId);
export const addQuestion = (q) => { const qs = getQuestions(); write(KEYS.QUESTIONS, [...qs, q]); return q; };
export const updateQuestion = (id, data) => {
  write(KEYS.QUESTIONS, getQuestions().map(q => q.id === id ? { ...q, ...data } : q));
};
export const deleteQuestion = (id) => write(KEYS.QUESTIONS, getQuestions().filter(q => q.id !== id));

// ── Submissions (in-progress attempts) ───────
export const getSubmissions = () => read(KEYS.SUBMISSIONS, []);
export const getActiveSubmission = (studentId, examId) =>
  getSubmissions().find(s => s.studentId === studentId && s.examId === examId && s.status === "in-progress");
export const saveSubmission = (sub) => {
  const subs = getSubmissions().filter(s => !(s.studentId === sub.studentId && s.examId === sub.examId));
  write(KEYS.SUBMISSIONS, [...subs, sub]);
};
export const deleteSubmission = (studentId, examId) => {
  write(KEYS.SUBMISSIONS, getSubmissions().filter(s => !(s.studentId === studentId && s.examId === examId)));
};

// ── Results ──────────────────────────────────
export const getResults = () => read(KEYS.RESULTS, []);
export const getStudentResults = (studentId) => getResults().filter(r => r.studentId === studentId);
export const getExamResults = (examId) => getResults().filter(r => r.examId === examId);
export const addResult = (result) => { const r = getResults(); write(KEYS.RESULTS, [...r, result]); return result; };
export const hasAttempted = (studentId, examId) => getResults().some(r => r.studentId === studentId && r.examId === examId);

// ── Activity Logs ────────────────────────────
export const getLogs = () => read(KEYS.ACTIVITY_LOGS, []);
export const addLog = (text, icon = "📌") => {
  const logs = getLogs();
  const entry = { id: Date.now().toString(), text, icon, time: new Date().toISOString() };
  write(KEYS.ACTIVITY_LOGS, [entry, ...logs].slice(0, 50));
};

// ── Theme ────────────────────────────────────
export const getTheme = () => localStorage.getItem(KEYS.THEME) || "dark";
export const saveTheme = (t) => localStorage.setItem(KEYS.THEME, t);

// ── Seed demo data ───────────────────────────
export const seedDemoData = () => {
  if (localStorage.getItem("ep_seeded")) return;

  const exams = [
    { id: "e1", title: "Data Structures & Algorithms", description: "Core DSA concepts including arrays, trees, graphs and complexity analysis.", duration: 30, passingPercentage: 60, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: "e2", title: "Database Management Systems", description: "SQL, normalization, transactions and ACID properties.", duration: 20, passingPercentage: 55, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: "e3", title: "Web Development Basics", description: "HTML, CSS, JavaScript fundamentals and browser APIs.", duration: 15, passingPercentage: 50, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  ];

  const questions = [
    // e1
    { id: "q1", examId: "e1", question: "What is the time complexity of binary search?", optionA: "O(n)", optionB: "O(log n)", optionC: "O(n²)", optionD: "O(1)", correctAnswer: "B", marks: 2 },
    { id: "q2", examId: "e1", question: "Which data structure uses LIFO order?", optionA: "Queue", optionB: "Array", optionC: "Stack", optionD: "Linked List", correctAnswer: "C", marks: 2 },
    { id: "q3", examId: "e1", question: "What is the worst-case time complexity of QuickSort?", optionA: "O(n log n)", optionB: "O(n)", optionC: "O(n²)", optionD: "O(log n)", correctAnswer: "C", marks: 2 },
    { id: "q4", examId: "e1", question: "Which traversal visits nodes in Left-Root-Right order?", optionA: "Preorder", optionB: "Postorder", optionC: "Level-order", optionD: "Inorder", correctAnswer: "D", marks: 2 },
    { id: "q5", examId: "e1", question: "A hash table lookup has what average time complexity?", optionA: "O(n)", optionB: "O(log n)", optionC: "O(1)", optionD: "O(n log n)", correctAnswer: "C", marks: 2 },
    // e2
    { id: "q6", examId: "e2", question: "What does SQL stand for?", optionA: "Structured Query Language", optionB: "Simple Query Language", optionC: "Standard Query Logic", optionD: "Stored Query Layer", correctAnswer: "A", marks: 2 },
    { id: "q7", examId: "e2", question: "Which normal form removes partial dependencies?", optionA: "1NF", optionB: "2NF", optionC: "3NF", optionD: "BCNF", correctAnswer: "B", marks: 2 },
    { id: "q8", examId: "e2", question: "Which SQL clause filters grouped results?", optionA: "WHERE", optionB: "FILTER", optionC: "HAVING", optionD: "LIMIT", correctAnswer: "C", marks: 2 },
    { id: "q9", examId: "e2", question: "ACID stands for Atomicity, Consistency, Isolation and?", optionA: "Distribution", optionB: "Durability", optionC: "Design", optionD: "Dependency", correctAnswer: "B", marks: 2 },
    { id: "q10", examId: "e2", question: "A PRIMARY KEY constraint ensures:", optionA: "NULL values only", optionB: "Unique and non-null values", optionC: "Duplicate values allowed", optionD: "Foreign references only", correctAnswer: "B", marks: 2 },
    // e3
    { id: "q11", examId: "e3", question: "Which HTML tag defines a hyperlink?", optionA: "<link>", optionB: "<a>", optionC: "<href>", optionD: "<nav>", correctAnswer: "B", marks: 2 },
    { id: "q12", examId: "e3", question: "CSS 'display: flex' creates a:", optionA: "Grid layout", optionB: "Table layout", optionC: "Flexbox container", optionD: "Block element", correctAnswer: "C", marks: 2 },
    { id: "q13", examId: "e3", question: "Which JS method adds an element to end of an array?", optionA: "push()", optionB: "pop()", optionC: "shift()", optionD: "unshift()", correctAnswer: "A", marks: 2 },
    { id: "q14", examId: "e3", question: "What does DOM stand for?", optionA: "Data Object Model", optionB: "Document Object Model", optionC: "Dynamic Object Markup", optionD: "Design Object Module", correctAnswer: "B", marks: 2 },
    { id: "q15", examId: "e3", question: "Which CSS property controls text size?", optionA: "font-weight", optionB: "text-size", optionC: "font-size", optionD: "letter-spacing", correctAnswer: "C", marks: 2 },
  ];

  write(KEYS.EXAMS, exams);
  write(KEYS.QUESTIONS, questions);
  write(KEYS.RESULTS, []);
  write(KEYS.SUBMISSIONS, []);
  write(KEYS.ACTIVITY_LOGS, []);
  localStorage.setItem("ep_seeded", "1");
};

// ── Clear all data ───────────────────────────
export const clearAllStudents = () => {
  write(KEYS.USERS, []);
  write(KEYS.RESULTS, []);
  write(KEYS.SUBMISSIONS, []);
  addLog("All student data cleared", "🗑️");
};
export const clearAllExams = () => {
  write(KEYS.EXAMS, []);
  write(KEYS.QUESTIONS, []);
  write(KEYS.RESULTS, []);
  write(KEYS.SUBMISSIONS, []);
  addLog("All exams cleared", "🗑️");
};
export const clearAllResults = () => {
  write(KEYS.RESULTS, []);
  write(KEYS.SUBMISSIONS, []);
  addLog("All results cleared", "🗑️");
};
export const resetDemoData = () => {
  localStorage.removeItem("ep_seeded");
  write(KEYS.USERS, []);
  write(KEYS.RESULTS, []);
  write(KEYS.SUBMISSIONS, []);
  seedDemoData();
  addLog("Demo data reset", "🔄");
};
