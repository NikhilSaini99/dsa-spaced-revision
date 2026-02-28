/* detect.js — Unified scraper that detects which platform
   the user is on and extracts problem metadata. Runs before bridge.js. */

(() => {
  const host = location.hostname;
  const path = location.pathname;

  const slugToTitle = (slug) =>
    slug
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  /** Collect unique, trimmed, non-empty tag strings from matching elements */
  const collectTags = (selector) => {
    const els = document.querySelectorAll(selector);
    const tags = new Set();
    els.forEach((el) => {
      const t = el.textContent.trim();
      if (t && t.length < 60) tags.add(t);
    });
    return [...tags];
  };

  let source = null;
  let name = "";
  let url = location.href.split("?")[0].split("#")[0];
  let difficulty = "";
  let topics = [];

  /* ── LeetCode ── */
  if (host === "leetcode.com" && path.startsWith("/problems/")) {
    source = "LeetCode";
    const slug = path.split("/")[2];
    name = slugToTitle(slug);
    // Attempt to read difficulty from the page
    const diffEl =
      document.querySelector('[data-difficulty]') ||
      document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard');
    if (diffEl) {
      const text = diffEl.textContent.trim().toLowerCase();
      if (text.includes("easy")) difficulty = "Easy";
      else if (text.includes("medium")) difficulty = "Medium";
      else if (text.includes("hard")) difficulty = "Hard";
    }
    // Topics — LeetCode shows them as links under /tag/ or in topic-tag elements
    topics = collectTags('a[href*="/tag/"], a[href*="/topics/"], [class*="topic-tag"]');
    // Fallback: look for the "Topics" section that expands behind a button
    if (!topics.length) {
      document.querySelectorAll('div, span').forEach((el) => {
        if (el.children.length === 0 && el.closest('a[href*="/tag/"]')) {
          const t = el.textContent.trim();
          if (t && t.length < 40) topics.push(t);
        }
      });
    }
  }

  /* ── GeeksForGeeks ── */
  if (
    (host === "www.geeksforgeeks.org" || host === "practice.geeksforgeeks.org") &&
    path.includes("/problems/")
  ) {
    source = "GFG";
    const slug = path.split("/problems/")[1]?.split("/")[0] || "";
    name = slugToTitle(slug);
    const diffEl = document.querySelector('.problems_header_content__difficulty, .problemPage_problem_header_difficulty__E5hdD');
    if (diffEl) {
      const text = diffEl.textContent.trim().toLowerCase();
      if (text.includes("basic") || text.includes("school") || text.includes("easy")) difficulty = "Easy";
      else if (text.includes("medium")) difficulty = "Medium";
      else if (text.includes("hard")) difficulty = "Hard";
    }
    // Topics — GFG uses tag links and topic chips
    topics = collectTags('.problems_tag_container a, .problem-tag-list a, [class*="tag-list"] a, [class*="problemTag"] a, .tags a');
    // Fallback: any link whose href contains /explore/?category
    if (!topics.length) {
      topics = collectTags('a[href*="/explore/"], a[href*="category="]');
    }
  }

  /* ── HackerRank ── */
  if (host === "www.hackerrank.com" && path.includes("/challenges/")) {
    source = "HackerRank";
    const slug = path.split("/challenges/")[1]?.split("/")[0] || "";
    name = slugToTitle(slug);
    const diffEl = document.querySelector('.difficulty-label, .challenge-view .sidebar-heading + p');
    if (diffEl) {
      const text = diffEl.textContent.trim().toLowerCase();
      if (text.includes("easy")) difficulty = "Easy";
      else if (text.includes("medium")) difficulty = "Medium";
      else if (text.includes("hard")) difficulty = "Hard";
    }
    // Topics — HackerRank shows skills/tags in the sidebar
    topics = collectTags('.challenge-sidebar .tag-list a, .skills-list .skill-name, .problem-tag-list a, [class*="tag"] a');
    // Breadcrumb fallback (category name)
    if (!topics.length) {
      topics = collectTags('.breadcrumb a:not(:first-child):not(:last-child)');
    }
  }

  /* ── TakeUForward (TUF) ── */
  if (host === "takeuforward.org" && path.includes("/data-structures-and-algorithms/")) {
    source = "TUF";
    const segments = path.split("/").filter(Boolean);
    const slug = segments[segments.length - 1] || "";
    name = slugToTitle(slug);
    // TUF doesn't consistently surface difficulty in the DOM

    // Topics — try to extract from the URL structure (e.g. /sorting/bubble-sort)
    // and also look for tag-like elements on page
    topics = collectTags('.tag, .topic-tag, [class*="tag"] a');
    // URL-derived topic: second-to-last segment is usually the category
    if (!topics.length && segments.length >= 3) {
      const category = slugToTitle(segments[segments.length - 2] || "");
      if (category && category !== "Data Structures And Algorithms") {
        topics = [category];
      }
    }
  }

  // De-dup and clean up topics
  topics = [...new Set(topics.map((t) => t.trim()).filter(Boolean))];

  // Expose to bridge.js (runs after this script)
  if (source) {
    window.__dsaTrackerProblem = { source, name, url, difficulty, topics };
  }
})();
