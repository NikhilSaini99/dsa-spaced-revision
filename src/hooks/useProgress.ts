import { useState, useEffect, useCallback } from "react";
import type { ProblemProgress, SolveRating, ExportData } from "../types";
import { PROGRESS_STORAGE_KEY, NOTES_STORAGE_KEY, SPACED_DAYS } from "../config";
import { addDays, today } from "../utils";

export function useProgress() {
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
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
      notes: notesById,
    }),
    [progress]
  );

  const importData = useCallback(
    (data: ExportData, setNotesById: (n: Record<number, string>) => void) => {
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
