import type { Toast as ToastType } from "../types";

const ICONS: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", icon: "bg-emerald-500" },
  error: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300", icon: "bg-red-500" },
  info: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300", icon: "bg-blue-500" },
  warning: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", icon: "bg-amber-500" },
};

interface Props {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const c = COLORS[toast.type] || COLORS.info;
        return (
          <div
            key={toast.id}
            className={`toast-enter pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg ${c.bg} ${c.border}`}
            role="alert"
          >
            <span
              className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${c.icon}`}
            >
              {ICONS[toast.type]}
            </span>
            <p className={`text-sm font-medium flex-1 ${c.text}`}>{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 text-surface-500 hover:text-surface-300 transition-colors text-sm leading-none mt-0.5"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
