import type { Problem, ProblemProgress } from "../types";
import { DIFF_BG, DIFF_COLOR, PATTERN_COLORS, SOURCE_COLORS } from "../config";
import { formatDate, daysFromNow, today } from "../utils";

interface Props {
  problems: Problem[];
  progress: Record<number, ProblemProgress>;
  revealed: Record<number, boolean>;
  onToggleReveal: (id: number) => void;
}

export function UpcomingTab({ problems, progress, revealed, onToggleReveal }: Props) {
  const todayStr = today();
  const upcomingRevisions = problems.flatMap((p) => {
    const pg = progress[p.id];
    if (!pg) return [];
    return pg.revisions
      .map((r, i) => ({ ...p, rIdx: i, revDate: r.date, done: r.done }))
      .filter((r) => !r.done && r.revDate > todayStr);
  }).sort((a, b) => a.revDate.localeCompare(b.revDate));

  if (upcomingRevisions.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">
            📅
          </div>
          <h2 className="text-lg font-bold text-surface-300 mb-1">
            No upcoming revisions
          </h2>
          <p className="text-sm text-surface-500 max-w-xs">
            Start solving problems to build your revision schedule.
          </p>
        </div>
      </div>
    );
  }

  const byDate: Record<string, typeof upcomingRevisions> = {};
  upcomingRevisions.forEach((r) => {
    (byDate[r.revDate] ??= []).push(r);
  });

  return (
    <div className="animate-fade-in space-y-8">
      {Object.entries(byDate).map(([date, items]) => (
        <section key={date} aria-label={`Revisions for ${formatDate(date)}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-sm font-bold text-white">
              {formatDate(date)}
            </div>
            <span className="text-xs text-surface-500 font-medium">
              {daysFromNow(date)}
            </span>
            <div className="flex-1 h-px bg-surface-700/40" />
            <span className="text-xs text-surface-600">
              {items.length} problem{items.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-2">
            {items.map((p) => (
              <div
                key={`${p.id}-${p.rIdx}`}
                className="glass-card-inner flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 group hover:bg-surface-700/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors"
                        style={{
                          background: PATTERN_COLORS[p.pattern] + "1a",
                          color: PATTERN_COLORS[p.pattern],
                        }}
                      >
                        {p.pattern}{" "}
                        <span className="opacity-60">✕</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleReveal(p.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer bg-surface-700/60 text-surface-400 hover:bg-surface-600/60 hover:text-surface-200 transition-colors"
                        aria-label={`Reveal pattern for ${p.name}`}
                      >
                        👁 Reveal
                      </button>
                    )}
                    <span className="text-[10px] text-surface-600">
                      Rev {p.rIdx + 1}
                    </span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-surface-200 group-hover:text-white hover:underline decoration-1 underline-offset-2 transition-colors"
                    aria-label={`${p.name} on ${p.source}`}
                  >
                    {p.name}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-semibold text-blue-400 whitespace-nowrap">
                    {daysFromNow(p.revDate)}
                  </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full no-underline transition-colors"
                    style={{
                      background: (SOURCE_COLORS[p.source] || "#3b82f6") + "18",
                      color: SOURCE_COLORS[p.source] || "#3b82f6",
                    }}
                  >
                    {p.source} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
