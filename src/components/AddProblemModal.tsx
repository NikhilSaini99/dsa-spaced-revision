import { useState, useEffect } from "react";
import type { Problem, SourceKey } from "../types";
import {
  BUILTIN_PATTERNS,
  DIFFICULTIES,
  SOURCES,
  SOURCE_COLORS,
  DIFF_COLOR,
  PATTERN_COLORS,
  TOPIC_COLORS,
} from "../config";
import { detectSourceFromUrl, nameFromUrl } from "../utils";

interface Props {
  open: boolean;
  /** If set, we're editing an existing custom problem */
  editProblem?: Problem | null;
  existingPatterns: string[];
  existingTopics: string[];
  onSave: (data: {
    name: string;
    url: string;
    pattern: string;
    difficulty: string;
    source: SourceKey;
    topics: string[];
  }) => void;
  onClose: () => void;
}

export function AddProblemModal({
  open,
  editProblem,
  existingPatterns,
  existingTopics,
  onSave,
  onClose,
}: Props) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [newPattern, setNewPattern] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [source, setSource] = useState<SourceKey>("LeetCode");
  const [showNewPatternInput, setShowNewPatternInput] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [showNewTopicInput, setShowNewTopicInput] = useState(false);

  const isEditing = !!editProblem;

  // Pre-fill when editing
  useEffect(() => {
    if (editProblem) {
      setUrl(editProblem.url);
      setName(editProblem.name);
      setPattern(editProblem.pattern);
      setDifficulty(editProblem.difficulty);
      setSource(editProblem.source);
      setTopics(editProblem.topics ?? []);
      setShowNewPatternInput(false);
      setNewPattern("");
      setShowNewTopicInput(false);
      setNewTopic("");
    } else {
      setUrl("");
      setName("");
      setPattern("");
      setDifficulty("Medium");
      setSource("LeetCode");
      setTopics([]);
      setShowNewPatternInput(false);
      setNewPattern("");
      setShowNewTopicInput(false);
      setNewTopic("");
    }
  }, [editProblem, open]);

  // Auto-detect source and name when URL changes
  useEffect(() => {
    if (isEditing) return;
    if (!url.trim()) return;
    const detected = detectSourceFromUrl(url);
    if (detected) setSource(detected);
    const extracted = nameFromUrl(url);
    if (extracted && !name) setName(extracted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, isEditing]);

  const handleUrlBlur = () => {
    if (isEditing) return;
    const extracted = nameFromUrl(url);
    if (extracted && !name) setName(extracted);
  };

  // All patterns including custom ones, without "All"
  const patternOptions = existingPatterns.filter((p) => p !== "All");
  const topicOptions = existingTopics.filter((t) => t !== "All");

  const toggleTopic = (t: string) => {
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const addCustomTopic = () => {
    const trimmed = newTopic.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics((prev) => [...prev, trimmed]);
    }
    setNewTopic("");
    setShowNewTopicInput(false);
  };

  const finalPattern = showNewPatternInput ? newPattern.trim() : pattern;
  const canSave =
    name.trim() &&
    url.trim() &&
    finalPattern &&
    difficulty &&
    source;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      url: url.trim(),
      pattern: finalPattern,
      difficulty,
      source,
      topics,
    });
    onClose();
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-label={isEditing ? "Edit problem" : "Add problem"}
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg glass-card p-6 animate-slide-up space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? "Edit Problem" : "Add Problem"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-700/60 text-surface-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* URL */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Problem URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="Paste LeetCode, GFG, HackerRank or TUF URL…"
            className="w-full px-3 py-2 rounded-xl border border-surface-700/60 bg-surface-900/70 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
            autoFocus
          />
          {url && source && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: SOURCE_COLORS[source] }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: SOURCE_COLORS[source] }}
              >
                {source} detected
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Problem Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Two Sum"
            className="w-full px-3 py-2 rounded-xl border border-surface-700/60 bg-surface-900/70 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Source
          </label>
          <div className="flex flex-wrap gap-2">
            {SOURCES.map((s) => {
              const active = source === s;
              const c = SOURCE_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`pill ${active ? "pill-active" : ""}`}
                  style={{
                    borderColor: active ? c : undefined,
                    background: active ? c + "18" : undefined,
                    color: active ? c : undefined,
                    ...(!active
                      ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
                      : {}),
                  }}
                  aria-pressed={active}
                  type="button"
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.filter((d) => d !== "All").map((d) => {
              const active = difficulty === d;
              const c = DIFF_COLOR[d] || "#3b82f6";
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`pill ${active ? "pill-active" : ""}`}
                  style={{
                    borderColor: active ? c : undefined,
                    background: active ? c + "18" : undefined,
                    color: active ? c : undefined,
                    ...(!active
                      ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
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
        </div>

        {/* Pattern */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Pattern
          </label>
          {!showNewPatternInput ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {patternOptions.map((p) => {
                  const active = pattern === p;
                  const c = PATTERN_COLORS[p] || "#94a3b8";
                  return (
                    <button
                      key={p}
                      onClick={() => setPattern(p)}
                      className={`pill ${active ? "pill-active" : ""}`}
                      style={{
                        borderColor: active ? c : undefined,
                        background: active ? c + "18" : undefined,
                        color: active ? c : undefined,
                        ...(!active
                          ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
                          : {}),
                      }}
                      aria-pressed={active}
                      type="button"
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setShowNewPatternInput(true);
                  setPattern("");
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                type="button"
              >
                + New pattern
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                placeholder="e.g. Graphs, DP, Trees…"
                className="flex-1 px-3 py-2 rounded-xl border border-surface-700/60 bg-surface-900/70 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowNewPatternInput(false);
                  setNewPattern("");
                }}
                className="text-[11px] text-surface-500 hover:text-surface-300 cursor-pointer transition-colors"
                type="button"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Topics (multi-select) */}
        <div>
          <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
            Topics
            <span className="ml-1 text-surface-600 normal-case font-normal">(select multiple)</span>
          </label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((t) => {
                const active = topics.includes(t);
                const c = TOPIC_COLORS[t] || "#94a3b8";
                return (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`pill ${active ? "pill-active" : ""}`}
                    style={{
                      borderColor: active ? c : undefined,
                      background: active ? c + "18" : undefined,
                      color: active ? c : undefined,
                      ...(!active
                        ? { borderColor: "rgb(51 65 85 / .5)", color: "rgb(148 163 184)" }
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
            {!showNewTopicInput ? (
              <button
                onClick={() => setShowNewTopicInput(true)}
                className="text-[11px] text-teal-400 hover:text-teal-300 cursor-pointer transition-colors"
                type="button"
              >
                + New topic
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
                  placeholder="e.g. Trie, Segment Tree…"
                  className="flex-1 px-3 py-2 rounded-xl border border-surface-700/60 bg-surface-900/70 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/40"
                  autoFocus
                />
                <button
                  onClick={addCustomTopic}
                  className="text-[11px] text-teal-400 hover:text-teal-300 cursor-pointer transition-colors"
                  type="button"
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowNewTopicInput(false); setNewTopic(""); }}
                  className="text-[11px] text-surface-500 hover:text-surface-300 cursor-pointer transition-colors"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-700/30">
          <button
            onClick={onClose}
            className="btn-ghost text-xs"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-success text-xs px-5"
            type="button"
          >
            {isEditing ? "Save Changes" : "Add Problem"}
          </button>
        </div>
      </div>
    </div>
  );
}
