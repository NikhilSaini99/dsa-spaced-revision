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
  let companies = [];

  /** Collect company tags from TUF's Company section */
  const collectCompanyTags = () => {
    const tags = new Set();
    // Strategy 1: Find a heading/text that says "Company" and grab sibling content
    document.querySelectorAll('div, section, span, h2, h3, h4, p').forEach((el) => {
      const text = el.textContent.trim();
      if (text === 'Company' || text === 'Companies') {
        // Look for the next sibling or parent's next sibling container with tag-like children
        const container = el.closest('div, section')?.parentElement || el.parentElement;
        if (container) {
          container.querySelectorAll('span, a, div, button, p').forEach((child) => {
            if (child.children.length > 0) return; // leaf nodes
            const t = child.textContent.trim();
            if (t && t.length > 1 && t.length < 60 && t !== 'Company' && t !== 'Companies') {
              tags.add(t);
            }
          });
        }
      }
    });
    // Strategy 2: Elements with class containing "company"
    if (tags.size === 0) {
      document.querySelectorAll('[class*="company"] span, [class*="company"] a, [class*="company"] div, [class*="Company"] span, [class*="Company"] a').forEach((el) => {
        if (el.children.length > 0) return;
        const t = el.textContent.trim();
        if (t && t.length > 1 && t.length < 60) tags.add(t);
      });
    }
    return [...tags];
  };

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
  if (host === "takeuforward.org" && (path.includes("/data-structures-and-algorithms/") || path.includes("/dsa/problems/"))) {
    source = "TUF";
    const segments = path.split("/").filter(Boolean);
    const slug = segments[segments.length - 1] || "";

    // ── Title: use the URL slug (reliable) ──
    name = slugToTitle(slug);

    // ── Difficulty: look for Easy / Medium / Hard text in badge-like elements ──
    const diffSelectors = [
      '[class*="difficulty"]',
      '[class*="Difficulty"]',
      '[class*="badge"]',
      '[class*="level"]',
      '[class*="tag"]',
    ];
    for (const sel of diffSelectors) {
      if (difficulty) break;
      document.querySelectorAll(sel).forEach((el) => {
        if (difficulty) return;
        const text = el.textContent.trim().toLowerCase();
        if (text === "easy" || text === "medium" || text === "hard") {
          difficulty = text.charAt(0).toUpperCase() + text.slice(1);
        }
      });
    }
    // Fallback: search all small text elements for standalone Easy/Medium/Hard
    if (!difficulty) {
      document.querySelectorAll('span, div, p, button').forEach((el) => {
        if (difficulty) return;
        if (el.children.length > 0) return; // leaf nodes only
        const text = el.textContent.trim().toLowerCase();
        if (text === "easy") difficulty = "Easy";
        else if (text === "medium") difficulty = "Medium";
        else if (text === "hard") difficulty = "Hard";
      });
    }

    // ── Topics: try DOM tags, then URL-derived ──
    topics = collectTags('.tag, .topic-tag, [class*="tag"] a');
    if (!topics.length && segments.length >= 3) {
      const category = slugToTitle(segments[segments.length - 2] || "");
      if (category && category !== "Data Structures And Algorithms" && category !== "Problems" && category !== "Dsa") {
        topics = [category];
      }
    }

    // ── Company tags: look for the "Company" section and extract names ──
    companies = collectCompanyTags();
  }

  // De-dup and clean up topics
  topics = [...new Set(topics.map((t) => t.trim()).filter(Boolean))];

  // Expose to bridge.js (runs after this script)
  if (source) {
    window.__dsaTrackerProblem = { source, name, url, difficulty, topics, companies };
  }
})();
