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
          <div className="mb-5">
            <svg
              className="w-16 h-16 text-surface-500 animate-bounce-in"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
            No upcoming revisions
          </h2>
          <p className="text-sm max-w-xs" style={{ color: "var(--color-text-muted)" }}>
            Solve problems to schedule revisions. They'll appear here grouped by
            due date.
          </p>
        </div>
      </div>
    );
  }

  const byDate: Record<string, typeof upcomingRevisions> = {};
  upcomingRevisions.forEach((r) => {
    (byDate[r.revDate] ??= []).push(r);
  });

  let globalIdx = 0;

  return (
    <div className="animate-fade-in space-y-8">
      {Object.entries(byDate).map(([date, items]) => (
        <section key={date} aria-label={`Revisions for ${formatDate(date)}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-sm font-bold" style={{ color: "var(--color-text-heading)" }}>
              {formatDate(date)}
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              {daysFromNow(date)}
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border-subtle)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {items.length} problem{items.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-2">
            {items.map((p) => {
              const idx = globalIdx++;
              return (
                <div
                  key={`${p.id}-${p.rIdx}`}
                  className="glass-card-inner flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 group transition-colors animate-stagger-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
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
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-colors"
                          style={{ background: "var(--color-surface-elevated)", color: "var(--color-text-secondary)" }}
                          aria-label={`Reveal pattern for ${p.name}`}
                        >
                          Reveal
                        </button>
                      )}
                      <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                        Rev {p.rIdx + 1}
                      </span>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium hover:underline decoration-1 underline-offset-2 transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
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
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
