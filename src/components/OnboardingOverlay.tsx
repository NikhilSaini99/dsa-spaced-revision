import { useState } from "react";

interface Props {
  open: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to DSA Revision Tracker",
    emoji: "🧠",
    description: "Master data structures and algorithms through spaced repetition and pattern-blind practice.",
    detail: "130+ curated problems across 14 patterns — from Two Pointers to Dynamic Programming.",
  },
  {
    title: "Pattern-Blind Practice",
    emoji: "🎲",
    description: "Problems are designed to be practiced without knowing the pattern first.",
    detail: "Use the Random tab to pick problems without seeing their category. Toggle pattern reveal when ready. This builds real problem-solving intuition.",
  },
  {
    title: "Spaced Repetition",
    emoji: "📅",
    description: "After solving a problem, it's automatically scheduled for revision.",
    detail: "Default intervals: Day 3, 5, 9, and 15. Rate your confidence after solving — the system adapts to your pace. Check the Today tab for due revisions.",
  },
  {
    title: "Track Your Progress",
    emoji: "📊",
    description: "Build streaks, track patterns, and visualize your growth.",
    detail: "The Stats tab shows your mastery across patterns, solve trends, and a study heatmap. Keyboard shortcuts: 1-4 switch tabs, R picks a random question.",
  },
];

export function OnboardingOverlay({ open, onComplete }: Props) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative glass-card w-full max-w-md p-8 text-center animate-bounce-in">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-blue-500" : i < step ? "w-4 bg-blue-500/50" : "w-4 bg-surface-700"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-5xl mb-4">{current.emoji}</div>
        <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
        <p className="text-sm text-surface-300 mb-3">{current.description}</p>
        <p className="text-xs text-surface-500 leading-relaxed">{current.detail}</p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={onComplete}
            className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
          >
            Skip intro
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="btn-ghost text-xs px-4 py-2"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) onComplete();
                else setStep((s) => s + 1);
              }}
              className="btn-primary text-xs px-6 py-2"
            >
              {isLast ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
