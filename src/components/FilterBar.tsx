import { useState, useEffect } from "react";
import {
  DIFFICULTIES,
  DIFF_COLOR,
  DIFF_BG,
  PATTERN_COLORS,
  SOURCES,
  SOURCE_COLORS,
  TOPIC_COLORS,
} from "../config";
import type { ScopeFilter } from "../types";

interface Props {
  filterScope: ScopeFilter;
  filterPattern: string;
  filterDiff: string;
  filterSource: string;
  filterTopic: string;
  search: string;
  patterns: string[];
  topics: string[];
  onScopeChange: (s: ScopeFilter) => void;
  onPatternChange: (p: string) => void;
  onDiffChange: (d: string) => void;
  onSourceChange: (s: string) => void;
  onTopicChange: (t: string) => void;
  onSearchChange: (s: string) => void;
}

export function FilterBar({
  filterScope,
  filterPattern,
  filterDiff,
  filterSource,
  filterTopic,
  search,
  patterns,
  topics,
  onScopeChange,
  onPatternChange,
  onDiffChange,
  onSourceChange,
  onTopicChange,
  onSearchChange,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  // Count active filters (non-default)
  const activeCount =
    (filterScope !== "all" ? 1 : 0) +
    (filterDiff !== "All" ? 1 : 0) +
    (filterSource !== "All" ? 1 : 0) +
    (filterTopic !== "All" ? 1 : 0);

  // Active filter summary chips for quick view
  const activeChips: { label: string; color: string; onClear: () => void }[] = [];
  if (filterScope !== "all")
    activeChips.push({ label: `Scope: ${filterScope}`, color: "#3b82f6", onClear: () => onScopeChange("all") });
  if (filterDiff !== "All")
    activeChips.push({ label: filterDiff, color: DIFF_COLOR[filterDiff] || "#3b82f6", onClear: () => onDiffChange("All") });
  if (filterSource !== "All")
    activeChips.push({ label: filterSource, color: SOURCE_COLORS[filterSource] || "#3b82f6", onClear: () => onSourceChange("All") });
  if (filterTopic !== "All")
    activeChips.push({ label: filterTopic, color: TOPIC_COLORS[filterTopic] || "#3b82f6", onClear: () => onTopicChange("All") });

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [modalOpen]);

  return (
    <>
      <div className="glass-card p-4 flex flex-col gap-3">
        {/* Row 1: Search + Filter button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
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
          <button
            onClick={() => setModalOpen(true)}
            className="relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-700/60 bg-surface-800/80 text-sm text-surface-300 hover:text-white hover:border-surface-500 transition-colors cursor-pointer"
            aria-label={`Open filters${activeCount > 0 ? ` (${activeCount} active)` : ""}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold px-1">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Pattern pills (always visible) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">
            Pattern
          </span>
          {patterns.map((p) => {
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

        {/* Row 3: Active filter chips (only when filters are applied) */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">
              Active
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                style={{
                  borderColor: chip.color,
                  background: chip.color + "18",
                  color: chip.color,
                }}
              >
                {chip.label}
                <button
                  onClick={chip.onClear}
                  className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                onScopeChange("all");
                onDiffChange("All");
                onSourceChange("All");
                onTopicChange("All");
              }}
              className="text-[11px] text-surface-500 hover:text-surface-300 cursor-pointer transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Filter Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-label="Filter problems"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg glass-card p-6 animate-slide-up space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeCount > 0 && (
                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface-700/60 text-surface-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Scope */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Scope
              </label>
              <div className="flex flex-wrap gap-2">
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
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pattern (also in modal) */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Pattern
              </label>
              <div className="flex flex-wrap gap-2">
                {patterns.map((p) => {
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
                      type="button"
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
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
                      type="button"
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Source
              </label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => {
                  const active = filterSource === s;
                  const c = SOURCE_COLORS[s] || "#3b82f6";
                  return (
                    <button
                      key={s}
                      onClick={() => onSourceChange(s)}
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
                      type="button"
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Topic
              </label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => {
                  const active = filterTopic === t;
                  const c = TOPIC_COLORS[t] || "#3b82f6";
                  return (
                    <button
                      key={t}
                      onClick={() => onTopicChange(t)}
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
                      type="button"
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-700/30">
              <button
                onClick={() => {
                  onScopeChange("all");
                  onPatternChange("All");
                  onDiffChange("All");
                  onSourceChange("All");
                  onTopicChange("All");
                }}
                className="text-xs text-surface-500 hover:text-surface-300 cursor-pointer transition-colors"
                type="button"
              >
                Reset all filters
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-success text-xs px-5"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
