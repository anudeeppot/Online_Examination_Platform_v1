import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { saveSubmission, deleteSubmission, addResult, addLog, hasAttempted } from "../services/localStorageService";

const ExamContext = createContext();

export function ExamProvider({ children }) {
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const attemptRef = useRef(null);

  const startExam = useCallback((exam, questions, studentId) => {
    const startedAt = new Date().toISOString();
    const remainingSeconds = exam.duration * 60;
    const attempt = { exam, questions, answers: {}, markedForReview: [], startedAt, studentId };
    attemptRef.current = attempt;
    setActiveAttempt(attempt);
    setTimeLeft(remainingSeconds);
    saveSubmission({ studentId, examId: exam.id, answers: {}, markedForReview: [], startedAt, status: "in-progress" });
  }, []);

  const saveAnswer = useCallback((questionId, answer) => {
    setActiveAttempt(prev => {
      if (!prev) return prev;
      const updated = { ...prev, answers: { ...prev.answers, [questionId]: answer } };
      attemptRef.current = updated;
      saveSubmission({ studentId: prev.studentId, examId: prev.exam.id, answers: updated.answers, markedForReview: prev.markedForReview, startedAt: prev.startedAt, status: "in-progress" });
      return updated;
    });
  }, []);

  const toggleMark = useCallback((questionId) => {
    setActiveAttempt(prev => {
      if (!prev) return prev;
      const marked = prev.markedForReview.includes(questionId)
        ? prev.markedForReview.filter(id => id !== questionId)
        : [...prev.markedForReview, questionId];
      const updated = { ...prev, markedForReview: marked };
      attemptRef.current = updated;
      saveSubmission({ studentId: prev.studentId, examId: prev.exam.id, answers: prev.answers, markedForReview: marked, startedAt: prev.startedAt, status: "in-progress" });
      return updated;
    });
  }, []);

  const submitExam = useCallback((attempt) => {
    const att = attempt || attemptRef.current;
    if (!att) return null;
    const { exam, questions, answers, studentId } = att;

    let score = 0, correct = 0, incorrect = 0, unanswered = 0;
    const answerDetails = questions.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (!selected) unanswered++;
      else if (isCorrect) { correct++; score += q.marks; }
      else incorrect++;
      return { questionId: q.id, question: q.question, selected: selected || null, correct: q.correctAnswer, isCorrect: !!selected && isCorrect };
    });

    const maxScore = questions.reduce((s, q) => s + q.marks, 0);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= exam.passingPercentage;

    const result = {
      id: `r-${Date.now()}`, studentId, examId: exam.id,
      totalQuestions: questions.length, correct, incorrect, unanswered,
      score, maxScore, percentage, passed, answers: answerDetails,
      submittedAt: new Date().toISOString(),
    };

    addResult(result);
    deleteSubmission(studentId, exam.id);
    addLog(`Exam ${passed ? "passed" : "failed"}: ${exam.title}`, passed ? "✅" : "❌");

    clearInterval(timerRef.current);
    attemptRef.current = null;
    setActiveAttempt(null);
    setTimeLeft(0);
    return result;
  }, []);

  // Timer effect
  useEffect(() => {
    if (!activeAttempt) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          submitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeAttempt?.exam?.id]);

  const cancelAttempt = useCallback(() => {
    clearInterval(timerRef.current);
    attemptRef.current = null;
    setActiveAttempt(null);
    setTimeLeft(0);
  }, []);

  return (
    <ExamContext.Provider value={{ activeAttempt, timeLeft, startExam, saveAnswer, toggleMark, submitExam, cancelAttempt, hasAttempted }}>
      {children}
    </ExamContext.Provider>
  );
}

export const useExam = () => useContext(ExamContext);
