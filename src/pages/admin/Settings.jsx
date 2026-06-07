import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { clearAllStudents, clearAllExams, clearAllResults, resetDemoData } from "../../services/localStorageService";

export default function AdminSettings() {
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [confirm, setConfirm] = useState(null);
  const [settings, setSettings] = useState({ portalName: "ExamPortal", passingMark: 40, registrationOpen: true, autoPublishResults: true });

  const dangerActions = [
    { label: "Reset Demo Data", icon: "🔄", desc: "Restore original sample exams and questions. Clears all student results.", action: () => { resetDemoData(); toast("Demo data reset successfully", "info"); } },
    { label: "Clear All Exams", icon: "📋", desc: "Delete all exams and their questions. Cannot be undone.", action: () => { clearAllExams(); toast("All exams cleared", "warning"); } },
    { label: "Clear All Results", icon: "📊", desc: "Delete all exam attempts and results.", action: () => { clearAllResults(); toast("All results cleared", "warning"); } },
    { label: "Clear All Student Data", icon: "👥", desc: "Remove all registered student accounts.", action: () => { clearAllStudents(); toast("All student data cleared", "warning"); } },
  ];

  const Toggle = ({ field }) => (
    <button onClick={() => setSettings(s => ({ ...s, [field]: !s[field] }))}
      className={`relative w-12 h-6 rounded-full transition-colors ${settings[field] ? "bg-accent" : isDark ? "bg-surface-500" : "bg-light-border"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${settings[field] ? "translate-x-6" : ""}`}></span>
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
    
    </div>
  );
}
