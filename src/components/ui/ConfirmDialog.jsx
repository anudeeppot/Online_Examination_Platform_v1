export default function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-700 border border-surface-500 rounded-2xl shadow-2xl animate-slide-up p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 ${danger ? "bg-rose-500/20" : "bg-gold/20"}`}>
          {danger ? "⚠️" : "❓"}
        </div>
        <h3 className="font-display font-semibold text-lg text-white mb-2">{title}</h3>
        <p className="font-body text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-surface-400 text-gray-300 text-sm font-body hover:border-gray-300 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${danger ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-accent hover:bg-accent-dim text-surface-900"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
