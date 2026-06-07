import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useTheme } from "../context/ThemeContext";

export default function AdminLayout() {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className={`min-h-screen ${isDark ? "bg-surface-800" : "bg-light-bg"}`}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile topbar */}
        <div className={`lg:hidden flex items-center gap-3 px-4 py-3 border-b ${isDark ? "bg-surface-800 border-surface-500" : "bg-white border-light-border"}`}>
          <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-lg ${isDark ? "text-gray-400 hover:text-white" : "text-light-muted hover:text-light-text"}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <span className="font-display font-bold gradient-text">ExamPortal</span>
        </div>
        <main className="flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
