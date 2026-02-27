import { useState, useEffect, useRef } from "react";
import {
  PROBLEMS,
  SPACED_DAYS,
  PATTERNS,
  DIFFICULTIES,
  DIFF_COLOR,
  DIFF_BG,
  PATTERN_COLORS,
} from "./src/config";

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
  const diff = Math.ceil((new Date(dateStr + "T00:00:00").getTime() - new Date(today() + "T00:00:00").getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff}d`;
}

interface Revision {
  date: string;
  done: boolean;
}

interface ProblemProgress {
  solvedDate: string;
  revisions: Revision[];
}

export default function App() {
  const [tab, setTab] = useState("problems");
  const [progress, setProgress] = useState<Record<number, ProblemProgress>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [filterPattern, setFilterPattern] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [loaded, setLoaded] = useState(false);
  const [popoverId, setPopoverId] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverId(null);
      }
    }
    if (popoverId !== null) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [popoverId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dsa-progress");
      if (stored) setProgress(JSON.parse(stored));
    } catch (_) {}
    setLoaded(true);
  }, []);

  function save(next: Record<number, ProblemProgress>) {
    setProgress(next);
    try { localStorage.setItem("dsa-progress", JSON.stringify(next)); } catch (_) {}
  }

  function markSolved(id: number) {
    const td = today();
    const existing = progress[id] || {};
    if (existing.solvedDate) return;
    const revisions = SPACED_DAYS.map(d => ({ date: addDays(td, d), done: false }));
    save({ ...progress, [id]: { solvedDate: td, revisions } });
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

  function toggleReveal(id: number) {
    setRevealed(r => ({ ...r, [id]: !r[id] }));
  }

  const todayStr = today();

  const todayRevisions = PROBLEMS.filter(p => {
    const pg = progress[p.id];
    if (!pg) return false;
    return pg.revisions.some((r, i) => !r.done && r.date <= todayStr);
  });

  const upcomingRevisions = PROBLEMS.flatMap(p => {
    const pg = progress[p.id];
    if (!pg) return [];
    return pg.revisions
      .map((r, i) => ({ ...p, rIdx: i, revDate: r.date, done: r.done }))
      .filter(r => !r.done && r.revDate > todayStr);
  }).sort((a, b) => a.revDate.localeCompare(b.revDate));

  const solvedCount = Object.keys(progress).length;
  const totalRevsDone = Object.values(progress).reduce((a: number, pg: ProblemProgress) => a + pg.revisions.filter((r: Revision) => r.done).length, 0);
  const totalRevs = solvedCount * SPACED_DAYS.length;

  const filtered = PROBLEMS.filter(p =>
    (filterPattern === "All" || p.pattern === filterPattern) &&
    (filterDiff === "All" || p.difficulty === filterDiff)
  );

  if (!loaded) return <div style={{ background: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Loading...</div>;

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
      {/* Header */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>🧠 DSA Revision Tracker</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Spaced Repetition · Pattern Blind · Interview Ready</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Solved", val: solvedCount, total: PROBLEMS.length, color: "#4ade80" },
            { label: "Revisions Done", val: totalRevsDone, total: totalRevs, color: "#818cf8" },
            { label: "Due Today", val: todayRevisions.length, color: "#f87171" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}{s.total !== undefined ? <span style={{ color: "#475569", fontSize: 13 }}>/{s.total}</span> : ""}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "12px 24px", borderBottom: "1px solid #1e293b" }}>
        {[["problems", "📋 Problems"], ["today", `⚡ Today (${todayRevisions.length})`], ["upcoming", "📅 Upcoming"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
            background: tab === t ? "#3b82f6" : "#1e293b", color: tab === t ? "#fff" : "#94a3b8", transition: "all .15s"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* PROBLEMS TAB */}
        {tab === "problems" && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>PATTERN</span>
              {PATTERNS.map(p => (
                <button key={p} onClick={() => setFilterPattern(p)} style={{
                  padding: "4px 12px", borderRadius: 20, border: "1px solid",
                  borderColor: filterPattern === p ? (PATTERN_COLORS[p] || "#3b82f6") : "#334155",
                  background: filterPattern === p ? (PATTERN_COLORS[p] ? PATTERN_COLORS[p] + "22" : "#3b82f622") : "transparent",
                  color: filterPattern === p ? (PATTERN_COLORS[p] || "#3b82f6") : "#94a3b8",
                  cursor: "pointer", fontSize: 12, fontWeight: 500
                }}>{p}</button>
              ))}
              <span style={{ color: "#64748b", fontSize: 12, fontWeight: 600, marginLeft: 8 }}>DIFFICULTY</span>
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setFilterDiff(d)} style={{
                  padding: "4px 12px", borderRadius: 20, border: "1px solid",
                  borderColor: filterDiff === d ? (DIFF_COLOR[d] || "#3b82f6") : "#334155",
                  background: filterDiff === d ? (DIFF_BG[d] || "#3b82f622") : "transparent",
                  color: filterDiff === d ? (DIFF_COLOR[d] || "#3b82f6") : "#94a3b8",
                  cursor: "pointer", fontSize: 12, fontWeight: 500
                }}>{d}</button>
              ))}
            </div>

            {/* Pattern blind notice */}
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span>🙈</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>Patterns are <strong style={{ color: "#f1f5f9" }}>hidden by default</strong>. Try to identify the pattern yourself first, then tap <strong style={{ color: "#818cf8" }}>Reveal</strong> to verify.</span>
            </div>

            {/* Table */}
            <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0f172a" }}>
                    {["#", "Problem", "Difficulty", "Pattern", "Status", "Spaced Repetition", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#475569", fontSize: 11, fontWeight: 700, letterSpacing: 1, borderBottom: "1px solid #334155", whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const pg = progress[p.id];
                    const solved = !!pg;
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "#0f172a22" }}>
                        <td style={{ padding: "10px 14px", color: "#475569", fontSize: 12 }}>{i + 1}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <a href={p.url} target="_blank" rel="noreferrer" style={{ color: solved ? "#4ade80" : "#e2e8f0", textDecoration: "none", fontWeight: 500 }}>
                            {solved && "✓ "}{p.name}
                          </a>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty], padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{p.difficulty}</span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          {revealed[p.id]
                            ? <span onClick={() => toggleReveal(p.id)} style={{ background: PATTERN_COLORS[p.pattern] + "22", color: PATTERN_COLORS[p.pattern], padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{p.pattern} ✕</span>
                            : <button onClick={() => toggleReveal(p.id)} style={{ background: "#334155", border: "none", color: "#94a3b8", padding: "2px 10px", borderRadius: 10, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>👁 Reveal</button>
                          }
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          {solved
                            ? <span style={{ color: "#4ade80", fontSize: 12 }}>✅ {formatDate(pg.solvedDate)}</span>
                            : <span style={{ color: "#475569", fontSize: 12 }}>Unsolved</span>}
                        </td>
                        <td style={{ padding: "10px 14px", position: "relative" }}>
                          {solved ? (
                            <div style={{ position: "relative" }}>
                              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                {pg.revisions.map((r: any, idx: number) => {
                                  const overdue = !r.done && r.date <= todayStr;
                                  return (
                                    <div key={idx} title={`Rev ${idx + 1}: ${formatDate(r.date)} — ${r.done ? "Done" : overdue ? "Overdue!" : daysFromNow(r.date)}`} style={{
                                      width: 32, height: 32, borderRadius: 6, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, cursor: "pointer",
                                      background: r.done ? "#14532d" : overdue ? "#7f1d1d" : "#1e3a5f",
                                      color: r.done ? "#4ade80" : overdue ? "#f87171" : "#60a5fa",
                                      border: `1px solid ${r.done ? "#4ade80" : overdue ? "#f87171" : "#3b82f6"}44`,
                                      lineHeight: 1.1
                                    }} onClick={() => toggleRevision(p.id, idx)}>
                                      <span style={{ fontSize: 10 }}>{r.done ? "✓" : `R${idx + 1}`}</span>
                                      <span style={{ fontSize: 8, opacity: 0.7 }}>{formatDate(r.date).split(" ")[0]}/{formatDate(r.date).split(" ")[1]}</span>
                                    </div>
                                  );
                                })}
                                <button onClick={() => setPopoverId(popoverId === p.id ? null : p.id)} style={{ background: "#334155", border: "none", color: "#94a3b8", width: 24, height: 24, borderRadius: 6, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>ℹ</button>
                              </div>
                              {/* Popover */}
                              {popoverId === p.id && (
                                <div ref={popoverRef} style={{
                                  position: "absolute", top: 40, left: 0, zIndex: 50,
                                  background: "#1e293b", border: "1px solid #475569", borderRadius: 10,
                                  padding: 16, minWidth: 260, boxShadow: "0 8px 30px #0008"
                                }}>
                                  <div style={{ fontWeight: 700, fontSize: 13, color: "#f1f5f9", marginBottom: 8 }}>Revision Schedule</div>
                                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Solved on {formatDate(pg.solvedDate)} · {pg.revisions.filter((r: any) => r.done).length}/{pg.revisions.length} revisions done</div>
                                  {pg.revisions.map((r: any, idx: number) => {
                                    const overdue = !r.done && r.date <= todayStr;
                                    return (
                                      <div key={idx} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "8px 10px", borderRadius: 8, marginBottom: 4,
                                        background: r.done ? "#14532d22" : overdue ? "#7f1d1d22" : "#1e3a5f22"
                                      }}>
                                        <div>
                                          <div style={{ fontWeight: 600, fontSize: 12, color: r.done ? "#4ade80" : overdue ? "#f87171" : "#60a5fa" }}>
                                            Rev {idx + 1} — Day +{SPACED_DAYS[idx]}
                                          </div>
                                          <div style={{ fontSize: 11, color: "#64748b" }}>
                                            {formatDate(r.date)} · {r.done ? "Completed" : overdue ? "Overdue!" : daysFromNow(r.date)}
                                          </div>
                                        </div>
                                        {r.done
                                          ? <button onClick={() => toggleRevision(p.id, idx)} style={{ background: "#14532d", border: "1px solid #4ade8044", color: "#4ade80", padding: "3px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>↩ Undo</button>
                                          : <button onClick={() => toggleRevision(p.id, idx)} style={{
                                              background: overdue ? "#7f1d1d" : "#1e3a5f",
                                              border: `1px solid ${overdue ? "#f87171" : "#3b82f6"}44`,
                                              color: overdue ? "#f87171" : "#60a5fa",
                                              padding: "3px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600
                                            }}>✓ Done</button>
                                        }
                                      </div>
                                    );
                                  })}
                                  <button onClick={() => setPopoverId(null)} style={{ marginTop: 8, background: "transparent", border: "1px solid #334155", color: "#64748b", padding: "4px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", width: "100%" }}>Close</button>
                                </div>
                              )}
                            </div>
                          ) : <span style={{ color: "#334155", fontSize: 12 }}>—</span>}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {!solved
                              ? <button onClick={() => markSolved(p.id)} style={{ background: "#14532d", border: "1px solid #4ade8044", color: "#4ade80", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✓ Done</button>
                              : <button onClick={() => unmark(p.id)} style={{ background: "#1e293b", border: "1px solid #334155", color: "#64748b", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>↩ Undo</button>
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TODAY TAB */}
        {tab === "today" && (
          <div>
            <div style={{ marginBottom: 16, color: "#94a3b8" }}>
              {todayRevisions.length === 0
                ? <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
                    <div style={{ fontSize: 40 }}>🎉</div>
                    <div style={{ marginTop: 12, fontSize: 16, color: "#64748b" }}>No revisions due today!</div>
                    <div style={{ marginTop: 6, fontSize: 13 }}>Keep solving problems to build your schedule.</div>
                  </div>
                : <>
                  <div style={{ marginBottom: 14, fontSize: 13, color: "#64748b" }}>{todayRevisions.length} problem{todayRevisions.length > 1 ? "s" : ""} due for revision today</div>
                  {todayRevisions.map(p => {
                    const pg = progress[p.id];
                    const dueRevs = pg.revisions.map((r, i) => ({ ...r, i })).filter(r => !r.done && r.date <= todayStr);
                    return (
                      <div key={p.id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                            <span style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty], padding: "1px 7px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{p.difficulty}</span>
                            <span style={{ background: PATTERN_COLORS[p.pattern] + "22", color: PATTERN_COLORS[p.pattern], padding: "1px 7px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{p.pattern}</span>
                          </div>
                          <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "#f1f5f9", fontWeight: 600, textDecoration: "none", fontSize: 15 }}>{p.name}</a>
                          <div style={{ marginTop: 4, color: "#64748b", fontSize: 12 }}>Solved: {formatDate(pg.solvedDate)}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {dueRevs.map(r => (
                            <button key={r.i} onClick={() => toggleRevision(p.id, r.i)} style={{
                              background: "#7f1d1d", border: "1px solid #f8717144", color: "#f87171", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600
                            }}>✓ Rev {r.i + 1} Done</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              }
            </div>
          </div>
        )}

        {/* UPCOMING TAB */}
        {tab === "upcoming" && (
          <div>
            {upcomingRevisions.length === 0
              ? <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
                  <div style={{ fontSize: 40 }}>📅</div>
                  <div style={{ marginTop: 12, fontSize: 16, color: "#64748b" }}>No upcoming revisions yet</div>
                  <div style={{ marginTop: 6, fontSize: 13 }}>Start solving problems to build your revision schedule.</div>
                </div>
              : (() => {
                  const byDate: Record<string, any[]> = {};
                  upcomingRevisions.forEach(r => { if (!byDate[r.revDate]) byDate[r.revDate] = []; byDate[r.revDate].push(r); });
                  return Object.entries(byDate).map(([date, items]: [string, any[]]) => (
                    <div key={date} style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, color: "#f1f5f9" }}>{formatDate(date)}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{daysFromNow(date)}</div>
                        <div style={{ flex: 1, height: 1, background: "#334155" }} />
                        <div style={{ fontSize: 12, color: "#475569" }}>{items.length} problem{items.length > 1 ? "s" : ""}</div>
                      </div>
                      {items.map(p => (
                        <div key={`${p.id}-${p.rIdx}`} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                              <span style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty], padding: "1px 7px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{p.difficulty}</span>
                              <span style={{ background: PATTERN_COLORS[p.pattern] + "22", color: PATTERN_COLORS[p.pattern], padding: "1px 7px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{p.pattern}</span>
                              <span style={{ fontSize: 11, color: "#475569" }}>Revision {p.rIdx + 1}</span>
                            </div>
                            <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{p.name}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 600 }}>{daysFromNow(p.revDate)}</div>
                        </div>
                      ))}
                    </div>
                  ));
                })()
            }
          </div>
        )}
      </div>
    </div>
  );
}
