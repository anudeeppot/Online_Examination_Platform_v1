export default function Modal({ open, onClose, title, children, size = "md" }) {
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative w-full ${sizes[size]} bg-surface-700 border border-surface-500 rounded-2xl shadow-2xl animate-slide-up`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-surface-500">
          <h2 className="font-display font-semibold text-lg text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
