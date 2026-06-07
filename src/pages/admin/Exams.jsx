import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { getExams, addExam, updateExam, deleteExam, getExamQuestions, addQuestion, updateQuestion, deleteQuestion, addLog } from "../../services/localStorageService";

const BLANK_EXAM = { title: "", description: "", duration: 30, passingPercentage: 60 };
const BLANK_Q = { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 2 };

export default function AdminExams() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [showExamModal, setShowExamModal] = useState(false);
  const [examForm, setExamForm] = useState(BLANK_EXAM);
  const [editingExam, setEditingExam] = useState(null);

  const [showQModal, setShowQModal] = useState(false);
  const [qForm, setQForm] = useState(BLANK_Q);
  const [editingQ, setEditingQ] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null); // { type: "exam"|"question", id }

  useEffect(() => { setExams(getExams()); }, []);
  useEffect(() => {
    if (selectedExam) setQuestions(getExamQuestions(selectedExam.id));
  }, [selectedExam]);

  const refreshExams = () => {
    const e = getExams();
    setExams(e);
    if (selectedExam) setSelectedExam(e.find(ex => ex.id === selectedExam.id) || null);
  };

  // Exam CRUD
  const handleSaveExam = () => {
    if (!examForm.title.trim()) return toast("Exam title is required", "error");
    if (editingExam) {
      updateExam(editingExam.id, examForm);
      addLog(`Exam updated: ${examForm.title}`, "✏️");
      toast("Exam updated successfully");
    } else {
      const exam = { ...examForm, id: `e-${Date.now()}`, createdAt: new Date().toISOString() };
      addExam(exam);
      addLog(`Exam created: ${examForm.title}`, "📋");
      toast("Exam created successfully");
    }
    setShowExamModal(false); setEditingExam(null); setExamForm(BLANK_EXAM);
    refreshExams();
  };

  const handleDeleteExam = (id) => {
    const exam = exams.find(e => e.id === id);
    deleteExam(id);
    addLog(`Exam deleted: ${exam?.title}`, "🗑️");
    if (selectedExam?.id === id) setSelectedExam(null);
    toast("Exam deleted", "info");
    refreshExams();
  };

  // Question CRUD
  const handleSaveQ = () => {
    if (!qForm.question.trim()) return toast("Question text is required", "error");
    if (!qForm.optionA || !qForm.optionB || !qForm.optionC || !qForm.optionD) return toast("All 4 options are required", "error");
    if (editingQ) {
      updateQuestion(editingQ.id, qForm);
      toast("Question updated");
    } else {
      addQuestion({ ...qForm, id: `q-${Date.now()}`, examId: selectedExam.id });
      toast("Question added");
    }
    setShowQModal(false); setEditingQ(null); setQForm(BLANK_Q);
    setQuestions(getExamQuestions(selectedExam.id));
  };

  const handleDeleteQ = (id) => {
    deleteQuestion(id);
    toast("Question deleted", "info");
    setQuestions(getExamQuestions(selectedExam.id));
  };

  const inputCls = `w-full bg-surface-600 border border-surface-400 rounded-xl px-4 py-2.5 text-gray-100 placeholder-gray-500 text-sm font-body focus:outline-none focus:border-accent`;

  return (
    <div className="space-y-6 animate-fade-in">
      
    </div>
  );
}
