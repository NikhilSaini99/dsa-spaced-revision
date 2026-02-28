import { useState, useEffect, useRef } from "react";
import type { Problem } from "../types";
import { DIFF_BG, DIFF_COLOR, PATTERN_COLORS, NOTES_TEMPLATES } from "../config";
import { renderSimpleMarkdown } from "../utils";

interface Props {
  problem: Problem | null;
  noteValue: string;
  onUpdate: (id: number, value: string) => void;
  onFlush: () => void;
  onClose: () => void;
}

export function NotesModal({
  problem,
  noteValue,
  onUpdate,
  onFlush,
  onClose,
}: Props) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!problem) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [problem, onClose]);

  // Focus textarea when modal opens in edit mode
  useEffect(() => {
    if (problem && !preview) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [problem, preview]);

  if (!problem) return null;

  const insertTemplate = (text: string) => {
    const existing = noteValue;
    const newVal = existing ? existing + "\n\n" + text : text;
    onUpdate(problem.id, newVal);
    setPreview(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Notes for ${problem.name}`}
    >
      <div
        className="glass-card w-full max-w-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-surface-500 font-semibold">
              Notes
            </div>
            <h3 className="text-base font-bold text-white leading-tight mt-1">
              {problem.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  background: DIFF_BG[problem.difficulty],
                  color: DIFF_COLOR[problem.difficulty],
                }}
              >
                {problem.difficulty}
              </span>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  background: PATTERN_COLORS[problem.pattern] + "1a",
                  color: PATTERN_COLORS[problem.pattern],
                }}
              >
                {problem.pattern}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-600/80 hover:text-surface-200 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Close notes modal"
          >
            ✕
          </button>
        </div>

        {/* Templates + Preview toggle */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">
            Insert:
          </span>
          {NOTES_TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => insertTemplate(t.text)}
              className="text-[10px] font-semibold px-2 py-1 rounded-md bg-surface-700/50 text-surface-400 hover:text-white hover:bg-surface-600/60 transition-colors cursor-pointer"
              aria-label={`Insert ${t.label} template`}
            >
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setPreview(!preview)}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              preview
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-surface-700/50 text-surface-400 hover:text-white hover:bg-surface-600/60"
            }`}
            aria-label={preview ? "Switch to edit mode" : "Switch to preview mode"}
          >
            {preview ? "✏️ Edit" : "👁 Preview"}
          </button>
        </div>

        {/* Editor / Preview */}
        {preview ? (
          <div
            className="w-full rounded-xl border border-surface-700/60 bg-surface-900/70 px-4 py-3 min-h-[200px] max-h-[400px] overflow-y-auto text-sm text-surface-300 notes-preview"
            dangerouslySetInnerHTML={{
              __html: renderSimpleMarkdown(noteValue || "*No notes yet*"),
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={noteValue}
            onChange={(e) => onUpdate(problem.id, e.target.value)}
            onBlur={onFlush}
            rows={10}
            maxLength={5000}
            placeholder={`Write your approach, edge cases, dry run, and mistakes to avoid...\n\nTip: Use **bold**, *italic*, \`code\`, ## headings, - lists. Click Preview to see formatted output.`}
            className="w-full rounded-xl border border-surface-700/60 bg-surface-900/70 px-3 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 font-mono"
            aria-label="Notes editor"
          />
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-surface-500">
            {(noteValue || "").length}/5000 · Supports Markdown
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdate(problem.id, "");
                onFlush();
              }}
              className="btn-ghost text-xs px-3 py-1.5"
              aria-label="Clear notes"
            >
              Clear
            </button>
            <button
              onClick={() => {
                onFlush();
                onClose();
              }}
              className="btn-primary text-xs px-3 py-1.5"
              aria-label="Save and close notes"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
