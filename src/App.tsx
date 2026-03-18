import { useState, useCallback, useEffect } from "react";
import { SPACED_DAYS } from "./config";
import { today } from "./utils";
import { useHashTab } from "./hooks/useHashTab";
import { useProgress } from "./hooks/useProgress";
import { useNotes } from "./hooks/useNotes";
import { useRandomPicker } from "./hooks/useRandomPicker";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useProblems } from "./hooks/useProblems";
import { useToast } from "./hooks/useToast";
import { useTheme } from "./hooks/useTheme";
import { useStreaks } from "./hooks/useStreaks";
import { useSettings } from "./hooks/useSettings";
import { useNotifications } from "./hooks/useNotifications";
import { Header } from "./components/Header";
import { ProblemsTab } from "./components/ProblemsTab";
import { RandomPickerTab } from "./components/RandomPickerTab";
import { TodayTab } from "./components/TodayTab";
import { UpcomingTab } from "./components/UpcomingTab";
import { StatsTab } from "./components/StatsTab";
import { NotesModal } from "./components/NotesModal";
import { AddProblemModal } from "./components/AddProblemModal";
import { IncomingProblemsToast } from "./components/IncomingProblemsToast";
import { ToastContainer } from "./components/Toast";
import { SettingsModal } from "./components/SettingsModal";
import { OnboardingOverlay } from "./components/OnboardingOverlay";
import type { Problem, SourceKey } from "./types";

const ONBOARDING_KEY = "dsa-onboarded";

export default function App() {
  const [tab, setTab] = useHashTab();
  const {
    allProblems,
    customProblems,
    allPatterns,
    allTopics,
    incomingQueue,
    addProblem,
    addProblems,
    editProblem,
    deleteProblem,
    clearIncoming,
    dismissIncoming,
    importCustomProblems,
  } = useProblems();

  const { settings, updateSettings, resetSettings } = useSettings();

  const {
    progress,
    loaded,
    markSolved,
    updateRating,
    toggleRevision,
    unmark,
    exportData,
    importData,
  } = useProgress(settings);

  const { notesById, setNotesById, updateNote, flushNotesSave } = useNotes();
  const picker = useRandomPicker(progress, allProblems, allPatterns);
  const toast = useToast();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { streakData, recordActivity, todayActive, activeDates } = useStreaks(progress);
  const { permission: notifPermission, requestPermission, scheduleDailyReminder } = useNotifications();

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [notesModalId, setNotesModalId] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalProblem, setEditModalProblem] = useState<Problem | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem(ONBOARDING_KEY);
    } catch {
      return false;
    }
  });

  const toggleReveal = useCallback(
    (id: number) => setRevealed((r) => ({ ...r, [id]: !r[id] })),
    []
  );

  const isModalOpen = notesModalId !== null || addModalOpen || editModalProblem !== null || settingsOpen || showOnboarding;

  useKeyboardShortcuts({
    setTab,
    rollRandom: picker.rollRandomQuestion,
    isModalOpen,
  });

  // Record activity when user solves or completes revision
  const handleMarkSolved = useCallback(
    (id: number, rating?: import("./types").SolveRating) => {
      markSolved(id, rating);
      recordActivity();
    },
    [markSolved, recordActivity]
  );

  const handleToggleRevision = useCallback(
    (id: number, rIdx: number) => {
      toggleRevision(id, rIdx);
      recordActivity();
    },
    [toggleRevision, recordActivity]
  );

  // Schedule daily notification if enabled
  useEffect(() => {
    if (settings.notificationsEnabled && notifPermission === "granted") {
      const todayStr = today();
      const dueCount = allProblems.filter((p) => {
        const pg = progress[p.id];
        return pg && pg.revisions.some((r) => !r.done && r.date <= todayStr);
      }).length;
      const cleanup = scheduleDailyReminder(settings.notificationTime, dueCount);
      return cleanup;
    }
  }, [settings.notificationsEnabled, settings.notificationTime, notifPermission, allProblems, progress, scheduleDailyReminder]);

  const todayStr = today();
  const todayRevisions = allProblems.filter((p) => {
    const pg = progress[p.id];
    return pg && pg.revisions.some((r) => !r.done && r.date <= todayStr);
  });
  const upcomingRevisions = allProblems.flatMap((p) => {
    const pg = progress[p.id];
    if (!pg) return [];
    return pg.revisions
      .map((r, i) => ({ ...p, rIdx: i, revDate: r.date, done: r.done }))
      .filter((r) => !r.done && r.revDate > todayStr);
  });

  const solvedCount = Object.keys(progress).length;
  const totalRevsDone = Object.values(progress).reduce(
    (a, pg) => a + pg.revisions.filter((r) => r.done).length,
    0
  );
  const totalRevs = solvedCount * (settings.spacedDays?.length || SPACED_DAYS.length);

  const activeNotesProblem =
    notesModalId !== null
      ? (allProblems.find((p) => p.id === notesModalId) ?? null)
      : null;

  const tabCounts: Record<string, number> = {
    problems: allProblems.length,
    random: picker.pickPool.length,
    today: todayRevisions.length,
    upcoming: upcomingRevisions.length,
    stats: solvedCount,
  };

  const handleAddProblem = (data: { name: string; url: string; pattern: string; difficulty: string; source: SourceKey; topics: string[] }) => {
    addProblem(data);
  };

  const handleEditProblem = (data: { name: string; url: string; pattern: string; difficulty: string; source: SourceKey; topics: string[] }) => {
    if (editModalProblem) {
      editProblem(editModalProblem.id, data);
      setEditModalProblem(null);
    }
  };

  const handleIncomingAccept = (items: { name: string; url: string; pattern: string; difficulty: string; source: SourceKey; topics: string[] }[]) => {
    addProblems(items);
    clearIncoming();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch { /* ignore */ }
  };

  const TABS = [
    ["problems", "Problems", "📋"],
    ["random", "Random", "🎲"],
    ["today", "Today", "⚡"],
    ["upcoming", "Upcoming", "📅"],
    ["stats", "Stats", "📊"],
  ] as const;

  // Skeleton loading screen
  if (!loaded)
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-4 animate-pulse-soft">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-blue-600/30">
            🧠
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-32 rounded mx-auto" />
            <div className="skeleton h-2 w-24 rounded mx-auto" />
          </div>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen font-sans ${resolvedTheme === "light" ? "light" : ""}`} style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}>
      {/* Toast notifications */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Onboarding */}
      <OnboardingOverlay open={showOnboarding} onComplete={handleOnboardingComplete} />

      <Header
        progress={progress}
        todayCount={todayRevisions.length}
        solvedCount={solvedCount}
        totalProblems={allProblems.length}
        totalRevsDone={totalRevsDone}
        totalRevs={totalRevs}
        notesById={notesById}
        customProblems={customProblems}
        onExport={exportData}
        onImport={importData}
        setNotesById={setNotesById}
        importCustomProblems={importCustomProblems}
        onAddProblem={() => setAddModalOpen(true)}
        currentStreak={streakData.currentStreak}
        longestStreak={streakData.longestStreak}
        todayActive={todayActive}
        theme={resolvedTheme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setSettingsOpen(true)}
        onToastSuccess={toast.success}
        onToastError={toast.error}
      />

      {/* Desktop Tabs */}
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 sm:pt-5 pb-2 hidden md:flex items-center gap-2 overflow-x-auto"
        aria-label="Main navigation"
      >
        {TABS.map(([key, label, icon], i) => {
          const count = tabCounts[key] ?? 0;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`tab-btn flex items-center gap-1.5 shrink-0 ${tab === key ? "tab-btn-active" : "tab-btn-inactive"}`}
              aria-current={tab === key ? "page" : undefined}
              aria-label={`${label} tab (${count} items). Shortcut: ${i + 1}`}
            >
              <span aria-hidden="true">{icon}</span> {label}
              <span
                className={`ml-1 text-[11px] font-bold tabular-nums rounded-full px-2 py-0.5 ${tab === key ? "bg-white/20 text-white" : ""}`}
                style={tab !== key ? { background: "var(--color-surface-elevated)", color: "var(--color-text-secondary)" } : undefined}
                aria-hidden="true"
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav md:hidden" aria-label="Mobile navigation">
        {TABS.map(([key, label, icon]) => {
          const count = tabCounts[key] ?? 0;
          const isActive = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`bottom-nav-item ${isActive ? "bottom-nav-item-active" : "bottom-nav-item-inactive"}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
              {count > 0 && key !== "problems" && key !== "stats" && (
                <span className={`absolute -top-0.5 -right-0.5 text-[8px] font-bold rounded-full px-1 min-w-[14px] text-center ${
                  isActive ? "bg-blue-500 text-white" : "bg-surface-600 text-surface-300"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 animate-fade-in pb-20 md:pb-5"
      >
        {tab === "problems" && (
          <ProblemsTab
            problems={allProblems}
            allPatterns={allPatterns}
            allTopics={allTopics}
            progress={progress}
            notesById={notesById}
            revealed={revealed}
            onMarkSolved={handleMarkSolved}
            onToggleRevision={handleToggleRevision}
            onUnmark={unmark}
            onToggleReveal={toggleReveal}
            onOpenNotes={setNotesModalId}
            onUpdateRating={updateRating}
            onEditProblem={setEditModalProblem}
            onDeleteProblem={deleteProblem}
          />
        )}
        {tab === "random" && (
          <RandomPickerTab
            allProblems={allProblems}
            allPatterns={allPatterns}
            progress={progress}
            randomPick={picker.randomPick}
            pickHistory={picker.pickHistory}
            pickScope={picker.pickScope}
            pickPattern={picker.pickPattern}
            pickDiff={picker.pickDiff}
            isRolling={picker.isRolling}
            pickRevealed={picker.pickRevealed}
            pickPool={picker.pickPool}
            setPickScope={picker.setPickScope}
            setPickPattern={picker.setPickPattern}
            setPickDiff={picker.setPickDiff}
            setPickRevealed={picker.setPickRevealed}
            setPickHistory={picker.setPickHistory}
            rollRandomQuestion={picker.rollRandomQuestion}
            onMarkSolved={handleMarkSolved}
          />
        )}
        {tab === "today" && (
          <TodayTab
            problems={allProblems}
            progress={progress}
            onToggleRevision={handleToggleRevision}
          />
        )}
        {tab === "upcoming" && (
          <UpcomingTab
            problems={allProblems}
            progress={progress}
            revealed={revealed}
            onToggleReveal={toggleReveal}
          />
        )}
        {tab === "stats" && (
          <StatsTab
            problems={allProblems}
            progress={progress}
            activeDates={activeDates}
          />
        )}
      </main>

      {/* Notes Modal */}
      <NotesModal
        problem={activeNotesProblem}
        noteValue={notesModalId !== null ? (notesById[notesModalId] ?? "") : ""}
        onUpdate={updateNote}
        onFlush={flushNotesSave}
        onClose={() => setNotesModalId(null)}
      />

      {/* Add Problem Modal */}
      <AddProblemModal
        open={addModalOpen}
        existingPatterns={allPatterns}
        existingTopics={allTopics}
        onSave={handleAddProblem}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Edit Problem Modal */}
      <AddProblemModal
        open={editModalProblem !== null}
        editProblem={editModalProblem}
        existingPatterns={allPatterns}
        existingTopics={allTopics}
        onSave={handleEditProblem}
        onClose={() => setEditModalProblem(null)}
      />

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onUpdate={updateSettings}
        onReset={resetSettings}
        onClose={() => setSettingsOpen(false)}
        notificationPermission={notifPermission}
        onRequestNotifications={requestPermission}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Incoming from Extension */}
      <IncomingProblemsToast
        queue={incomingQueue}
        existingPatterns={allPatterns}
        existingTopics={allTopics}
        onAccept={handleIncomingAccept}
        onDismissOne={dismissIncoming}
        onDismissAll={clearIncoming}
      />

      {/* Footer - hidden on mobile (bottom nav takes its place) */}
      <footer className="mt-8 sm:mt-12 pb-6 text-center text-[10px] sm:text-[11px] hidden md:block" style={{ color: "var(--color-text-muted)" }}>
        Built for interview prep · Spaced repetition in{" "}
        {settings.spacedDays.join(", ")} day intervals ·{" "}
        <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "var(--color-surface)", color: "var(--color-text-muted)" }}>
          1-5
        </kbd>{" "}
        switch tabs ·{" "}
        <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "var(--color-surface)", color: "var(--color-text-muted)" }}>
          R
        </kbd>{" "}
        random pick
      </footer>
    </div>
  );
}
