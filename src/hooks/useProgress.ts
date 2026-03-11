import { useState, useEffect, useCallback } from "react";
import type { ProblemProgress, SolveRating, ExportData } from "../types";
import { PROGRESS_STORAGE_KEY, NOTES_STORAGE_KEY, SPACED_DAYS, SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION } from "../config";
import { addDays, today } from "../utils";

/**
 * Migrate progress data from old schedule to new [3,7,14,30].
 * Recalculates all revision dates from solvedDate; preserves done status by index.
 */
function migrateProgress(
  data: Record<number, ProblemProgress>
): Record<number, ProblemProgress> {
  const migrated: Record<number, ProblemProgress> = {};
  for (const [idStr, entry] of Object.entries(data)) {
    const newRevisions = SPACED_DAYS.map((d, i) => ({
      date: addDays(entry.solvedDate, d),
      done: i < entry.revisions.length ? entry.revisions[i].done : false,
    }));
    migrated[Number(idStr)] = { ...entry, revisions: newRevisions };
  }
  return migrated;
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<number, ProblemProgress>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored) as Record<number, ProblemProgress>;
        const version = Number(localStorage.getItem(SCHEMA_VERSION_KEY) || "1");
        if (version < CURRENT_SCHEMA_VERSION) {
          parsed = migrateProgress(parsed);
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(parsed));
          localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
        }
        setProgress(parsed);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const save = useCallback((next: Record<number, ProblemProgress>) => {
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const markSolved = useCallback((id: number, rating?: SolveRating) => {
    setProgress((prev) => {
      if (prev[id]?.solvedDate) return prev;
      const td = today();
      const next = {
        ...prev,
        [id]: {
          solvedDate: td,
          revisions: SPACED_DAYS.map((d) => ({ date: addDays(td, d), done: false })),
          rating,
        },
      };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const updateRating = useCallback((id: number, rating: SolveRating) => {
    setProgress((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev, [id]: { ...prev[id], rating } };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const toggleRevision = useCallback((id: number, rIdx: number) => {
    setProgress((prev) => {
      const p = { ...prev };
      const revs = [...p[id].revisions];
      revs[rIdx] = { ...revs[rIdx], done: !revs[rIdx].done };
      p[id] = { ...p[id], revisions: revs };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(p));
      } catch {
        /* ignore */
      }
      return p;
    });
  }, []);

  const unmark = useCallback((id: number) => {
    setProgress((prev) => {
      const p = { ...prev };
      delete p[id];
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(p));
      } catch {
        /* ignore */
      }
      return p;
    });
  }, []);

  const exportData = useCallback(
    (notesById: Record<number, string>): ExportData => ({
      version: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      progress,
      notes: notesById,
    }),
    [progress]
  );

  const importData = useCallback(
    (data: ExportData, setNotesById: (n: Record<number, string>) => void) => {
      const imported = (data.version || 1) < CURRENT_SCHEMA_VERSION
        ? migrateProgress(data.progress)
        : data.progress;
      save(imported);
      localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
      setNotesById(data.notes || {});
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(data.notes || {}));
      } catch {
        /* ignore */
      }
    },
    [save]
  );

  return {
    progress,
    loaded,
    markSolved,
    updateRating,
    toggleRevision,
    unmark,
    save,
    exportData,
    importData,
  };
}
