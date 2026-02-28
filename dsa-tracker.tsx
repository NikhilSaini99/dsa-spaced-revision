import { useState, useEffect, useRef, useCallback } from "react";
import {
  PROBLEMS,
  SPACED_DAYS,
  PATTERNS,
  DIFFICULTIES,
  DIFF_COLOR,
  DIFF_BG,
  PATTERN_COLORS,
} from "./src/config";

/* ── helpers ─────────────────────────────────────────────── */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function today(): string {
  return new Date().toISOString().split("T")[0];
}
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function daysFromNow(dateStr: string): string {
  const diff = Math.ceil(
    (new Date(dateStr + "T00:00:00").getTime() -
      new Date(today() + "T00:00:00").getTime()) /
      86400000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff}d`;
}

/* ── types ───────────────────────────────────────────────── */
interface Revision { date: string; done: boolean }
interface ProblemProgress { solvedDate: string; revisions: Revision[] }

const PROGRESS_STORAGE_KEY = "dsa-progress";
const NOTES_STORAGE_KEY = "dsa-notes";

/* ── tiny reusable bits ──────────────────────────────────── */
function ProgressRing({ pct, size = 44, stroke = 4, color }: { pct: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-surface-700/40" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - circ * Math.min(pct, 1)} strokeLinecap="round"
        className="transition-all duration-700 ease-out" />
    </svg>
  );
}

/* ── main app ────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("problems");
  const [progress, setProgress] = useState<Record<number, ProblemProgress>>({});
  const [notesById, setNotesById] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [filterPattern, setFilterPattern] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [loaded, setLoaded] = useState(false);
  const [popoverId, setPopoverId] = useState<number | null>(null);
  const [notesModalId, setNotesModalId] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  /* ── random picker state ── */
  const [randomPick, setRandomPick] = useState<typeof PROBLEMS[0] | null>(null);
  const [pickHistory, setPickHistory] = useState<typeof PROBLEMS>([]);
  const [pickScope, setPickScope] = useState<"all" | "unsolved" | "solved">("unsolved");
  const [pickPattern, setPickPattern] = useState("All");
  const [pickDiff, setPickDiff] = useState("All");
  const [isRolling, setIsRolling] = useState(false);
  const [pickRevealed, setPickRevealed] = useState(false);
  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notesSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notesRef = useRef<Record<number, string>>({});

  /* close popover on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setPopoverId(null);
    }
    if (popoverId !== null) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [popoverId]);

  /* load from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch (_) {}
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsed = JSON.parse(storedNotes) as Record<number, string>;
        setNotesById(parsed);
        notesRef.current = parsed;
      }
    } catch (_) {}
    setLoaded(true);
  }, []);

  function save(next: Record<number, ProblemProgress>) {
    setProgress(next);
    try { localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
  }
  const persistNotes = useCallback((next: Record<number, string>) => {
    try { localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
  }, []);
  const flushNotesSave = useCallback((next?: Record<number, string>) => {
    if (notesSaveTimeoutRef.current) {
      clearTimeout(notesSaveTimeoutRef.current);
      notesSaveTimeoutRef.current = null;
    }
    const payload = next ?? notesRef.current;
    persistNotes(payload);
  }, [persistNotes]);
  const scheduleNotesSave = useCallback((next: Record<number, string>) => {
    notesRef.current = next;
    if (notesSaveTimeoutRef.current) clearTimeout(notesSaveTimeoutRef.current);
    notesSaveTimeoutRef.current = setTimeout(() => {
      persistNotes(notesRef.current);
      notesSaveTimeoutRef.current = null;
    }, 450);
  }, [persistNotes]);
  function updateNote(id: number, value: string) {
    setNotesById(prev => {
      const next = { ...prev };
      if (value.trim()) next[id] = value;
      else delete next[id];
      scheduleNotesSave(next);
      return next;
    });
  }
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
  useEffect(() => {
    if (notesModalId === null) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setNotesModalId(null);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [notesModalId]);
  function markSolved(id: number) {
    if (progress[id]?.solvedDate) return;
    const td = today();
    save({ ...progress, [id]: { solvedDate: td, revisions: SPACED_DAYS.map(d => ({ date: addDays(td, d), done: false })) } });
  }
  function toggleRevision(id: number, rIdx: number) {
    const p = { ...progress };
    const revs = [...p[id].revisions];
    revs[rIdx] = { ...revs[rIdx], done: !revs[rIdx].done };
    p[id] = { ...p[id], revisions: revs };
    save(p);
  }
  function unmark(id: number) {
    const p = { ...progress };
    delete p[id];
    save(p);
  }
  function toggleReveal(id: number) { setRevealed(r => ({ ...r, [id]: !r[id] })); }

  /* ── random picker logic ── */
  const pickPool = PROBLEMS.filter(p => {
    if (pickScope === "unsolved" && progress[p.id]) return false;
    if (pickScope === "solved" && !progress[p.id]) return false;
    if (pickPattern !== "All" && p.pattern !== pickPattern) return false;
    if (pickDiff !== "All" && p.difficulty !== pickDiff) return false;
    return true;
  });

  const rollRandomQuestion = useCallback(() => {
    if (pickPool.length === 0) return;
    setPickRevealed(false);
    setIsRolling(true);
    let ticks = 0;
    const maxTicks = 12;
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    rollIntervalRef.current = setInterval(() => {
      const rand = pickPool[Math.floor(Math.random() * pickPool.length)];
      setRandomPick(rand);
      ticks++;
      if (ticks >= maxTicks) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
        setIsRolling(false);
        setPickHistory(h => [rand, ...h.filter(x => x.id !== rand.id)].slice(0, 10));
      }
    }, 80 + ticks * 15);
  }, [pickPool]);

  useEffect(() => {
    return () => { if (rollIntervalRef.current) clearInterval(rollIntervalRef.current); };
  }, []);

  const todayStr = today();
  const todayRevisions = PROBLEMS.filter(p => {
    const pg = progress[p.id];
    return pg && pg.revisions.some(r => !r.done && r.date <= todayStr);
  });
  const upcomingRevisions = PROBLEMS.flatMap(p => {
    const pg = progress[p.id];
    if (!pg) return [];
    return pg.revisions
      .map((r, i) => ({ ...p, rIdx: i, revDate: r.date, done: r.done }))
      .filter(r => !r.done && r.revDate > todayStr);
  }).sort((a, b) => a.revDate.localeCompare(b.revDate));

  const solvedCount = Object.keys(progress).length;
  const totalRevsDone = Object.values(progress).reduce(
    (a, pg) => a + pg.revisions.filter(r => r.done).length, 0
  );
  const totalRevs = solvedCount * SPACED_DAYS.length;
  const filtered = PROBLEMS.filter(
    p =>
      (filterPattern === "All" || p.pattern === filterPattern) &&
      (filterDiff === "All" || p.difficulty === filterDiff)
  );
  const activeNotesProblem = notesModalId !== null ? PROBLEMS.find(p => p.id === notesModalId) ?? null : null;

  if (!loaded)
    return (
      <div className="flex h-screen items-center justify-center bg-surface-950 text-surface-400">
        <div className="flex flex-col items-center gap-3 animate-pulse-soft">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Loading tracker…</span>
        </div>
      </div>
    );

  /* ── render ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-surface-950 text-surface-200 font-sans">
      {/* ──────── HEADER ──────── */}
      <header className="relative overflow-hidden border-b border-surface-700/50">
        {/* gradient glow behind header */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* brand */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg shadow-lg shadow-blue-600/30">🧠</span>
              DSA Revision Tracker
            </h1>
            <p className="mt-1 text-xs text-surface-500">Spaced Repetition · Pattern Blind · Interview Ready</p>
          </div>

          {/* stat cards */}
          <div className="flex gap-4 flex-wrap">
            {[
              { label: "Solved", val: solvedCount, total: PROBLEMS.length, color: "#4ade80", ring: "text-emerald-400" },
              { label: "Revisions", val: totalRevsDone, total: totalRevs, color: "#818cf8", ring: "text-indigo-400" },
              { label: "Due Today", val: todayRevisions.length, total: undefined, color: "#f87171", ring: "text-red-400" },
            ].map(s => (
              <div key={s.label} className="glass-card px-5 py-3 flex items-center gap-3 min-w-[160px]">
                <div className="relative flex items-center justify-center">
                  <ProgressRing pct={s.total ? s.val / (s.total || 1) : s.val > 0 ? 1 : 0} color={s.color} />
                  <span className="absolute text-xs font-bold" style={{ color: s.color }}>
                    {s.val}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-surface-500 font-semibold">{s.label}</div>
                  {s.total !== undefined && (
                    <div className="text-sm font-bold text-surface-300">
                      {s.val}<span className="text-surface-600">/{s.total}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ──────── TABS ──────── */}
      <nav className="mx-auto max-w-7xl px-6 pt-5 pb-2 flex items-center gap-2">
        {([
          ["problems", "Problems", "📋"],
          ["random", "Random", "🎲"],
          ["today", "Today", "⚡"],
          ["upcoming", "Upcoming", "📅"],
        ] as const).map(([key, label, icon]) => {
          const count = key === "today" ? todayRevisions.length : key === "upcoming" ? upcomingRevisions.length : key === "random" ? pickPool.length : filtered.length;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`tab-btn flex items-center gap-1.5 ${tab === key ? "tab-btn-active" : "tab-btn-inactive"}`}
            >
              <span>{icon}</span> {label}
              <span className={`ml-1 text-[11px] font-bold rounded-full px-2 py-0.5 ${
                tab === key ? "bg-white/20 text-white" : "bg-surface-700 text-surface-400"
              }`}>{count}</span>
            </button>
          );
        })}
      </nav>

      {/* ──────── CONTENT ──────── */}
      <main className="mx-auto max-w-7xl px-6 py-5 animate-fade-in">
        {/* ═══ PROBLEMS TAB ═══ */}
        {tab === "problems" && (
          <div className="space-y-5">
            {/* filters */}
            <div className="glass-card p-4 flex flex-col gap-4">
              {/* pattern row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">Pattern</span>
                {PATTERNS.map(p => {
                  const active = filterPattern === p;
                  const c = PATTERN_COLORS[p] || "#3b82f6";
                  return (
                    <button
                      key={p}
                      onClick={() => setFilterPattern(p)}
                      className={`pill ${active ? "pill-active" : ""}`}
                      style={{
                        borderColor: active ? c : undefined,
                        background: active ? c + "18" : undefined,
                        color: active ? c : undefined,
                        ...(active ? { boxShadow: `0 0 12px ${c}25` } : {}),
                        ...(!active ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" } : {}),
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              {/* difficulty row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500 mr-1">Difficulty</span>
                {DIFFICULTIES.map(d => {
                  const active = filterDiff === d;
                  const c = DIFF_COLOR[d] || "#3b82f6";
                  const bg = DIFF_BG[d] || "#3b82f622";
                  return (
                    <button
                      key={d}
                      onClick={() => setFilterDiff(d)}
                      className={`pill ${active ? "pill-active" : ""}`}
                      style={{
                        borderColor: active ? c : undefined,
                        background: active ? bg : undefined,
                        color: active ? c : undefined,
                        ...(!active ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" } : {}),
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* pattern-blind notice */}
            <div className="glass-card-inner flex items-center gap-3 px-4 py-3 text-sm text-surface-400">
              <span className="text-xl">🙈</span>
              <span>
                Patterns are <strong className="text-surface-100">hidden by default</strong>. Try to identify the pattern yourself, then tap{" "}
                <strong className="text-indigo-400">Reveal</strong> to verify.
              </span>
            </div>

            {/* table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-900/70">
                      {["#", "Problem", "Difficulty", "Pattern", "Status", "Spaced Repetition", "Notes", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-surface-500 whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-700/30">
                    {filtered.map((p, i) => {
                      const pg = progress[p.id];
                      const solved = !!pg;
                      return (
                        <tr key={p.id} className="table-row group">
                          {/* # */}
                          <td className="px-4 py-3 text-surface-500 text-xs tabular-nums">{i + 1}</td>
                          {/* name */}
                          <td className="px-4 py-3">
                            <a href={p.url} target="_blank" rel="noreferrer"
                              className={`font-medium hover:underline decoration-1 underline-offset-2 ${solved ? "text-emerald-400" : "text-surface-100 group-hover:text-white"}`}>
                              {solved && <span className="mr-1">✓</span>}
                              {p.name}
                            </a>
                          </td>
                          {/* difficulty */}
                          <td className="px-4 py-3">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                              style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}>
                              {p.difficulty}
                            </span>
                          </td>
                          {/* pattern */}
                          <td className="px-4 py-3">
                            {revealed[p.id] ? (
                              <button onClick={() => toggleReveal(p.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors"
                                style={{ background: PATTERN_COLORS[p.pattern] + "1a", color: PATTERN_COLORS[p.pattern] }}>
                                {p.pattern} <span className="opacity-60">✕</span>
                              </button>
                            ) : (
                              <button onClick={() => toggleReveal(p.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer bg-surface-700/60 text-surface-400 hover:bg-surface-600/60 hover:text-surface-200 transition-colors">
                                👁 Reveal
                              </button>
                            )}
                          </td>
                          {/* status */}
                          <td className="px-4 py-3">
                            {solved ? (
                              <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {formatDate(pg.solvedDate)}
                              </span>
                            ) : (
                              <span className="text-surface-600 text-xs">Unsolved</span>
                            )}
                          </td>
                          {/* spaced repetition */}
                          <td className="px-4 py-3 relative">
                            {solved ? (
                              <div className="relative">
                                <div className="flex items-center gap-1.5">
                                  {pg.revisions.map((r: Revision, idx: number) => {
                                    const overdue = !r.done && r.date <= todayStr;
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => toggleRevision(p.id, idx)}
                                        title={`Rev ${idx + 1}: ${formatDate(r.date)} — ${r.done ? "Done" : overdue ? "Overdue!" : daysFromNow(r.date)}`}
                                        className={`revision-dot ${
                                          r.done
                                            ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30 hover:border-emerald-400/60"
                                            : overdue
                                            ? "bg-red-900/50 text-red-400 border-red-500/30 hover:border-red-400/60 animate-pulse-soft"
                                            : "bg-blue-900/40 text-blue-400 border-blue-500/25 hover:border-blue-400/60"
                                        }`}
                                      >
                                        <span className="text-[10px] leading-none">{r.done ? "✓" : `R${idx + 1}`}</span>
                                        <span className="text-[7px] opacity-60 leading-none">
                                          {formatDate(r.date).replace(" ", "/")}
                                        </span>
                                      </button>
                                    );
                                  })}
                                  {/* info button */}
                                  <button
                                    onClick={() => setPopoverId(popoverId === p.id ? null : p.id)}
                                    className="w-7 h-7 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-600/80 hover:text-surface-200 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                  >
                                    ℹ
                                  </button>
                                </div>

                                {/* popover */}
                                {popoverId === p.id && (
                                  <div
                                    ref={popoverRef}
                                    className="absolute top-11 left-0 z-50 glass-card p-4 min-w-[280px] animate-slide-up"
                                  >
                                    <div className="font-bold text-sm text-white mb-1">Revision Schedule</div>
                                    <p className="text-xs text-surface-500 mb-3">
                                      Solved on {formatDate(pg.solvedDate)} ·{" "}
                                      {pg.revisions.filter((r: Revision) => r.done).length}/{pg.revisions.length} done
                                    </p>
                                    <div className="space-y-1.5">
                                      {pg.revisions.map((r: Revision, idx: number) => {
                                        const overdue = !r.done && r.date <= todayStr;
                                        return (
                                          <div
                                            key={idx}
                                            className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                                              r.done
                                                ? "bg-emerald-900/20"
                                                : overdue
                                                ? "bg-red-900/20"
                                                : "bg-blue-900/15"
                                            }`}
                                          >
                                            <div>
                                              <div className={`text-xs font-semibold ${r.done ? "text-emerald-400" : overdue ? "text-red-400" : "text-blue-400"}`}>
                                                Rev {idx + 1} — Day +{SPACED_DAYS[idx]}
                                              </div>
                                              <div className="text-[11px] text-surface-500">
                                                {formatDate(r.date)} · {r.done ? "Completed" : overdue ? "Overdue!" : daysFromNow(r.date)}
                                              </div>
                                            </div>
                                            <button
                                              onClick={() => toggleRevision(p.id, idx)}
                                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                                                r.done
                                                  ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-500/20"
                                                  : overdue
                                                  ? "bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-500/20"
                                                  : "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 border border-blue-500/20"
                                              }`}
                                            >
                                              {r.done ? "↩ Undo" : "✓ Done"}
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <button
                                      onClick={() => setPopoverId(null)}
                                      className="mt-3 w-full text-xs text-surface-500 hover:text-surface-300 border border-surface-700/50 rounded-lg py-1.5 cursor-pointer transition-colors"
                                    >
                                      Close
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-surface-700 text-xs">—</span>
                            )}
                          </td>
                          {/* notes */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setNotesModalId(p.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-700/60 bg-surface-800/70 px-2.5 py-1.5 text-[11px] text-surface-300 hover:text-white hover:border-surface-600 hover:bg-surface-700/70 transition-colors cursor-pointer"
                              title={notesById[p.id] ? "Edit notes" : "Add notes"}
                            >
                              <span>📝</span>
                              <span>{notesById[p.id] ? "Edit" : "Add"}</span>
                            </button>
                          </td>
                          {/* actions */}
                          <td className="px-4 py-3">
                            {!solved ? (
                              <button onClick={() => markSolved(p.id)} className="btn-success text-[11px] px-3 py-1.5">
                                ✓ Solved
                              </button>
                            ) : (
                              <button onClick={() => unmark(p.id)} className="btn-ghost text-[11px] px-3 py-1.5">
                                ↩ Undo
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* bottom bar */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-700/30 bg-surface-900/40">
                <span className="text-xs text-surface-500">
                  Showing {filtered.length} of {PROBLEMS.length} problems
                </span>
                <span className="text-xs text-surface-500">
                  {solvedCount} solved · {PROBLEMS.length - solvedCount} remaining
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ RANDOM PICKER TAB ═══ */}
        {tab === "random" && (
          <div className="animate-fade-in space-y-6">
            {/* picker controls */}
            <div className="glass-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-end gap-5">
                {/* scope */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-lg">🎯</span> Pick Settings
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500">Scope</span>
                    {(["all", "unsolved", "solved"] as const).map(s => (
                      <button key={s} onClick={() => setPickScope(s)}
                        className={`pill ${pickScope === s ? "pill-active bg-blue-500/15 border-blue-400 text-blue-400" : ""}`}
                        style={pickScope !== s ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" } : {}}
                      >
                        {s === "all" ? "All" : s === "unsolved" ? "Unsolved" : "Solved"}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500">Pattern</span>
                    {PATTERNS.map(p => {
                      const active = pickPattern === p;
                      const c = PATTERN_COLORS[p] || "#3b82f6";
                      return (
                        <button key={p} onClick={() => setPickPattern(p)}
                          className={`pill ${active ? "pill-active" : ""}`}
                          style={{
                            borderColor: active ? c : undefined,
                            background: active ? c + "18" : undefined,
                            color: active ? c : undefined,
                            ...(active ? { boxShadow: `0 0 12px ${c}25` } : {}),
                            ...(!active ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" } : {}),
                          }}
                        >{p}</button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-surface-500">Difficulty</span>
                    {DIFFICULTIES.map(d => {
                      const active = pickDiff === d;
                      const c = DIFF_COLOR[d] || "#3b82f6";
                      const bg = DIFF_BG[d] || "#3b82f622";
                      return (
                        <button key={d} onClick={() => setPickDiff(d)}
                          className={`pill ${active ? "pill-active" : ""}`}
                          style={{
                            borderColor: active ? c : undefined,
                            background: active ? bg : undefined,
                            color: active ? c : undefined,
                            ...(!active ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" } : {}),
                          }}
                        >{d}</button>
                      );
                    })}
                  </div>
                </div>
                {/* pick button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={rollRandomQuestion}
                    disabled={pickPool.length === 0 || isRolling}
                    className="group relative px-8 py-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className={`text-xl ${isRolling ? "animate-spin" : "group-hover:animate-bounce"}`}>🎲</span>
                      {isRolling ? "Rolling…" : "Pick Random"}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <span className="text-[11px] text-surface-500">{pickPool.length} question{pickPool.length !== 1 ? "s" : ""} in pool</span>
                </div>
              </div>
            </div>

            {/* picked question */}
            {randomPick && (
              <div className={`glass-card p-6 transition-all duration-300 ${isRolling ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      {isRolling ? "Shuffling…" : "Your question"}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3">{randomPick.name}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: DIFF_BG[randomPick.difficulty], color: DIFF_COLOR[randomPick.difficulty] }}>
                        {randomPick.difficulty}
                      </span>
                      {pickRevealed ? (
                        <button onClick={() => setPickRevealed(false)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                          style={{ background: PATTERN_COLORS[randomPick.pattern] + "1a", color: PATTERN_COLORS[randomPick.pattern] }}>
                          {randomPick.pattern} <span className="opacity-60">✕</span>
                        </button>
                      ) : (
                        <button onClick={() => setPickRevealed(true)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer bg-surface-700/60 text-surface-400 hover:bg-surface-600/60 hover:text-surface-200 transition-colors">
                          👁 Reveal Pattern
                        </button>
                      )}
                      {progress[randomPick.id] ? (
                        <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" /> Solved
                        </span>
                      ) : (
                        <span className="text-surface-500 text-xs">Unsolved</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <a href={randomPick.url} target="_blank" rel="noreferrer"
                      className="btn-primary text-xs px-4 py-2 text-center no-underline">
                      Open on LeetCode ↗
                    </a>
                    {!progress[randomPick.id] && (
                      <button onClick={() => markSolved(randomPick.id)} className="btn-success text-xs px-4 py-2">
                        ✓ Mark Solved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* empty state */}
            {!randomPick && !isRolling && (
              <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-4">🎲</div>
                <h2 className="text-lg font-bold text-surface-300 mb-1">Ready to practice?</h2>
                <p className="text-sm text-surface-500 max-w-xs">
                  Set your filters and hit <strong className="text-indigo-400">Pick Random</strong> to get a question.
                </p>
              </div>
            )}

            {/* pick history */}
            {pickHistory.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-bold text-surface-300">Recent Picks</h3>
                  <div className="flex-1 h-px bg-surface-700/40" />
                  <button onClick={() => setPickHistory([])} className="text-[11px] text-surface-600 hover:text-surface-400 cursor-pointer transition-colors">
                    Clear
                  </button>
                </div>
                <div className="grid gap-2">
                  {pickHistory.map((p, i) => (
                    <div key={p.id}
                      className="glass-card-inner flex items-center gap-4 px-4 py-3 group hover:bg-surface-700/30 transition-colors">
                      <span className="text-surface-600 text-xs w-5 text-right tabular-nums">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}>
                            {p.difficulty}
                          </span>
                        </div>
                        <a href={p.url} target="_blank" rel="noreferrer"
                          className="text-sm font-medium text-surface-200 group-hover:text-white hover:underline decoration-1 underline-offset-2 transition-colors">
                          {p.name}
                        </a>
                      </div>
                      {progress[p.id] ? (
                        <span className="text-emerald-400 text-[11px] font-medium">Solved</span>
                      ) : (
                        <button onClick={() => markSolved(p.id)} className="btn-success text-[11px] px-2.5 py-1">
                          ✓ Solve
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TODAY TAB ═══ */}
        {tab === "today" && (
          <div className="animate-fade-in">
            {todayRevisions.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-lg font-bold text-surface-300 mb-1">All caught up!</h2>
                <p className="text-sm text-surface-500 max-w-xs">
                  No revisions due today. Keep solving problems to build your spaced-repetition schedule.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-white">
                    Due Today{" "}
                    <span className="ml-2 text-xs font-semibold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">
                      {todayRevisions.length} problem{todayRevisions.length > 1 ? "s" : ""}
                    </span>
                  </h2>
                </div>
                {todayRevisions.map(p => {
                  const pg = progress[p.id];
                  const dueRevs = pg.revisions.map((r, i) => ({ ...r, i })).filter(r => !r.done && r.date <= todayStr);
                  return (
                    <div key={p.id} className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}>
                            {p.difficulty}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ background: PATTERN_COLORS[p.pattern] + "1a", color: PATTERN_COLORS[p.pattern] }}>
                            {p.pattern}
                          </span>
                        </div>
                        <a href={p.url} target="_blank" rel="noreferrer"
                          className="text-base font-semibold text-white hover:text-blue-400 transition-colors hover:underline decoration-1 underline-offset-2">
                          {p.name}
                        </a>
                        <p className="text-xs text-surface-500 mt-1">Solved: {formatDate(pg.solvedDate)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dueRevs.map(r => (
                          <button key={r.i} onClick={() => toggleRevision(p.id, r.i)}
                            className="btn-danger text-xs px-4 py-2 flex items-center gap-1.5 hover:bg-red-600/40 active:scale-95 transition-all">
                            ✓ Rev {r.i + 1} Done
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ UPCOMING TAB ═══ */}
        {tab === "upcoming" && (
          <div className="animate-fade-in">
            {upcomingRevisions.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-lg font-bold text-surface-300 mb-1">No upcoming revisions</h2>
                <p className="text-sm text-surface-500 max-w-xs">
                  Start solving problems to build your revision schedule.
                </p>
              </div>
            ) : (
              (() => {
                const byDate: Record<string, typeof upcomingRevisions> = {};
                upcomingRevisions.forEach(r => { (byDate[r.revDate] ??= []).push(r); });
                return (
                  <div className="space-y-8">
                    {Object.entries(byDate).map(([date, items]) => (
                      <section key={date}>
                        {/* date header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-sm font-bold text-white">{formatDate(date)}</div>
                          <span className="text-xs text-surface-500 font-medium">{daysFromNow(date)}</span>
                          <div className="flex-1 h-px bg-surface-700/40" />
                          <span className="text-xs text-surface-600">
                            {items.length} problem{items.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        {/* cards */}
                        <div className="grid gap-2">
                          {items.map(p => (
                            <div key={`${p.id}-${p.rIdx}`}
                              className="glass-card-inner flex items-center gap-4 px-4 py-3 group hover:bg-surface-700/30 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                    style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}>
                                    {p.difficulty}
                                  </span>
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                    style={{ background: PATTERN_COLORS[p.pattern] + "1a", color: PATTERN_COLORS[p.pattern] }}>
                                    {p.pattern}
                                  </span>
                                  <span className="text-[10px] text-surface-600">Rev {p.rIdx + 1}</span>
                                </div>
                                <span className="text-sm font-medium text-surface-200 group-hover:text-white transition-colors">{p.name}</span>
                              </div>
                              <span className="text-xs font-semibold text-blue-400 whitespace-nowrap">{daysFromNow(p.revDate)}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        )}
      </main>

      {notesModalId !== null && activeNotesProblem && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setNotesModalId(null)}
        >
          <div
            className="glass-card w-full max-w-2xl p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-surface-500 font-semibold">Notes</div>
                <h3 className="text-base font-bold text-white leading-tight mt-1">{activeNotesProblem.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: DIFF_BG[activeNotesProblem.difficulty], color: DIFF_COLOR[activeNotesProblem.difficulty] }}>
                    {activeNotesProblem.difficulty}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: PATTERN_COLORS[activeNotesProblem.pattern] + "1a", color: PATTERN_COLORS[activeNotesProblem.pattern] }}>
                    {activeNotesProblem.pattern}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setNotesModalId(null)}
                className="h-8 w-8 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-600/80 hover:text-surface-200 transition-colors cursor-pointer"
                aria-label="Close notes modal"
              >
                ✕
              </button>
            </div>

            <textarea
              value={notesById[activeNotesProblem.id] ?? ""}
              onChange={e => updateNote(activeNotesProblem.id, e.target.value)}
              onBlur={() => flushNotesSave()}
              rows={10}
              maxLength={2000}
              placeholder="Write your approach, edge cases, dry run, and mistakes to avoid..."
              className="w-full rounded-xl border border-surface-700/60 bg-surface-900/70 px-3 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-surface-500">
                {(notesById[activeNotesProblem.id] ?? "").length}/2000
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateNote(activeNotesProblem.id, "");
                    flushNotesSave();
                  }}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    flushNotesSave();
                    setNotesModalId(null);
                  }}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* footer */}
      <footer className="mt-12 pb-6 text-center text-[11px] text-surface-600">
        Built for interview prep · Spaced repetition in {SPACED_DAYS.join(", ")} day intervals
      </footer>
    </div>
  );
}
