import { useState, useEffect, useCallback, useRef } from "react";
import { NOTES_STORAGE_KEY } from "../config";

export function useNotes() {
  const [notesById, setNotesById] = useState<Record<number, string>>({});
  const notesSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notesRef = useRef<Record<number, string>>({});

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsed = JSON.parse(storedNotes) as Record<number, string>;
        setNotesById(parsed);
        notesRef.current = parsed;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistNotes = useCallback((next: Record<number, string>) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const flushNotesSave = useCallback(
    (next?: Record<number, string>) => {
      if (notesSaveTimeoutRef.current) {
        clearTimeout(notesSaveTimeoutRef.current);
        notesSaveTimeoutRef.current = null;
      }
      const payload = next ?? notesRef.current;
      persistNotes(payload);
    },
    [persistNotes]
  );

  const scheduleNotesSave = useCallback(
    (next: Record<number, string>) => {
      notesRef.current = next;
      if (notesSaveTimeoutRef.current) clearTimeout(notesSaveTimeoutRef.current);
      notesSaveTimeoutRef.current = setTimeout(() => {
        persistNotes(notesRef.current);
        notesSaveTimeoutRef.current = null;
      }, 450);
    },
    [persistNotes]
  );

  const updateNote = useCallback(
    (id: number, value: string) => {
      setNotesById((prev) => {
        const next = { ...prev };
        if (value.trim()) next[id] = value;
        else delete next[id];
        scheduleNotesSave(next);
        return next;
      });
    },
    [scheduleNotesSave]
  );

  useEffect(() => {
    function handlePageHide() {
      flushNotesSave();
    }
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      flushNotesSave();
    };
  }, [flushNotesSave]);

  return { notesById, setNotesById, updateNote, flushNotesSave };
}
