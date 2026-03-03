import { useState } from "react";
import type { Problem, ProblemProgress, SolveRating } from "../types";
import {
  DIFFICULTIES,
  DIFF_BG,
  DIFF_COLOR,
  PATTERN_COLORS,
} from "../config";
import { RatingModal } from "./RatingModal";

interface Props {
  allProblems: Problem[];
  allPatterns: string[];
  progress: Record<number, ProblemProgress>;
  randomPick: Problem | null;
  pickHistory: Problem[];
  pickScope: "all" | "unsolved" | "solved";
  pickPattern: string;
  pickDiff: string;
  isRolling: boolean;
  pickRevealed: boolean;
  pickPool: Problem[];
  setPickScope: (s: "all" | "unsolved" | "solved") => void;
  setPickPattern: (p: string) => void;
  setPickDiff: (d: string) => void;
  setPickRevealed: (r: boolean) => void;
  setPickHistory: React.Dispatch<React.SetStateAction<Problem[]>>;
  rollRandomQuestion: () => void;
  onMarkSolved: (id: number, rating?: SolveRating) => void;
}

export function RandomPickerTab({
  allProblems,
  allPatterns,
  progress,
  randomPick,
  pickHistory,
  pickScope,
  pickPattern,
  pickDiff,
  isRolling,
  pickRevealed,
  pickPool,
  setPickScope,
  setPickPattern,
  setPickDiff,
  setPickRevealed,
  setPickHistory,
  rollRandomQuestion,
  onMarkSolved,
}: Props) {
  const [ratingId, setRatingId] = useState<number | null>(null);

  const handleSolve = (id: number) => setRatingId(id);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Picker controls */}
      <div className="glass-card p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">
                🎯
              </span>{" "}
              Pick Settings
            </h3>
            {/* scope */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500">
                Scope
              </span>
              {(["all", "unsolved", "solved"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setPickScope(s)}
                  className={`pill ${pickScope === s ? "pill-active bg-blue-500/15 border-blue-400 text-blue-400" : ""}`}
                  style={
                    pickScope !== s
                      ? {
                          borderColor: "rgb(51 65 85 / .5)",
                          color: "rgb(148 163 184)",
                        }
                      : {}
                  }
                  aria-pressed={pickScope === s}
                >
                  {s === "all" ? "All" : s === "unsolved" ? "Unsolved" : "Solved"}
                </button>
              ))}
            </div>
            {/* pattern */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500">
                Pattern
              </span>
              {allPatterns.map((p) => {
                const active = pickPattern === p;
                const c = PATTERN_COLORS[p] || "#3b82f6";
                return (
                  <button
                    key={p}
                    onClick={() => setPickPattern(p)}
                    className={`pill ${active ? "pill-active" : ""}`}
                    style={{
                      borderColor: active ? c : undefined,
                      background: active ? c + "18" : undefined,
                      color: active ? c : undefined,
                      ...(active ? { boxShadow: `0 0 12px ${c}25` } : {}),
                      ...(!active
                        ? {
                            borderColor: "rgb(51 65 85 / .5)",
                            color: "rgb(148 163 184)",
                          }
                        : {}),
                    }}
                    aria-pressed={active}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            {/* difficulty */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500">
                Difficulty
              </span>
              {DIFFICULTIES.map((d) => {
                const active = pickDiff === d;
                const c = DIFF_COLOR[d] || "#3b82f6";
                const bg = DIFF_BG[d] || "#3b82f622";
                return (
                  <button
                    key={d}
                    onClick={() => setPickDiff(d)}
                    className={`pill ${active ? "pill-active" : ""}`}
                    style={{
                      borderColor: active ? c : undefined,
                      background: active ? bg : undefined,
                      color: active ? c : undefined,
                      ...(!active
                        ? {
                            borderColor: "rgb(51 65 85 / .5)",
                            color: "rgb(148 163 184)",
                          }
                        : {}),
                    }}
                    aria-pressed={active}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Pick button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={rollRandomQuestion}
              disabled={pickPool.length === 0 || isRolling}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 active:scale-95 overflow-hidden"
              aria-label={isRolling ? "Rolling..." : "Pick a random question"}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span
                  className={`text-lg sm:text-xl ${isRolling ? "animate-spin" : "group-hover:animate-bounce"}`}
                  aria-hidden="true"
                >
                  🎲
                </span>
                {isRolling ? "Rolling…" : "Pick Random"}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <span className="text-[11px] text-surface-500">
              {pickPool.length} question{pickPool.length !== 1 ? "s" : ""} in
              pool
            </span>
          </div>
        </div>
      </div>

      {/* Picked question */}
      {randomPick && (
        <div
          className={`glass-card p-4 sm:p-6 transition-all duration-300 ${isRolling ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"}`}
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                {isRolling ? "Shuffling…" : "Your question"}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
                {randomPick.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: DIFF_BG[randomPick.difficulty],
                    color: DIFF_COLOR[randomPick.difficulty],
                  }}
                >
                  {randomPick.difficulty}
                </span>
                {pickRevealed ? (
                  <button
                    onClick={() => setPickRevealed(false)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                    style={{
                      background:
                        PATTERN_COLORS[randomPick.pattern] + "1a",
                      color: PATTERN_COLORS[randomPick.pattern],
                    }}
                  >
                    {randomPick.pattern}{" "}
                    <span className="opacity-60">✕</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setPickRevealed(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer bg-surface-700/60 text-surface-400 hover:bg-surface-600/60 hover:text-surface-200 transition-colors"
                    aria-label="Reveal pattern"
                  >
                    👁 Reveal Pattern
                  </button>
                )}
                {progress[randomPick.id] ? (
                  <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />{" "}
                    Solved
                  </span>
                ) : (
                  <span className="text-surface-500 text-xs">Unsolved</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <a
                href={randomPick.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs px-4 py-2 text-center no-underline"
                aria-label={`Open ${randomPick.name} on LeetCode`}
              >
                Open on LeetCode ↗
              </a>
              {!progress[randomPick.id] && (
                <button
                  onClick={() => handleSolve(randomPick.id)}
                  className="btn-success text-xs px-4 py-2"
                  aria-label={`Mark ${randomPick.name} as solved`}
                >
                  ✓ Mark Solved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!randomPick && !isRolling && (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">
            🎲
          </div>
          <h2 className="text-lg font-bold text-surface-300 mb-1">
            Ready to practice?
          </h2>
          <p className="text-sm text-surface-500 max-w-xs">
            Set your filters and hit{" "}
            <strong className="text-indigo-400">Pick Random</strong> to get a
            question.
            <span className="block mt-1 text-surface-600">
              Shortcut: press <kbd className="px-1 py-0.5 bg-surface-800 rounded text-[10px]">R</kbd>
            </span>
          </p>
        </div>
      )}

      {/* Pick history */}
      {pickHistory.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-bold text-surface-300">
              Recent Picks
            </h3>
            <div className="flex-1 h-px bg-surface-700/40" />
            <button
              onClick={() => setPickHistory([])}
              className="text-[11px] text-surface-600 hover:text-surface-400 cursor-pointer transition-colors"
              aria-label="Clear pick history"
            >
              Clear
            </button>
          </div>
          <div className="grid gap-2">
            {pickHistory.map((p, i) => (
              <div
                key={p.id}
                className="glass-card-inner flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 group hover:bg-surface-700/30 transition-colors"
              >
                <span className="text-surface-600 text-xs w-5 text-right tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: DIFF_BG[p.difficulty],
                        color: DIFF_COLOR[p.difficulty],
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-surface-200 group-hover:text-white hover:underline decoration-1 underline-offset-2 transition-colors"
                  >
                    {p.name}
                  </a>
                </div>
                {progress[p.id] ? (
                  <span className="text-emerald-400 text-[11px] font-medium">
                    Solved
                  </span>
                ) : (
                  <button
                    onClick={() => handleSolve(p.id)}
                    className="btn-success text-[11px] px-2.5 py-1"
                  >
                    ✓ Solve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        open={ratingId !== null}
        problemName={
          ratingId !== null
            ? (allProblems.find((p) => p.id === ratingId)?.name ?? "")
            : ""
        }
        onRate={(rating) => {
          if (ratingId !== null) onMarkSolved(ratingId, rating);
          setRatingId(null);
        }}
        onSkip={() => {
          if (ratingId !== null) onMarkSolved(ratingId);
          setRatingId(null);
        }}
      />
    </div>
  );
}
