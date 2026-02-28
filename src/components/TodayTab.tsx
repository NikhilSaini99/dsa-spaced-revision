import type { ProblemProgress } from "../types";
import { PROBLEMS, DIFF_BG, DIFF_COLOR, PATTERN_COLORS } from "../config";
import { formatDate, today } from "../utils";

interface Props {
  progress: Record<number, ProblemProgress>;
  onToggleRevision: (id: number, rIdx: number) => void;
}

export function TodayTab({ progress, onToggleRevision }: Props) {
  const todayStr = today();
  const todayRevisions = PROBLEMS.filter((p) => {
    const pg = progress[p.id];
    return pg && pg.revisions.some((r) => !r.done && r.date <= todayStr);
  });

  if (todayRevisions.length === 0) {
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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-white">
          Due Today{" "}
          <span className="ml-2 text-xs font-semibold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">
            {todayRevisions.length} problem
            {todayRevisions.length > 1 ? "s" : ""}
          </span>
        </h2>
      </div>
      {todayRevisions.map((p) => {
        const pg = progress[p.id];
        const dueRevs = pg.revisions
          .map((r, i) => ({ ...r, i }))
          .filter((r) => !r.done && r.date <= todayStr);
        return (
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
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: PATTERN_COLORS[p.pattern] + "1a",
                    color: PATTERN_COLORS[p.pattern],
                  }}
                >
                  {p.pattern}
                </span>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm sm:text-base font-semibold text-white hover:text-blue-400 transition-colors hover:underline decoration-1 underline-offset-2"
                aria-label={`${p.name} on LeetCode`}
              >
                {p.name}
              </a>
              <p className="text-xs text-surface-500 mt-1">
                Solved: {formatDate(pg.solvedDate)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {dueRevs.map((r) => (
                <button
                  key={r.i}
                  onClick={() => onToggleRevision(p.id, r.i)}
                  className="btn-danger text-xs px-3 sm:px-4 py-2 flex items-center gap-1.5 hover:bg-red-600/40 active:scale-95 transition-all"
                  aria-label={`Mark revision ${r.i + 1} done for ${p.name}`}
                >
                  ✓ Rev {r.i + 1} Done
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
