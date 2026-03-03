import { useState, useEffect, useCallback, useMemo } from "react";
import type { Problem, IncomingProblem, SourceKey } from "../types";
import {
  BUILTIN_PROBLEMS,
  BUILTIN_PATTERNS,
  BUILTIN_TOPICS,
  CUSTOM_PROBLEMS_STORAGE_KEY,
  CUSTOM_ID_START,
} from "../config";

export function useProblems() {
  const [customProblems, setCustomProblems] = useState<Problem[]>([]);
  const [incomingQueue, setIncomingQueue] = useState<IncomingProblem[]>([]);

  // ── Load custom problems from localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_PROBLEMS_STORAGE_KEY);
      if (stored) setCustomProblems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  // ── Listen for extension bridge events ──
  useEffect(() => {
    function handleIncoming(e: Event) {
      const detail = (e as CustomEvent<IncomingProblem[]>).detail;
      if (Array.isArray(detail) && detail.length > 0) {
        setIncomingQueue((q) => {
          // Deduplicate by URL
          const urls = new Set(q.map((p) => p.url));
          const newItems = detail.filter((p) => !urls.has(p.url));
          return [...q, ...newItems];
        });
      }
    }
    window.addEventListener("dsa-tracker-add", handleIncoming);
    return () => window.removeEventListener("dsa-tracker-add", handleIncoming);
  }, []);

  // ── Persist helper ──
  const saveCustom = useCallback((next: Problem[]) => {
    setCustomProblems(next);
    try {
      localStorage.setItem(CUSTOM_PROBLEMS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  // ── Merged problem list: built-in + custom ──
  const allProblems = useMemo(
    () => [...BUILTIN_PROBLEMS, ...customProblems],
    [customProblems]
  );

  // ── Next available custom ID ──
  const nextId = useCallback((): number => {
    if (customProblems.length === 0) return CUSTOM_ID_START;
    return Math.max(...customProblems.map((p) => p.id)) + 1;
  }, [customProblems]);

  // ── Derived patterns (built-in + any new ones from custom problems) ──
  const allPatterns = useMemo(() => {
    const set = new Set(BUILTIN_PATTERNS);
    customProblems.forEach((p) => set.add(p.pattern));
    return ["All", ...Array.from(set)];
  }, [customProblems]);

  // ── Derived topics (built-in + any new ones from custom problems) ──
  const allTopics = useMemo(() => {
    const set = new Set<string>(BUILTIN_TOPICS);
    allProblems.forEach((p) => p.topics.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [allProblems]);

  // ── CRUD ──
  const addProblem = useCallback(
    (data: { name: string; url: string; pattern: string; difficulty: string; source: SourceKey; topics: string[]; companies?: string[] }): Problem => {
      const problem: Problem = {
        id: nextId(),
        name: data.name,
        url: data.url,
        pattern: data.pattern,
        difficulty: data.difficulty,
        source: data.source,
        topics: data.topics ?? [],
        companies: data.companies ?? [],
        builtIn: false,
      };
      saveCustom([...customProblems, problem]);
      return problem;
    },
    [customProblems, nextId, saveCustom]
  );

  const addProblems = useCallback(
    (items: { name: string; url: string; pattern: string; difficulty: string; source: SourceKey; topics: string[]; companies?: string[] }[]): Problem[] => {
      let id = nextId();
      const existingUrls = new Set(allProblems.map((p) => p.url));
      const newProblems: Problem[] = [];
      for (const data of items) {
        if (existingUrls.has(data.url)) continue; // deduplicate
        newProblems.push({
          id: id++,
          name: data.name,
          url: data.url,
          pattern: data.pattern,
          difficulty: data.difficulty,
          source: data.source,
          topics: data.topics ?? [],
          companies: data.companies ?? [],
          builtIn: false,
        });
        existingUrls.add(data.url);
      }
      if (newProblems.length > 0) {
        saveCustom([...customProblems, ...newProblems]);
      }
      return newProblems;
    },
    [allProblems, customProblems, nextId, saveCustom]
  );

  const editProblem = useCallback(
    (id: number, data: Partial<Pick<Problem, "name" | "url" | "pattern" | "difficulty" | "source" | "topics">>) => {
      saveCustom(
        customProblems.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    },
    [customProblems, saveCustom]
  );

  const deleteProblem = useCallback(
    (id: number) => {
      saveCustom(customProblems.filter((p) => p.id !== id));
    },
    [customProblems, saveCustom]
  );

  // ── Incoming queue management ──
  const clearIncoming = useCallback(() => setIncomingQueue([]), []);
  const dismissIncoming = useCallback(
    (url: string) => setIncomingQueue((q) => q.filter((p) => p.url !== url)),
    []
  );

  // ── Import custom problems from backup ──
  const importCustomProblems = useCallback(
    (imported: Problem[]) => {
      const existingUrls = new Set(allProblems.map((p) => p.url));
      let id = nextId();
      const fresh: Problem[] = [];
      for (const p of imported) {
        if (existingUrls.has(p.url)) continue;
        fresh.push({ ...p, id: id++, builtIn: false });
        existingUrls.add(p.url);
      }
      if (fresh.length > 0) {
        saveCustom([...customProblems, ...fresh]);
      }
      return fresh.length;
    },
    [allProblems, customProblems, nextId, saveCustom]
  );

  return {
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
  };
}
