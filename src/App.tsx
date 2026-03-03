import { useState, useCallback } from "react";
import { SPACED_DAYS } from "./config";
import { today } from "./utils";
import { useHashTab } from "./hooks/useHashTab";
import { useProgress } from "./hooks/useProgress";
import { useNotes } from "./hooks/useNotes";
import { useRandomPicker } from "./hooks/useRandomPicker";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useProblems } from "./hooks/useProblems";
import { Header } from "./components/Header";
import { ProblemsTab } from "./components/ProblemsTab";
import { RandomPickerTab } from "./components/RandomPickerTab";
import { TodayTab } from "./components/TodayTab";
import { UpcomingTab } from "./components/UpcomingTab";
import { NotesModal } from "./components/NotesModal";
import { AddProblemModal } from "./components/AddProblemModal";
import { IncomingProblemsToast } from "./components/IncomingProblemsToast";
import type { Problem, SourceKey } from "./types";

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
  const {
    progress,
    loaded,
    markSolved,
    updateRating,
    toggleRevision,
    unmark,
    exportData,
    importData,
  } = useProgress();
  const { notesById, setNotesById, updateNote, flushNotesSave } = useNotes();
  const picker = useRandomPicker(progress, allProblems, allPatterns);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [notesModalId, setNotesModalId] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalProblem, setEditModalProblem] = useState<Problem | null>(null);

  const toggleReveal = useCallback(
    (id: number) => setRevealed((r) => ({ ...r, [id]: !r[id] })),
    []
  );

  const isModalOpen = notesModalId !== null || addModalOpen || editModalProblem !== null;

  useKeyboardShortcuts({
    setTab,
    rollRandom: picker.rollRandomQuestion,
    isModalOpen,
  });

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
  const totalRevs = solvedCount * SPACED_DAYS.length;

  const activeNotesProblem =
    notesModalId !== null
      ? (allProblems.find((p) => p.id === notesModalId) ?? null)
      : null;

  const tabCounts = {
    problems: allProblems.length,
    random: picker.pickPool.length,
    today: todayRevisions.length,
    upcoming: upcomingRevisions.length,
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

  if (!loaded)
    return (
      <div className="flex h-screen items-center justify-center bg-surface-950 text-surface-400">
        <div className="flex flex-col items-center gap-3 animate-pulse-soft">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Loading tracker…</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-surface-950 text-surface-200 font-sans">
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
      />

      {/* Tabs */}
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 sm:pt-5 pb-2 flex items-center gap-2 overflow-x-auto"
        aria-label="Main navigation"
      >
        {(
          [
            ["problems", "Problems", "📋"],
            ["random", "Random", "🎲"],
            ["today", "Today", "⚡"],
            ["upcoming", "Upcoming", "📅"],
          ] as const
        ).map(([key, label, icon], i) => {
          const count = tabCounts[key];
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
                className={`ml-1 text-[11px] font-bold rounded-full px-2 py-0.5 ${tab === key ? "bg-white/20 text-white" : "bg-surface-700 text-surface-400"}`}
                aria-hidden="true"
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5 animate-fade-in"
      >
        {tab === "problems" && (
          <ProblemsTab
            problems={allProblems}
            allPatterns={allPatterns}
            allTopics={allTopics}
            progress={progress}
            notesById={notesById}
            revealed={revealed}
            onMarkSolved={markSolved}
            onToggleRevision={toggleRevision}
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
            onMarkSolved={markSolved}
          />
        )}
        {tab === "today" && (
          <TodayTab
            problems={allProblems}
            progress={progress}
            onToggleRevision={toggleRevision}
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

      {/* Incoming from Extension */}
      <IncomingProblemsToast
        queue={incomingQueue}
        existingPatterns={allPatterns}
        existingTopics={allTopics}
        onAccept={handleIncomingAccept}
        onDismissOne={dismissIncoming}
        onDismissAll={clearIncoming}
      />

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 pb-6 text-center text-[10px] sm:text-[11px] text-surface-600">
        Built for interview prep · Spaced repetition in{" "}
        {SPACED_DAYS.join(", ")} day intervals ·{" "}
        <kbd className="px-1.5 py-0.5 bg-surface-800 rounded text-surface-500 text-[9px]">
          1-4
        </kbd>{" "}
        switch tabs ·{" "}
        <kbd className="px-1.5 py-0.5 bg-surface-800 rounded text-surface-500 text-[9px]">
          R
        </kbd>{" "}
        random pick
      </footer>
    </div>
  );
}
