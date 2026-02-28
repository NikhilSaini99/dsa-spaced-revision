import { useState } from "react";
import type { IncomingProblem, SourceKey } from "../types";
import {
  BUILTIN_PATTERNS,
  DIFFICULTIES,
  SOURCE_COLORS,
  DIFF_COLOR,
  PATTERN_COLORS,
  TOPIC_COLORS,
} from "../config";

interface Props {
  queue: IncomingProblem[];
  existingPatterns: string[];
  existingTopics: string[];
  onAccept: (
    items: {
      name: string;
      url: string;
      pattern: string;
      difficulty: string;
      source: SourceKey;
      topics: string[];
    }[]
  ) => void;
  onDismissOne: (url: string) => void;
  onDismissAll: () => void;
}

export function IncomingProblemsToast({
  queue,
  existingPatterns,
  existingTopics,
  onAccept,
  onDismissOne,
  onDismissAll,
}: Props) {
  const [reviewing, setReviewing] = useState(false);
  const [assignments, setAssignments] = useState<
    Record<string, { pattern: string; difficulty: string; topics: string[] }>
  >({});

  if (queue.length === 0) return null;

  const patternOptions = existingPatterns.filter((p) => p !== "All");
  const topicOptions = existingTopics.filter((t) => t !== "All");

  const updateAssignment = (
    url: string,
    field: "pattern" | "difficulty",
    value: string
  ) => {
    setAssignments((prev) => ({
      ...prev,
      [url]: {
        pattern: prev[url]?.pattern || "",
        difficulty: prev[url]?.difficulty || "",
        topics: prev[url]?.topics || [],
        [field]: value,
      },
    }));
  };

  const toggleTopicAssignment = (url: string, topic: string) => {
    setAssignments((prev) => {
      const current = prev[url] || { pattern: "", difficulty: "Medium", topics: [] };
      const has = current.topics.includes(topic);
      return {
        ...prev,
        [url]: {
          ...current,
          topics: has ? current.topics.filter((t) => t !== topic) : [...current.topics, topic],
        },
      };
    });
  };

  const handleAcceptAll = () => {
    const items = queue.map((p) => ({
      name: p.name,
      url: p.url,
      source: p.source,
      pattern: assignments[p.url]?.pattern || "Uncategorized",
      difficulty: assignments[p.url]?.difficulty || p.difficulty || "Medium",
      topics: assignments[p.url]?.topics?.length
        ? assignments[p.url].topics
        : (p.topics ?? []),
    }));
    onAccept(items);
    setReviewing(false);
    setAssignments({});
  };

  if (!reviewing) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
        <div className="glass-card p-4 max-w-sm shadow-2xl shadow-blue-600/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">
              📌
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">
                {queue.length} problem{queue.length > 1 ? "s" : ""} from
                extension
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">
                Ready to add to your tracker
              </p>
              <div className="mt-2 max-h-28 overflow-y-auto space-y-1">
                {queue.slice(0, 5).map((p) => (
                  <div
                    key={p.url}
                    className="flex items-center gap-2 text-xs text-surface-300"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: SOURCE_COLORS[p.source] }}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                ))}
                {queue.length > 5 && (
                  <span className="text-[11px] text-surface-500">
                    +{queue.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => {
                // Pre-fill assignments with available data
                const init: Record<string, { pattern: string; difficulty: string; topics: string[] }> = {};
                queue.forEach((p) => {
                  init[p.url] = {
                    pattern: "",
                    difficulty: p.difficulty || "Medium",
                    topics: p.topics ?? [],
                  };
                });
                setAssignments(init);
                setReviewing(true);
              }}
              className="btn-primary text-[11px] px-3 py-1.5 flex-1"
            >
              Review & Add
            </button>
            <button
              onClick={onDismissAll}
              className="btn-ghost text-[11px] px-3 py-1.5"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Review mode (full-screen overlay) ──
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-label="Review incoming problems"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setReviewing(false)}
      />
      <div className="relative w-full max-w-2xl glass-card p-6 animate-slide-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            Review Incoming Problems ({queue.length})
          </h2>
          <button
            onClick={() => setReviewing(false)}
            className="w-8 h-8 rounded-lg bg-surface-700/60 text-surface-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-surface-400 mb-4">
          Assign a <strong className="text-surface-200">pattern</strong> to each
          problem. This lets the tracker categorize them for revision and random
          picking.
        </p>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {queue.map((p) => {
            const a = assignments[p.url] || {
              pattern: "",
              difficulty: p.difficulty || "Medium",
            };
            return (
              <div
                key={p.url}
                className="glass-card-inner p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ background: SOURCE_COLORS[p.source] }}
                      />
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: SOURCE_COLORS[p.source] }}
                      >
                        {p.source}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {p.name}
                    </h3>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-400 hover:underline truncate block"
                    >
                      {p.url}
                    </a>
                    {/* Scraped topics from the platform */}
                    {p.topics && p.topics.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-surface-600">
                          Topics:
                        </span>
                        {p.topics.map((t) => (
                          <span
                            key={t}
                            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onDismissOne(p.url)}
                    className="text-surface-600 hover:text-red-400 text-xs cursor-pointer transition-colors shrink-0"
                    aria-label={`Dismiss ${p.name}`}
                  >
                    ✕
                  </button>
                </div>

                {/* Difficulty */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500 w-16">
                    Difficulty
                  </span>
                  {DIFFICULTIES.filter((d) => d !== "All").map((d) => {
                    const active = a.difficulty === d;
                    const c = DIFF_COLOR[d] || "#3b82f6";
                    return (
                      <button
                        key={d}
                        onClick={() =>
                          updateAssignment(p.url, "difficulty", d)
                        }
                        className={`pill text-[10px] ${active ? "pill-active" : ""}`}
                        style={{
                          borderColor: active ? c : undefined,
                          background: active ? c + "18" : undefined,
                          color: active ? c : undefined,
                          ...(!active
                            ? {
                                borderColor: "rgb(51 65 85 / .5)",
                                color: "rgb(148 163 184)",
                              }
                            : {}),
                        }}
                        aria-pressed={active}
                        type="button"
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {/* Pattern */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500 w-16">
                    Pattern
                  </span>
                  {patternOptions.map((pat) => {
                    const active = a.pattern === pat;
                    const c = PATTERN_COLORS[pat] || "#94a3b8";
                    return (
                      <button
                        key={pat}
                        onClick={() =>
                          updateAssignment(p.url, "pattern", pat)
                        }
                        className={`pill text-[10px] ${active ? "pill-active" : ""}`}
                        style={{
                          borderColor: active ? c : undefined,
                          background: active ? c + "18" : undefined,
                          color: active ? c : undefined,
                          ...(!active
                            ? {
                                borderColor: "rgb(51 65 85 / .5)",
                                color: "rgb(148 163 184)",
                              }
                            : {}),
                        }}
                        aria-pressed={active}
                        type="button"
                      >
                        {pat}
                      </button>
                    );
                  })}
                </div>

                {/* Topics */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500 w-16">
                    Topics
                  </span>
                  {topicOptions.map((t) => {
                    const active = (a.topics || []).includes(t);
                    const c = TOPIC_COLORS[t] || "#94a3b8";
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTopicAssignment(p.url, t)}
                        className={`pill text-[10px] ${active ? "pill-active" : ""}`}
                        style={{
                          borderColor: active ? c : undefined,
                          background: active ? c + "18" : undefined,
                          color: active ? c : undefined,
                          ...(!active
                            ? {
                                borderColor: "rgb(51 65 85 / .5)",
                                color: "rgb(148 163 184)",
                              }
                            : {}),
                        }}
                        aria-pressed={active}
                        type="button"
                      >
                        {active && <span className="mr-0.5">✓</span>}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-700/30">
          <span className="text-xs text-surface-500">
            {queue.filter((p) => assignments[p.url]?.pattern).length}/
            {queue.length} assigned
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReviewing(false)}
              className="btn-ghost text-xs"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptAll}
              className="btn-success text-xs px-5"
              type="button"
            >
              Add {queue.length} Problem{queue.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
