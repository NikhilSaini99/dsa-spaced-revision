import { useRef } from "react";
import { SPACED_DAYS } from "../config";
import type { Problem, ProblemProgress, ExportData } from "../types";
import { ProgressRing } from "./ProgressRing";

interface Props {
  progress: Record<number, ProblemProgress>;
  todayCount: number;
  solvedCount: number;
  totalProblems: number;
  totalRevsDone: number;
  totalRevs: number;
  notesById: Record<number, string>;
  customProblems: Problem[];
  onExport: (notes: Record<number, string>) => ExportData;
  onImport: (
    data: ExportData,
    setNotes: (n: Record<number, string>) => void
  ) => void;
  setNotesById: (n: Record<number, string>) => void;
  importCustomProblems: (problems: Problem[]) => number;
  onAddProblem: () => void;
  currentStreak: number;
  longestStreak: number;
  todayActive: boolean;
  theme: string;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onToastSuccess: (msg: string) => void;
  onToastError: (msg: string) => void;
}

export function Header({
  todayCount,
  solvedCount,
  totalProblems,
  totalRevsDone,
  totalRevs,
  notesById,
  customProblems,
  onExport,
  onImport,
  setNotesById,
  importCustomProblems,
  onAddProblem,
  currentStreak,
  longestStreak,
  todayActive,
  theme,
  onToggleTheme,
  onOpenSettings,
  onToastSuccess,
  onToastError,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = onExport(notesById);
    // Include custom problems in export
    const exportPayload = { ...data, customProblems };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
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
          onToastError("Invalid backup file format.");
          return;
        }
        onImport(data, setNotesById);
        let customCount = 0;
        if (data.customProblems && Array.isArray(data.customProblems)) {
          customCount = importCustomProblems(data.customProblems);
        }
        onToastSuccess(
          `Imported successfully! (${Object.keys(data.progress).length} solved, ${Object.keys(data.notes || {}).length} notes${customCount > 0 ? `, ${customCount} custom problems` : ""})`
        );
      } catch {
        onToastError("Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="relative overflow-hidden" style={{ borderBottom: "1px solid var(--color-border)" }}>
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

      {/* Top Navbar — glass effect with brand + theme/settings */}
      <div
        className="sticky top-0 z-30"
        style={{
          background: "var(--color-glass-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--color-glass-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-base shadow-lg shadow-blue-600/30"
              aria-hidden="true"
            >
              🧠
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight" style={{ color: "var(--color-text-heading)" }}>
                DSA Revision Tracker
              </h1>
              <p className="text-[10px] sm:text-xs hidden sm:block" style={{ color: "var(--color-text-muted)" }}>
                Spaced Repetition · Pattern Blind · Interview Ready
              </p>
            </div>
          </div>

          {/* Right: Theme + Settings */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              <span className="text-lg" aria-hidden="true">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
            </button>
            <button
              onClick={onOpenSettings}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
              aria-label="Open settings"
            >
              <span className="text-lg" aria-hidden="true">
                ⚙️
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats + Actions Row */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
        {/* Stat cards */}
        <div className="flex gap-3 sm:gap-4 flex-wrap">
          {[
            {
              label: "Solved",
              val: solvedCount,
              total: totalProblems,
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
                  className="absolute text-[10px] sm:text-xs font-bold tabular-nums"
                  style={{ color: s.color }}
                >
                  {s.val}
                </span>
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
                  {s.label}
                </div>
                {s.total !== undefined && (
                  <div className="text-xs sm:text-sm font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>
                    {s.val}
                    <span style={{ color: "var(--color-text-muted)" }}>/{s.total}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Streak display */}
          <div
            className={`glass-card px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[120px]${!todayActive ? " animate-pulse" : ""}`}
            role="status"
            aria-label={`Current streak: ${currentStreak} days, longest: ${longestStreak} days`}
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              🔥
            </span>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-orange-400 tabular-nums">
                {currentStreak}
              </div>
              <div className="text-[10px] sm:text-[11px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                longest: {longestStreak}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons: Add / Export / Import */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddProblem}
            className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5"
            aria-label="Add a custom problem"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Problem
          </button>
          <button
            onClick={handleExport}
            className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5"
            aria-label="Export data as JSON backup"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5"
            aria-label="Import data from JSON backup"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
            </svg>
            Import
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
    </header>
  );
}
