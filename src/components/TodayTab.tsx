import { useState } from "react";
import type { Problem, ProblemProgress } from "../types";
import { DIFF_BG, DIFF_COLOR, SOURCE_COLORS, SPACED_DAYS } from "../config";
import { formatDate, today } from "../utils";

type RevFilter = "all" | "overdue" | "today" | "rev1" | "rev2" | "rev3" | "rev4";

const FILTER_OPTIONS: { key: RevFilter; label: string }[] = [
  { key: "all", label: "All Due" },
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Today Only" },
  { key: "rev1", label: `Rev 1 (Day +${SPACED_DAYS[0]})` },
  { key: "rev2", label: `Rev 2 (Day +${SPACED_DAYS[1]})` },
  { key: "rev3", label: `Rev 3 (Day +${SPACED_DAYS[2]})` },
  { key: "rev4", label: `Rev 4 (Day +${SPACED_DAYS[3]})` },
];

interface Props {
  problems: Problem[];
  progress: Record<number, ProblemProgress>;
  onToggleRevision: (id: number, rIdx: number) => void;
}

export function TodayTab({ problems, progress, onToggleRevision }: Props) {
  const [filter, setFilter] = useState<RevFilter>("all");
  const todayStr = today();

  // Collect all due revisions (date <= today && !done) with problem + revision index
  const allDue = problems.flatMap((p) => {
    const pg = progress[p.id];
    if (!pg) return [];
    return pg.revisions
      .map((r, i) => ({ problem: p, rev: r, rIdx: i, pg }))
      .filter(({ rev }) => !rev.done && rev.date <= todayStr);
  });

  // Apply filter
  const filtered = allDue.filter(({ rev, rIdx }) => {
    switch (filter) {
      case "overdue":
        return rev.date < todayStr;
      case "today":
        return rev.date === todayStr;
      case "rev1":
        return rIdx === 0;
      case "rev2":
        return rIdx === 1;
      case "rev3":
        return rIdx === 2;
      case "rev4":
        return rIdx === 3;
      default:
        return true;
    }
  });

  // Group by problem id so we can show problems with their due revisions
  const groupedByProblem = new Map<number, { problem: Problem; pg: ProblemProgress; revs: { rIdx: number; date: string }[] }>();
  for (const { problem, pg, rIdx, rev } of filtered) {
    let entry = groupedByProblem.get(problem.id);
    if (!entry) {
      entry = { problem, pg, revs: [] };
      groupedByProblem.set(problem.id, entry);
    }
    entry.revs.push({ rIdx, date: rev.date });
  }
  const problemEntries = Array.from(groupedByProblem.values());

  // Counts for badges
  const overdueCount = allDue.filter(({ rev }) => rev.date < todayStr).length;
  const todayOnlyCount = allDue.filter(({ rev }) => rev.date === todayStr).length;

  if (allDue.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">
            🎉
          </div>
          <h2 className="text-lg font-bold text-surface-300 mb-1">
            All caught up!
          </h2>
          <p className="text-sm text-surface-500 max-w-xs">
            No revisions due today. Keep solving problems to build your
            spaced-repetition schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
          Due Today{" "}
          <span className="text-xs font-semibold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">
            {allDue.length} revision{allDue.length > 1 ? "s" : ""}
          </span>
          {overdueCount > 0 && (
            <span className="text-xs font-semibold bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">
              {overdueCount} overdue
            </span>
          )}
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as RevFilter)}
          className="text-xs bg-surface-800 border border-surface-700/60 text-surface-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500/50 transition-colors"
          aria-label="Filter revisions"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {problemEntries.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-12 text-center">
          <div className="text-3xl mb-3" aria-hidden="true">🔍</div>
          <p className="text-sm text-surface-500">
            No revisions match the selected filter.
          </p>
        </div>
      ) : (
        problemEntries.map(({ problem: p, pg, revs }) => (
          <div
            key={p.id}
            className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
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
                className="block text-sm sm:text-base font-semibold text-white hover:text-blue-400 transition-colors hover:underline decoration-1 underline-offset-2 mb-1.5"
                aria-label={`${p.name} on ${p.source}`}
              >
                {p.name}
              </a>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full no-underline transition-colors"
                style={{
                  background: (SOURCE_COLORS[p.source] || "#3b82f6") + "18",
                  color: SOURCE_COLORS[p.source] || "#3b82f6",
                }}
              >
                Open on {p.source} ↗
              </a>
              <p className="text-xs text-surface-500 mt-1">
                Solved: {formatDate(pg.solvedDate)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {revs.map((r) => (
                <button
                  key={r.rIdx}
                  onClick={() => onToggleRevision(p.id, r.rIdx)}
                  className={`text-xs px-3 sm:px-4 py-2 flex items-center gap-1.5 active:scale-95 transition-all rounded-lg font-semibold border cursor-pointer ${
                    r.date < todayStr
                      ? "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                  }`}
                  aria-label={`Mark revision ${r.rIdx + 1} done for ${p.name}`}
                >
                  ✓ Rev {r.rIdx + 1} Done {r.date < todayStr && "(overdue)"}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
