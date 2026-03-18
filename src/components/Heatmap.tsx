import { useMemo } from "react";

interface Props {
  activeDates: string[];
  weeks?: number;
}

const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getIntensity(count: number): string {
  if (count === 0) return "var(--color-surface)";
  if (count === 1) return "#1a4731";
  if (count === 2) return "#166534";
  if (count <= 4) return "#15803d";
  return "#22c55e";
}

export function Heatmap({ activeDates, weeks = 26 }: Props) {
  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    const dateCountMap: Record<string, number> = {};
    activeDates.forEach((d) => {
      dateCountMap[d] = (dateCountMap[d] || 0) + 1;
    });

    // Build grid: weeks columns × 7 day rows
    const totalDays = weeks * 7;
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // end on Saturday
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    const grid: { date: string; count: number; col: number; row: number }[] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const col = Math.floor(i / 7);
      const row = i % 7;
      grid.push({ date: dateStr, count: dateCountMap[dateStr] || 0, col, row });

      if (d.getMonth() !== lastMonth && row === 0) {
        monthLabels.push({ label: MONTHS[d.getMonth()], col });
        lastMonth = d.getMonth();
      }
    }

    return { grid, monthLabels };
  }, [activeDates, weeks]);

  const cellSize = 14;
  const gap = 3;
  const leftPad = 32;
  const topPad = 20;
  const svgWidth = leftPad + weeks * (cellSize + gap);
  const svgHeight = topPad + 7 * (cellSize + gap) + 4;

  const totalActivity = activeDates.length;

  return (
    <div>
      <div className="w-full">
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="block"
        >
          {/* Day labels */}
          {DAYS.map((label, i) =>
            label ? (
              <text
                key={i}
                x={leftPad - 6}
                y={topPad + i * (cellSize + gap) + cellSize / 2 + 3}
                textAnchor="end"
                className="text-[9px]"
                style={{ fill: "var(--color-text-muted)" }}
              >
                {label}
              </text>
            ) : null
          )}
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={leftPad + m.col * (cellSize + gap)}
              y={topPad - 6}
              className="text-[9px]"
              style={{ fill: "var(--color-text-muted)" }}
            >
              {m.label}
            </text>
          ))}
          {/* Cells */}
          {grid.map((cell, i) => (
            <rect
              key={i}
              x={leftPad + cell.col * (cellSize + gap)}
              y={topPad + cell.row * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={3}
              fill={getIntensity(cell.count)}
              className="transition-colors duration-200"
            >
              <title>{cell.date}: {cell.count} activit{cell.count === 1 ? "y" : "ies"}</title>
            </rect>
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
          {totalActivity} active days in the last {weeks} weeks
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Less</span>
          {[0, 1, 2, 4, 5].map((count) => (
            <div
              key={count}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getIntensity(count) }}
            />
          ))}
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>More</span>
        </div>
      </div>
    </div>
  );
}
