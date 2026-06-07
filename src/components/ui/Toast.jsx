import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const colors = {
    success: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    error: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    info: "bg-accent/15 border-accent/30 text-accent",
    warning: "bg-gold/15 border-gold/30 text-gold",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm font-body text-sm animate-slide-up pointer-events-auto ${colors[t.type]}`}>
            <span className="font-bold">{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
