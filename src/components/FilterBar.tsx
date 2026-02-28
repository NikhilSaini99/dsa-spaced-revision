import {
  PATTERNS,
  DIFFICULTIES,
  DIFF_COLOR,
  DIFF_BG,
  PATTERN_COLORS,
} from "../config";
import type { ScopeFilter } from "../types";

interface Props {
  filterScope: ScopeFilter;
  filterPattern: string;
  filterDiff: string;
  search: string;
  onScopeChange: (s: ScopeFilter) => void;
  onPatternChange: (p: string) => void;
  onDiffChange: (d: string) => void;
  onSearchChange: (s: string) => void;
}

export function FilterBar({
  filterScope,
  filterPattern,
  filterDiff,
  search,
  onScopeChange,
  onPatternChange,
  onDiffChange,
  onSearchChange,
}: Props) {
  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm pointer-events-none"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search problems by name..."
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-surface-700/60 bg-surface-900/70 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
          aria-label="Search problems"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 text-xs cursor-pointer"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Scope */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">
          Scope
        </span>
        {(
          [
            ["all", "All"],
            ["solved", "Solved"],
            ["unsolved", "Unsolved"],
          ] as const
        ).map(([key, label]) => {
          const active = filterScope === key;
          return (
            <button
              key={key}
              onClick={() => onScopeChange(key)}
              className={`pill ${
                active
                  ? "pill-active bg-blue-500/15 border-blue-400 text-blue-400"
                  : ""
              }`}
              style={
                !active
                  ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
                  : undefined
              }
              aria-pressed={active}
              aria-label={`Filter scope: ${label}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Pattern */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">
          Pattern
        </span>
        {PATTERNS.map((p) => {
          const active = filterPattern === p;
          const c = PATTERN_COLORS[p] || "#3b82f6";
          return (
            <button
              key={p}
              onClick={() => onPatternChange(p)}
              className={`pill ${active ? "pill-active" : ""}`}
              style={{
                borderColor: active ? c : undefined,
                background: active ? c + "18" : undefined,
                color: active ? c : undefined,
                ...(active ? { boxShadow: `0 0 12px ${c}25` } : {}),
                ...(!active
                  ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
                  : {}),
              }}
              aria-pressed={active}
              aria-label={`Filter pattern: ${p}`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Difficulty */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">
          Difficulty
        </span>
        {DIFFICULTIES.map((d) => {
          const active = filterDiff === d;
          const c = DIFF_COLOR[d] || "#3b82f6";
          const bg = DIFF_BG[d] || "#3b82f622";
          return (
            <button
              key={d}
              onClick={() => onDiffChange(d)}
              className={`pill ${active ? "pill-active" : ""}`}
              style={{
                borderColor: active ? c : undefined,
                background: active ? bg : undefined,
                color: active ? c : undefined,
                ...(!active
                  ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
                  : {}),
              }}
              aria-pressed={active}
              aria-label={`Filter difficulty: ${d}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
