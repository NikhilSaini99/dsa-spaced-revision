import { useEffect } from "react";
import type { SolveRating } from "../types";
import { RATING_OPTIONS } from "../config";

interface Props {
  open: boolean;
  problemName: string;
  onRate: (rating: SolveRating) => void;
  onSkip: () => void;
}

export function RatingModal({ open, problemName, onRate, onSkip }: Props) {
  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onSkip();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onSkip]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Rate your solve"
      onClick={onSkip}
    >
      <div
        className="glass-card w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="text-3xl mb-2" aria-hidden="true">
            🎯
          </div>
          <h3 className="text-base font-bold text-white">How did it go?</h3>
          <p className="text-xs text-surface-500 mt-1 truncate">{problemName}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onRate(opt.key)}
              className="glass-card-inner p-4 flex flex-col items-center gap-2 hover:bg-surface-700/40 transition-all cursor-pointer group active:scale-95"
              aria-label={`Rate as ${opt.label}: ${opt.description}`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {opt.emoji}
              </span>
              <span className="text-sm font-bold" style={{ color: opt.color }}>
                {opt.label}
              </span>
              <span className="text-[10px] text-surface-500 text-center leading-tight">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onSkip}
          className="mt-4 w-full text-xs text-surface-500 hover:text-surface-300 border border-surface-700/50 rounded-lg py-2 cursor-pointer transition-colors"
          aria-label="Skip rating"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
