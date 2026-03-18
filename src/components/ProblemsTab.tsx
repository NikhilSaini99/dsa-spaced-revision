import { useState, useRef, useEffect } from "react";
import type {
  Problem,
  ProblemProgress,
  Revision,
  SolveRating,
  ScopeFilter,
  SortKey,
  SortDir,
} from "../types";
import {
  SPACED_DAYS,
  DIFF_BG,
  DIFF_COLOR,
  PATTERN_COLORS,
  RATING_OPTIONS,
  SOURCE_COLORS,
  TOPIC_COLORS,
} from "../config";
import { formatDate, daysFromNow, today, difficultyOrder } from "../utils";
import { FilterBar } from "./FilterBar";
import { ConfirmDialog } from "./ConfirmDialog";
import { RatingModal } from "./RatingModal";

interface Props {
  problems: Problem[];
  allPatterns: string[];
  allTopics: string[];
  progress: Record<number, ProblemProgress>;
  notesById: Record<number, string>;
  revealed: Record<number, boolean>;
  onMarkSolved: (id: number, rating?: SolveRating) => void;
  onToggleRevision: (id: number, rIdx: number) => void;
  onUnmark: (id: number) => void;
  onToggleReveal: (id: number) => void;
  onOpenNotes: (id: number) => void;
  onUpdateRating: (id: number, rating: SolveRating) => void;
  onEditProblem: (p: Problem) => void;
  onDeleteProblem: (id: number) => void;
}

export function ProblemsTab({
  problems,
  allPatterns,
  allTopics,
  progress,
  notesById,
  revealed,
  onMarkSolved,
  onToggleRevision,
  onUnmark,
  onToggleReveal,
  onOpenNotes,
  onUpdateRating,
  onEditProblem,
  onDeleteProblem,
}: Props) {
  const [filterScope, setFilterScope] = useState<ScopeFilter>("all");
  const [filterPattern, setFilterPattern] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [filterTopic, setFilterTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [popoverId, setPopoverId] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Rating modal
  const [ratingProblemId, setRatingProblemId] = useState<number | null>(null);
  // Confirm dialog
  const [confirmUnmarkId, setConfirmUnmarkId] = useState<number | null>(null);

  // Bulk selection
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const todayStr = today();

  /* close popover on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      )
        setPopoverId(null);
    }
    if (popoverId !== null) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [popoverId]);

  const filtered = problems.filter((p) => {
    if (filterScope === "solved" && !progress[p.id]) return false;
    if (filterScope === "unsolved" && progress[p.id]) return false;
    if (filterPattern !== "All" && p.pattern !== filterPattern) return false;
    if (filterDiff !== "All" && p.difficulty !== filterDiff) return false;
    if (filterSource !== "All" && p.source !== filterSource) return false;
    if (filterTopic !== "All" && !p.topics.includes(filterTopic)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.topics.some((t) => t.toLowerCase().includes(q)) &&
        !(p.companies?.some((c) => c.toLowerCase().includes(q)))
      )
        return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "id":
        cmp = a.id - b.id;
        break;
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "difficulty":
        cmp = difficultyOrder(a.difficulty) - difficultyOrder(b.difficulty);
        break;
      case "pattern":
        cmp = a.pattern.localeCompare(b.pattern);
        break;
      case "status": {
        const aS = progress[a.id] ? 1 : 0;
        const bS = progress[b.id] ? 1 : 0;
        cmp = aS - bS;
        break;
      }
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key)
      return <span className="text-surface-700 ml-1">⇅</span>;
    return (
      <span className="text-blue-400 ml-1">
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const solvedCount = Object.keys(progress).length;
  const ratingProblem =
    ratingProblemId !== null
      ? problems.find((p) => p.id === ratingProblemId)
      : null;
  const confirmProblem =
    confirmUnmarkId !== null
      ? problems.find((p) => p.id === confirmUnmarkId)
      : null;

  const handleSolveClick = (id: number) => setRatingProblemId(id);

  const handleRating = (rating: SolveRating) => {
    if (ratingProblemId !== null) {
      if (progress[ratingProblemId]) {
        onUpdateRating(ratingProblemId, rating);
      } else {
        onMarkSolved(ratingProblemId, rating);
      }
    }
    setRatingProblemId(null);
  };

  const handleRatingSkip = () => {
    if (ratingProblemId !== null && !progress[ratingProblemId]) {
      onMarkSolved(ratingProblemId);
    }
    setRatingProblemId(null);
  };

  const handleUnmarkClick = (id: number) => setConfirmUnmarkId(id);

  const handleConfirmUnmark = () => {
    if (confirmUnmarkId !== null) onUnmark(confirmUnmarkId);
    setConfirmUnmarkId(null);
  };

  // Bulk operations
  const toggleSelectMode = () => {
    if (selectMode) {
      setSelectedIds(new Set());
    }
    setSelectMode((v) => !v);
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const bulkMarkSolved = () => {
    selectedIds.forEach((id) => {
      if (!progress[id]) onMarkSolved(id);
    });
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    selectedIds.forEach((id) => {
      const prob = problems.find((p) => p.id === id);
      if (prob && !prob.builtIn) onDeleteProblem(id);
    });
    setSelectedIds(new Set());
  };

  const hasFiltersActive =
    filterScope !== "all" ||
    filterPattern !== "All" ||
    filterDiff !== "All" ||
    filterSource !== "All" ||
    filterTopic !== "All" ||
    search.trim() !== "";

  const clearAllFilters = () => {
    setFilterScope("all");
    setFilterPattern("All");
    setFilterDiff("All");
    setFilterSource("All");
    setFilterTopic("All");
    setSearch("");
  };

  return (
    <div className="space-y-5">
      <FilterBar
        filterScope={filterScope}
        filterPattern={filterPattern}
        filterDiff={filterDiff}
        filterSource={filterSource}
        filterTopic={filterTopic}
        search={search}
        patterns={allPatterns}
        topics={allTopics}
        onScopeChange={setFilterScope}
        onPatternChange={setFilterPattern}
        onDiffChange={setFilterDiff}
        onSourceChange={setFilterSource}
        onTopicChange={setFilterTopic}
        onSearchChange={setSearch}
      />

      {/* Pattern-blind notice */}
      <div
        className="glass-card-inner flex items-center gap-3 px-4 py-3 text-sm text-surface-400"
        role="note"
      >
        <span className="text-xl" aria-hidden="true">
          🙈
        </span>
        <span>
          Patterns are{" "}
          <strong className="text-surface-100">hidden by default</strong>. Try
          to identify the pattern yourself, then tap{" "}
          <strong className="text-indigo-400">Reveal</strong> to verify.
          <span className="hidden sm:inline text-surface-600 ml-2">
            Shortcuts: 1-4 switch tabs, R picks random
          </span>
        </span>
      </div>

      {/* Floating bulk action bar */}
      {selectMode && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card flex items-center gap-2 px-4 py-3 animate-slide-up shadow-2xl">
          <button
            onClick={bulkMarkSolved}
            className="btn-success text-xs px-3 py-1.5"
          >
            Mark Solved ({selectedIds.size})
          </button>
          <button
            onClick={bulkDelete}
            className="btn-ghost text-xs px-3 py-1.5 text-red-400 hover:text-red-300"
          >
            Delete ({selectedIds.size})
          </button>
          <button
            onClick={clearSelection}
            className="btn-ghost text-xs px-3 py-1.5 text-surface-400 hover:text-surface-200"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {sorted.length === 0 && problems.length > 0 && hasFiltersActive && (
        <div className="glass-card flex flex-col items-center justify-center py-16 px-6 text-center">
          <svg
            className="w-12 h-12 text-surface-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="text-surface-400 text-sm mb-3">
            No problems match your filters
          </p>
          <button
            onClick={clearAllFilters}
            className="btn-ghost text-xs px-4 py-2 text-indigo-400 hover:text-indigo-300"
          >
            Clear filters
          </button>
        </div>
      )}

      {sorted.length === 0 && problems.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center py-16 px-6 text-center">
          <p className="text-surface-400 text-sm">
            No problems yet. Add your first problem!
          </p>
        </div>
      )}

      {/* ── DESKTOP TABLE ── */}
      {sorted.length > 0 && (
        <div className="glass-card overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              role="table"
              aria-label="Problems list"
            >
              <thead>
                <tr className="bg-surface-900/70">
                  {selectMode && (
                    <th className="px-3 py-3 first:rounded-tl-2xl">
                      <span className="sr-only">Select</span>
                    </th>
                  )}
                  {(
                    [
                      ["id", "#"],
                      ["name", "Problem"],
                      ["difficulty", "Difficulty"],
                      ["pattern", "Pattern"],
                      [null, "Source"],
                      [null, "Topics"],
                      ["status", "Status"],
                      [null, "Spaced Repetition"],
                      [null, "Rating"],
                      [null, "Notes"],
                      [null, "Actions"],
                    ] as const
                  ).map(([key, label]) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-surface-500 whitespace-nowrap ${!selectMode ? "first:rounded-tl-2xl" : ""} last:rounded-tr-2xl ${key ? "cursor-pointer hover:text-surface-300 select-none transition-colors" : ""}`}
                      onClick={key ? () => toggleSort(key as SortKey) : undefined}
                      scope="col"
                      aria-sort={
                        key && sortKey === (key as SortKey)
                          ? sortDir === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                    >
                      {label}
                      {key ? sortIndicator(key as SortKey) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30">
                {sorted.map((p, i) => {
                  const pg = progress[p.id];
                  const solved = !!pg;
                  return (
                    <tr
                      key={p.id}
                      className="table-row group animate-stagger-in"
                      style={{
                        animationDelay: `${Math.min(i, 20) * 30}ms`,
                      }}
                    >
                      {/* select checkbox */}
                      {selectMode && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(p.id)}
                            onChange={() => toggleSelected(p.id)}
                            className="w-4 h-4 accent-indigo-500 cursor-pointer"
                            aria-label={`Select ${p.name}`}
                          />
                        </td>
                      )}
                      {/* # */}
                      <td className="px-4 py-3 text-surface-500 text-xs tabular-nums">
                        {i + 1}
                      </td>
                      {/* name */}
                      <td className="px-4 py-3">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`font-medium hover:underline decoration-1 underline-offset-2 ${solved ? "text-emerald-400" : "text-surface-100 group-hover:text-white"}`}
                          aria-label={`${p.name} on ${p.source}${solved ? " (solved)" : ""}`}
                        >
                          {solved && (
                            <span
                              className="mr-1 check-animate"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )}
                          {p.name}
                        </a>
                        {/* Company tags indicator (from TUF scraping) */}
                        {p.companies && p.companies.length > 0 && (
                          <div className="relative inline-block ml-2 group/companies">
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-default"
                              title={p.companies.join(", ")}
                            >
                              🏢 {p.companies.length}
                            </span>
                            <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover/companies:flex flex-wrap gap-1 glass-card p-2 min-w-max max-w-xs animate-fade-in">
                              {p.companies.map((c) => (
                                <span
                                  key={c}
                                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      {/* difficulty */}
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            background: DIFF_BG[p.difficulty],
                            color: DIFF_COLOR[p.difficulty],
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      {/* pattern */}
                      <td className="px-4 py-3">
                        {revealed[p.id] ? (
                          <button
                            onClick={() => onToggleReveal(p.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors"
                            style={{
                              background:
                                PATTERN_COLORS[p.pattern] + "1a",
                              color: PATTERN_COLORS[p.pattern],
                            }}
                            aria-label={`Pattern revealed: ${p.pattern}. Click to hide.`}
                          >
                            {p.pattern}{" "}
                            <span className="opacity-60" aria-hidden="true">
                              ✕
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onToggleReveal(p.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer bg-surface-700/60 text-surface-400 hover:bg-surface-600/60 hover:text-surface-200 transition-colors"
                            aria-label={`Reveal pattern for ${p.name}`}
                          >
                            <span aria-hidden="true">👁</span> Reveal
                          </button>
                        )}
                      </td>
                      {/* source */}
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            background: (SOURCE_COLORS[p.source] || "#3b82f6") + "18",
                            color: SOURCE_COLORS[p.source] || "#3b82f6",
                          }}
                        >
                          {p.source}
                        </span>
                      </td>
                      {/* topics */}
                      <td className="px-4 py-3">
                        {p.topics.length > 0 ? (
                          <div className="flex items-center gap-1 relative group/topics">
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                              style={{
                                background: (TOPIC_COLORS[p.topics[0]] || "#94a3b8") + "18",
                                color: TOPIC_COLORS[p.topics[0]] || "#94a3b8",
                              }}
                            >
                              {p.topics[0]}
                            </span>
                            {p.topics.length > 1 && (
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-700/80 text-surface-300 cursor-default">
                                +{p.topics.length - 1}
                              </span>
                            )}
                            {p.topics.length > 1 && (
                              <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover/topics:flex flex-wrap gap-1 glass-card p-2 min-w-max animate-fade-in">
                                {p.topics.map((t) => (
                                  <span
                                    key={t}
                                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                                    style={{
                                      background: (TOPIC_COLORS[t] || "#94a3b8") + "18",
                                      color: TOPIC_COLORS[t] || "#94a3b8",
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-surface-700 text-[10px]">—</span>
                        )}
                      </td>
                      {/* status */}
                      <td className="px-4 py-3">
                        {solved ? (
                          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                              aria-hidden="true"
                            />
                            {formatDate(pg.solvedDate)}
                          </span>
                        ) : (
                          <span className="text-surface-600 text-xs">
                            Unsolved
                          </span>
                        )}
                      </td>
                      {/* spaced repetition */}
                      <td className="px-4 py-3 relative">
                        {solved ? (
                          <div className="relative">
                            <div className="flex items-center gap-1.5">
                              {pg.revisions.map(
                                (r: Revision, idx: number) => {
                                  const overdue =
                                    !r.done && r.date <= todayStr;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() =>
                                        onToggleRevision(p.id, idx)
                                      }
                                      title={`Rev ${idx + 1}: ${formatDate(r.date)} — ${r.done ? "Done" : overdue ? "Overdue!" : daysFromNow(r.date)}`}
                                      className={`revision-dot ${
                                        r.done
                                          ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30 hover:border-emerald-400/60"
                                          : overdue
                                            ? "bg-red-900/50 text-red-400 border-red-500/30 hover:border-red-400/60 animate-pulse-soft"
                                            : "bg-blue-900/40 text-blue-400 border-blue-500/25 hover:border-blue-400/60"
                                      }`}
                                      aria-label={`Revision ${idx + 1}: ${r.done ? "Completed" : overdue ? "Overdue" : daysFromNow(r.date)}`}
                                    >
                                      <span className="text-[10px] leading-none">
                                        {r.done ? "✓" : `R${idx + 1}`}
                                      </span>
                                      <span className="text-[7px] opacity-60 leading-none">
                                        {formatDate(r.date).replace(
                                          " ",
                                          "/"
                                        )}
                                      </span>
                                    </button>
                                  );
                                }
                              )}
                              {/* info button */}
                              <button
                                onClick={() =>
                                  setPopoverId(
                                    popoverId === p.id ? null : p.id
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-600/80 hover:text-surface-200 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                aria-label="Show revision details"
                              >
                                ℹ
                              </button>
                            </div>

                            {/* popover */}
                            {popoverId === p.id && (
                              <div
                                ref={popoverRef}
                                className="absolute top-11 left-0 z-50 glass-card p-4 min-w-[280px] animate-slide-up"
                                role="dialog"
                                aria-label="Revision schedule"
                              >
                                <div className="font-bold text-sm text-white mb-1">
                                  Revision Schedule
                                </div>
                                <p className="text-xs text-surface-500 mb-3">
                                  Solved on {formatDate(pg.solvedDate)} ·{" "}
                                  {
                                    pg.revisions.filter(
                                      (r: Revision) => r.done
                                    ).length
                                  }
                                  /{pg.revisions.length} done
                                </p>
                                <div className="space-y-1.5">
                                  {pg.revisions.map(
                                    (r: Revision, idx: number) => {
                                      const overdue =
                                        !r.done && r.date <= todayStr;
                                      return (
                                        <div
                                          key={idx}
                                          className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                                            r.done
                                              ? "bg-emerald-900/20"
                                              : overdue
                                                ? "bg-red-900/20"
                                                : "bg-blue-900/15"
                                          }`}
                                        >
                                          <div>
                                            <div
                                              className={`text-xs font-semibold ${r.done ? "text-emerald-400" : overdue ? "text-red-400" : "text-blue-400"}`}
                                            >
                                              Rev {idx + 1} — Day +
                                              {SPACED_DAYS[idx]}
                                            </div>
                                            <div className="text-[11px] text-surface-500">
                                              {formatDate(r.date)} ·{" "}
                                              {r.done
                                                ? "Completed"
                                                : overdue
                                                  ? "Overdue!"
                                                  : daysFromNow(r.date)}
                                            </div>
                                          </div>
                                          <button
                                            onClick={() =>
                                              onToggleRevision(p.id, idx)
                                            }
                                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                                              r.done
                                                ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-500/20"
                                                : overdue
                                                  ? "bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-500/20"
                                                  : "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 border border-blue-500/20"
                                            }`}
                                            aria-label={
                                              r.done
                                                ? `Undo revision ${idx + 1}`
                                                : `Mark revision ${idx + 1} done`
                                            }
                                          >
                                            {r.done ? "↩ Undo" : "✓ Done"}
                                          </button>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                                <button
                                  onClick={() => setPopoverId(null)}
                                  className="mt-3 w-full text-xs text-surface-500 hover:text-surface-300 border border-surface-700/50 rounded-lg py-1.5 cursor-pointer transition-colors"
                                >
                                  Close
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span
                            className="text-surface-700 text-xs"
                            aria-label="No revisions"
                          >
                            —
                          </span>
                        )}
                      </td>
                      {/* rating */}
                      <td className="px-4 py-3">
                        {solved && pg.rating ? (
                          <button
                            onClick={() => setRatingProblemId(p.id)}
                            className="inline-flex items-center gap-1 text-[11px] cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              color: RATING_OPTIONS.find(
                                (o) => o.key === pg.rating
                              )?.color,
                            }}
                            aria-label={`Rating: ${RATING_OPTIONS.find((o) => o.key === pg.rating)?.label}. Click to change.`}
                          >
                            <span>
                              {
                                RATING_OPTIONS.find(
                                  (o) => o.key === pg.rating
                                )?.emoji
                              }
                            </span>
                            <span className="font-semibold">
                              {
                                RATING_OPTIONS.find(
                                  (o) => o.key === pg.rating
                                )?.label
                              }
                            </span>
                          </button>
                        ) : solved ? (
                          <button
                            onClick={() => setRatingProblemId(p.id)}
                            className="text-[11px] text-surface-600 hover:text-surface-400 cursor-pointer transition-colors"
                            aria-label={`Rate ${p.name}`}
                          >
                            Rate
                          </button>
                        ) : (
                          <span className="text-surface-700 text-xs">
                            —
                          </span>
                        )}
                      </td>
                      {/* notes */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onOpenNotes(p.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-700/60 bg-surface-800/70 px-2.5 py-1.5 text-[11px] text-surface-300 hover:text-white hover:border-surface-600 hover:bg-surface-700/70 transition-colors cursor-pointer"
                          title={
                            notesById[p.id] ? "Edit notes" : "Add notes"
                          }
                          aria-label={
                            notesById[p.id]
                              ? `Edit notes for ${p.name}`
                              : `Add notes for ${p.name}`
                          }
                        >
                          <span aria-hidden="true">📝</span>
                          <span>
                            {notesById[p.id] ? "Edit" : "Add"}
                          </span>
                        </button>
                      </td>
                      {/* actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {!solved ? (
                            <button
                              onClick={() => handleSolveClick(p.id)}
                              className="btn-success text-[11px] px-3 py-1.5"
                              aria-label={`Mark ${p.name} as solved`}
                            >
                              ✓ Solved
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnmarkClick(p.id)}
                              className="btn-ghost text-[11px] px-3 py-1.5"
                              aria-label={`Unmark ${p.name} as solved`}
                            >
                              ↩ Undo
                            </button>
                          )}
                          {!p.builtIn && (
                            <>
                              <button
                                onClick={() => onEditProblem(p)}
                                className="w-7 h-7 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-600/80 hover:text-blue-400 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                title="Edit problem"
                                aria-label={`Edit ${p.name}`}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => onDeleteProblem(p.id)}
                                className="w-7 h-7 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-600/80 hover:text-red-400 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                title="Delete problem"
                                aria-label={`Delete ${p.name}`}
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* bottom bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-700/30 bg-surface-900/40">
            <span className="text-xs text-surface-500">
              Showing {sorted.length} of {problems.length} problems
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectMode}
                className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                  selectMode
                    ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30"
                    : "bg-surface-800/70 text-surface-400 border-surface-700/60 hover:text-surface-200 hover:border-surface-600"
                }`}
              >
                {selectMode ? "Exit Select" : "Select"}
              </button>
              <span className="text-xs text-surface-500">
                {solvedCount} solved · {problems.length - solvedCount} remaining
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE CARD LAYOUT ── */}
      <div className="md:hidden space-y-3">
        {sorted.map((p, i) => {
          const pg = progress[p.id];
          const solved = !!pg;
          return (
            <div
              key={p.id}
              className="glass-card p-4 space-y-3 animate-stagger-in"
              style={{
                animationDelay: `${Math.min(i, 20) * 30}ms`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                {selectMode && (
                  <div className="shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleSelected(p.id)}
                      className="w-5 h-5 accent-indigo-500 cursor-pointer"
                      aria-label={`Select ${p.name}`}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-semibold text-sm hover:underline decoration-1 underline-offset-2 block ${solved ? "text-emerald-400" : "text-surface-100"}`}
                    aria-label={`${p.name} on ${p.source}`}
                  >
                    {solved && (
                      <span className="mr-1 check-animate" aria-hidden="true">
                        ✓
                      </span>
                    )}
                    {p.name}
                  </a>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: DIFF_BG[p.difficulty],
                        color: DIFF_COLOR[p.difficulty],
                      }}
                    >
                      {p.difficulty}
                    </span>
                    {revealed[p.id] ? (
                      <button
                        onClick={() => onToggleReveal(p.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer"
                        style={{
                          background:
                            PATTERN_COLORS[p.pattern] + "1a",
                          color: PATTERN_COLORS[p.pattern],
                        }}
                      >
                        {p.pattern}{" "}
                        <span className="opacity-60">✕</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleReveal(p.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer bg-surface-700/60 text-surface-400"
                      >
                        👁 Reveal
                      </button>
                    )}
                    {solved && pg.rating && (
                      <span
                        className="text-[10px] font-semibold"
                        style={{
                          color: RATING_OPTIONS.find(
                            (o) => o.key === pg.rating
                          )?.color,
                        }}
                      >
                        {
                          RATING_OPTIONS.find(
                            (o) => o.key === pg.rating
                          )?.emoji
                        }{" "}
                        {
                          RATING_OPTIONS.find(
                            (o) => o.key === pg.rating
                          )?.label
                        }
                      </span>
                    )}
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: (SOURCE_COLORS[p.source] || "#3b82f6") + "18",
                        color: SOURCE_COLORS[p.source] || "#3b82f6",
                      }}
                    >
                      {p.source}
                    </span>
                    {p.topics.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          background: (TOPIC_COLORS[t] || "#94a3b8") + "18",
                          color: TOPIC_COLORS[t] || "#94a3b8",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {p.topics.length > 2 && (
                      <span
                        className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-700/80 text-surface-300"
                        title={p.topics.slice(2).join(", ")}
                      >
                        +{p.topics.length - 2}
                      </span>
                    )}
                    {p.companies && p.companies.length > 0 && (
                      <span
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        title={p.companies.join(", ")}
                      >
                        🏢 {p.companies.length}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {!solved ? (
                    <button
                      onClick={() => handleSolveClick(p.id)}
                      className="btn-success text-[10px] px-2.5 py-1.5 min-h-[44px]"
                    >
                      ✓ Solved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnmarkClick(p.id)}
                      className="btn-ghost text-[10px] px-2.5 py-1.5 min-h-[44px]"
                    >
                      ↩ Undo
                    </button>
                  )}
                  <button
                    onClick={() => onOpenNotes(p.id)}
                    className="text-[10px] text-surface-500 hover:text-surface-300 transition-colors cursor-pointer text-center"
                  >
                    📝 {notesById[p.id] ? "Edit" : "Notes"}
                  </button>
                  {!p.builtIn && (
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => onEditProblem(p)}
                        className="text-[10px] text-surface-500 hover:text-blue-400 transition-colors cursor-pointer"
                        aria-label={`Edit ${p.name}`}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteProblem(p.id)}
                        className="text-[10px] text-surface-500 hover:text-red-400 transition-colors cursor-pointer"
                        aria-label={`Delete ${p.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {solved && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-surface-700/20">
                  <span className="text-[10px] text-surface-500">
                    {formatDate(pg.solvedDate)}
                  </span>
                  {pg.revisions.map((r: Revision, idx: number) => {
                    const overdue = !r.done && r.date <= todayStr;
                    return (
                      <button
                        key={idx}
                        onClick={() => onToggleRevision(p.id, idx)}
                        className={`w-8 h-8 rounded-lg border flex flex-col items-center justify-center transition-colors cursor-pointer ${
                          r.done
                            ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                            : overdue
                              ? "bg-red-900/50 text-red-400 border-red-500/30 animate-pulse-soft"
                              : "bg-blue-900/40 text-blue-400 border-blue-500/25"
                        }`}
                        aria-label={`Revision ${idx + 1}: ${r.done ? "Done" : overdue ? "Overdue" : daysFromNow(r.date)}`}
                      >
                        <span className="text-[9px] leading-none">
                          {r.done ? "✓" : `R${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div className="text-center py-3 flex flex-col items-center gap-2">
          <span className="text-xs text-surface-500">
            Showing {sorted.length} of {problems.length} · {solvedCount}{" "}
            solved
          </span>
          <button
            onClick={toggleSelectMode}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
              selectMode
                ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30"
                : "bg-surface-800/70 text-surface-400 border-surface-700/60 hover:text-surface-200 hover:border-surface-600"
            }`}
          >
            {selectMode ? "Exit Select" : "Select"}
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        open={ratingProblemId !== null}
        problemName={ratingProblem?.name ?? ""}
        onRate={handleRating}
        onSkip={handleRatingSkip}
      />

      {/* Confirm Undo Dialog */}
      <ConfirmDialog
        open={confirmUnmarkId !== null}
        title="Unmark problem?"
        message={`This will remove "${confirmProblem?.name ?? ""}" from solved and delete all revision progress. Are you sure?`}
        confirmLabel="Unmark"
        danger
        onConfirm={handleConfirmUnmark}
        onCancel={() => setConfirmUnmarkId(null)}
      />
    </div>
  );
}
