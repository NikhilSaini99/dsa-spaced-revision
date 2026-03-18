import type { SourceKey } from "./types";

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function daysFromNow(dateStr: string): string {
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

/** Convert basic markdown text to safe HTML for preview */
export function renderSimpleMarkdown(text: string): string {
  if (!text) return "";
  return (
    text
      // escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // headings
      .replace(/^### (.+)$/gm, '<h4 class="text-sm font-bold text-white mt-3 mb-1">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 class="text-base font-bold text-white mt-3 mb-1">$1</h3>')
      .replace(/^# (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-3 mb-1">$1</h2>')
      // triple backtick code blocks
      .replace(
        /```(\w*)\n([\s\S]*?)```/g,
        '<pre class="bg-surface-900 rounded-lg p-3 text-xs text-emerald-400 overflow-x-auto my-2"><code>$2</code></pre>'
      )
      // inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-surface-900/80 text-emerald-400 px-1.5 py-0.5 rounded text-xs">$1</code>'
      )
      // bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      // italic
      .replace(/\*(.+?)\*/g, '<em class="text-surface-300 italic">$1</em>')
      // list items
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-surface-300 list-disc">$1</li>')
      // newlines
      .replace(/\n/g, "<br/>")
  );
}

const DIFF_ORDER: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

export function difficultyOrder(d: string): number {
  return DIFF_ORDER[d] ?? 99;
}

/** Detect platform source from a URL */
export function detectSourceFromUrl(url: string): SourceKey | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("leetcode.com")) return "LeetCode";
    if (host.includes("geeksforgeeks.org")) return "GFG";
    if (host.includes("hackerrank.com")) return "HackerRank";
    if (host.includes("takeuforward.org")) return "TUF";
    return null;
  } catch {
    return null;
  }
}

/** Extract a human-readable problem name from a URL slug */
export function nameFromUrl(url: string): string {
  try {
    const { pathname, hostname } = new URL(url);
    const segments = pathname.split("/").filter(Boolean);

    if (hostname.includes("leetcode.com")) {
      const slug = segments.find((_, i) => segments[i - 1] === "problems");
      if (slug) return slugToTitle(slug);
    }
    if (hostname.includes("geeksforgeeks.org")) {
      const slug = segments.find((_, i) => segments[i - 1] === "problems");
      if (slug) return slugToTitle(slug);
    }
    if (hostname.includes("hackerrank.com")) {
      const slug = segments.find((_, i) => segments[i - 1] === "challenges");
      if (slug) return slugToTitle(slug);
    }
    if (hostname.includes("takeuforward.org")) {
      const slug = segments[segments.length - 1] || segments[segments.length - 2];
      if (slug) return slugToTitle(slug);
    }
    const last = segments[segments.length - 1];
    return last ? slugToTitle(last) : "";
  } catch {
    return "";
  }
}

/** Deterministic hash for a date string (for Problem of the Day) */
export function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
