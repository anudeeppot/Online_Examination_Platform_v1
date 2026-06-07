import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/ui/Toast";
import { getResults, getExams } from "../../services/localStorageService";

export default function StudentProfile() {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);

  const results = getResults().filter(r => r.studentId === user?.id);
  const exams = getExams();
  const avg = results.length ? Math.round(results.reduce((s,r)=>s+r.percentage,0)/results.length) : 0;

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast("Name is required", "error");
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: form.name, email: form.email });
      toast("Profile updated successfully");
      setSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
 
    </div>
  );
}
