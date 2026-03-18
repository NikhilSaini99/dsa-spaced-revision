import { useMemo } from "react";
import type { Problem, ProblemProgress } from "../types";
import { PATTERN_COLORS, DIFF_COLOR } from "../config";
import { Heatmap } from "./Heatmap";

interface Props {
  problems: Problem[];
  progress: Record<number, ProblemProgress>;
  activeDates: string[];
}

/* --- Tiny SVG Donut Chart --- */
function DonutChart({ data, size = 130 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>No data yet</div>;
  const r = (size - 16) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.filter(d => d.value > 0).map((d) => {
          const pct = d.value / total;
          const dashLen = pct * circumference;
          const dashOffset = -offset * circumference;
          offset += pct;
          return (
            <circle
              key={d.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={12}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-500"
            />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-lg font-bold" style={{ fill: "var(--color-text-heading)" }}>{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="text-[10px]" style={{ fill: "var(--color-text-muted)" }}>Total</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.filter(d => d.value > 0).map((d) => (
          <div key={d.label} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span style={{ color: "var(--color-text-secondary)" }}>{d.label}</span>
            <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Pattern Mastery Bars --- */
function PatternBars({ data }: { data: { pattern: string; solved: number; total: number; color: string }[] }) {
  return (
    <div className="space-y-2.5">
      {data.map((d) => {
        const pct = d.total > 0 ? (d.solved / d.total) * 100 : 0;
        return (
          <div key={d.pattern}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium truncate max-w-[60%]" style={{ color: "var(--color-text-primary)" }}>{d.pattern}</span>
              <span className="text-[10px] font-bold tabular-nums" style={{ color: d.color }}>
                {d.solved}/{d.total}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface)" }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --- Weekly Trend (Sparkline) --- */
function WeeklyTrend({ data }: { data: { week: string; count: number }[] }) {
  if (data.length === 0) return <div className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>Start solving to see trends</div>;
  const max = Math.max(...data.map((d) => d.count), 1);
  const w = 100 / data.length;

  return (
    <div>
      <svg viewBox="0 0 100 40" className="w-full h-24" preserveAspectRatio="none">
        {/* Area fill */}
        <defs>
          <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 40 ${data.map((d, i) => `L ${i * w + w / 2} ${40 - (d.count / max) * 36}`).join(" ")} L 100 40 Z`}
          fill="url(#trend-grad)"
        />
        {/* Line */}
        <polyline
          points={data.map((d, i) => `${i * w + w / 2},${40 - (d.count / max) * 36}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={i * w + w / 2}
            cy={40 - (d.count / max) * 36}
            r="1.5"
            fill="#3b82f6"
          />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {data.length <= 12 && data.map((d, i) => (
          <span key={i} className="text-[8px]" style={{ color: "var(--color-text-muted)" }}>{d.week}</span>
        ))}
      </div>
    </div>
  );
}

/* --- Main Stats Tab --- */
export function StatsTab({ problems, progress, activeDates }: Props) {
  const stats = useMemo(() => {
    const solved = Object.keys(progress).length;
    const totalRevsDone = Object.values(progress).reduce(
      (a, pg) => a + pg.revisions.filter((r) => r.done).length, 0
    );
    const totalRevs = solved * 4; // 4 revision intervals

    // Difficulty distribution
    const diffDist = { Easy: 0, Medium: 0, Hard: 0 };
    Object.keys(progress).forEach((idStr) => {
      const p = problems.find((pr) => pr.id === Number(idStr));
      if (p) diffDist[p.difficulty as keyof typeof diffDist]++;
    });

    // Pattern mastery
    const patternMap: Record<string, { solved: number; total: number; color: string }> = {};
    problems.forEach((p) => {
      if (!patternMap[p.pattern]) {
        patternMap[p.pattern] = { solved: 0, total: 0, color: PATTERN_COLORS[p.pattern] || "#64748b" };
      }
      patternMap[p.pattern].total++;
      if (progress[p.id]) patternMap[p.pattern].solved++;
    });
    const patternData = Object.entries(patternMap)
      .map(([pattern, d]) => ({ pattern, ...d }))
      .sort((a, b) => b.total - a.total);

    // Weekly trend (last 12 weeks)
    const weeklyMap: Record<string, number> = {};
    Object.values(progress).forEach((pg) => {
      const d = new Date(pg.solvedDate + "T00:00:00");
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      weeklyMap[key] = (weeklyMap[key] || 0) + 1;
    });
    const allWeeks = Object.entries(weeklyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, count]) => ({
        week: new Date(week + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      }));

    // Rating distribution
    const ratingDist: Record<string, number> = { easy: 0, "got-it": 0, struggled: 0, redo: 0 };
    Object.values(progress).forEach((pg) => {
      if (pg.rating) ratingDist[pg.rating]++;
    });

    return { solved, totalRevsDone, totalRevs, diffDist, patternData, allWeeks, ratingDist };
  }, [problems, progress]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Problems Solved", value: stats.solved, total: problems.length, color: "#4ade80" },
          { label: "Revisions Done", value: stats.totalRevsDone, total: stats.totalRevs, color: "#818cf8" },
          { label: "Completion", value: `${problems.length > 0 ? Math.round((stats.solved / problems.length) * 100) : 0}%`, color: "#60a5fa" },
          { label: "Avg Rating", value: stats.solved > 0 ? (Object.values(progress).filter(p => p.rating).length > 0 ? "Rated" : "\u2014") : "\u2014", color: "#facc15" },
        ].map((s) => (
          <div key={s.label} className="glass-card-inner p-4 text-center">
            <div className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>
              {typeof s.value === "number" ? s.value : s.value}
            </div>
            {typeof s.total === "number" && (
              <div className="text-[10px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>of {s.total}</div>
            )}
            <div className="text-[10px] uppercase tracking-wider font-semibold mt-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Difficulty Breakdown</h3>
          <DonutChart
            data={[
              { label: "Easy", value: stats.diffDist.Easy, color: DIFF_COLOR.Easy },
              { label: "Medium", value: stats.diffDist.Medium, color: DIFF_COLOR.Medium },
              { label: "Hard", value: stats.diffDist.Hard, color: DIFF_COLOR.Hard },
            ]}
          />
        </div>

        {/* Solve Trend */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Weekly Solve Trend</h3>
          <WeeklyTrend data={stats.allWeeks} />
        </div>

        {/* Pattern Mastery */}
        <div className="glass-card p-5 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Pattern Mastery</h3>
          <PatternBars data={stats.patternData} />
        </div>

        {/* Study Heatmap */}
        <div className="glass-card p-5 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Study Activity</h3>
          <Heatmap activeDates={activeDates} />
        </div>
      </div>
    </div>
  );
}
