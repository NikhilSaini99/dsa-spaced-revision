import { useState, useEffect, useCallback } from "react";
import type { ProblemProgress, SolveRating, ExportData, UserSettings } from "../types";
import { PROGRESS_STORAGE_KEY, NOTES_STORAGE_KEY, SPACED_DAYS, DEFAULT_SETTINGS } from "../config";
import { addDays, today } from "../utils";

/**
 * Compute adaptive revision intervals based on the solve rating.
 * - "easy"      → multiply base intervals by 1.5 (space them out more)
 * - "got-it"    → use base intervals unchanged
 * - "struggled" → multiply by 0.7 (min 1 day each)
 * - "redo"      → prepend an extra day-1 revision, then use 0.7× shortened intervals
 */
function adaptiveIntervals(
  baseDays: number[],
  rating?: SolveRating
): number[] {
  if (!rating || rating === "got-it") return baseDays;

  if (rating === "easy") {
    return baseDays.map((d) => Math.round(d * 1.5));
  }

  if (rating === "struggled") {
    return baseDays.map((d) => Math.max(1, Math.round(d * 0.7)));
  }

  // "redo" – extra revision at day 1, then shortened intervals
  const shortened = baseDays.map((d) => Math.max(1, Math.round(d * 0.7)));
  return [1, ...shortened];
}

export function useProgress(settings?: UserSettings) {
  const [progress, setProgress] = useState<Record<number, ProblemProgress>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
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
      const baseDays = settings?.spacedDays ?? SPACED_DAYS;
      const intervals = adaptiveIntervals(baseDays, rating);
      const next = {
        ...prev,
        [id]: {
          solvedDate: td,
          revisions: intervals.map((d) => ({ date: addDays(td, d), done: false })),
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
  }, [settings?.spacedDays]);

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
      const wasDone = revs[rIdx].done;
      revs[rIdx] = {
        ...revs[rIdx],
        done: !wasDone,
        completedDate: !wasDone ? today() : undefined,
      };
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
      version: 2,
      exportedAt: new Date().toISOString(),
      progress,
      notes: notesById,
    }),
    [progress]
  );

  const importData = useCallback(
    (data: ExportData, setNotesById: (n: Record<number, string>) => void) => {
      // Accept both version 1 and version 2 exports
      save(data.progress);
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
