import { useRef } from "react";
import { PROBLEMS, SPACED_DAYS } from "../config";
import type { ProblemProgress, ExportData } from "../types";
import { ProgressRing } from "./ProgressRing";

interface Props {
  progress: Record<number, ProblemProgress>;
  todayCount: number;
  solvedCount: number;
  totalRevsDone: number;
  totalRevs: number;
  notesById: Record<number, string>;
  onExport: (notes: Record<number, string>) => ExportData;
  onImport: (
    data: ExportData,
    setNotes: (n: Record<number, string>) => void
  ) => void;
  setNotesById: (n: Record<number, string>) => void;
}

export function Header({
  todayCount,
  solvedCount,
  totalRevsDone,
  totalRevs,
  notesById,
  onExport,
  onImport,
  setNotesById,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = onExport(notesById);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsa-tracker-backup-${data.exportedAt.split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as ExportData;
        if (!data.progress || data.version !== 1) {
          alert("Invalid backup file format.");
          return;
        }
        onImport(data, setNotesById);
        alert(
          `Imported successfully! (${Object.keys(data.progress).length} solved, ${Object.keys(data.notes || {}).length} notes)`
        );
      } catch {
        alert("Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="relative overflow-hidden border-b border-surface-700/50">
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      {/* Skip to content – accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-5 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        {/* Brand */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-base sm:text-lg shadow-lg shadow-blue-600/30"
              aria-hidden="true"
            >
              🧠
            </span>
            DSA Revision Tracker
          </h1>
          <p className="mt-1 text-[10px] sm:text-xs text-surface-500">
            Spaced Repetition · Pattern Blind · Interview Ready
          </p>
        </div>

        {/* Stats + Export/Import */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Stat cards */}
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            {[
              {
                label: "Solved",
                val: solvedCount,
                total: PROBLEMS.length,
                color: "#4ade80",
              },
              {
                label: "Revisions",
                val: totalRevsDone,
                total: totalRevs,
                color: "#818cf8",
              },
              {
                label: "Due Today",
                val: todayCount,
                total: undefined as number | undefined,
                color: "#f87171",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-card px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 min-w-[120px] sm:min-w-[160px]"
                role="status"
                aria-label={`${s.label}: ${s.val}${s.total !== undefined ? ` of ${s.total}` : ""}`}
              >
                <div className="relative flex items-center justify-center">
                  <ProgressRing
                    pct={
                      s.total
                        ? s.val / (s.total || 1)
                        : s.val > 0
                          ? 1
                          : 0
                    }
                    color={s.color}
                    size={36}
                  />
                  <span
                    className="absolute text-[10px] sm:text-xs font-bold"
                    style={{ color: s.color }}
                  >
                    {s.val}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-surface-500 font-semibold">
                    {s.label}
                  </div>
                  {s.total !== undefined && (
                    <div className="text-xs sm:text-sm font-bold text-surface-300">
                      {s.val}
                      <span className="text-surface-600">/{s.total}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Export / Import */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="btn-ghost text-[10px] sm:text-[11px] px-2.5 py-1.5 flex items-center gap-1"
              aria-label="Export data as JSON backup"
            >
              <span aria-hidden="true">📤</span> Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost text-[10px] sm:text-[11px] px-2.5 py-1.5 flex items-center gap-1"
              aria-label="Import data from JSON backup"
            >
              <span aria-hidden="true">📥</span> Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
