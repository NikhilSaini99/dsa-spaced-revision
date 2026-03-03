/* popup.js — Renders pending problems in the popup and
   provides Push to Tracker / Clear All actions. */

const SOURCE_COLORS = {
  LeetCode: "#f89f1b",
  GFG: "#2f8d46",
  HackerRank: "#1ba94c",
  TUF: "#e74c3c",
};

const TRACKER_ORIGIN = "http://localhost:5173"; // Vite dev default

const listEl = document.getElementById("list");
const actionsEl = document.getElementById("actions");
const statusEl = document.getElementById("status");

function render(problems) {
  if (!problems.length) {
    listEl.innerHTML = '<div class="empty">No saved problems yet.<br>Visit a problem page and click "Save to Tracker".</div>';
    actionsEl.style.display = "none";
    return;
  }

  actionsEl.style.display = "flex";
  listEl.innerHTML = problems
    .map((p) => {
      const srcColor = SOURCE_COLORS[p.source] || "#3b82f6";
      const topicBadges = (p.topics || []).map((t) => `<span class="badge" style="background:#1e293b;color:#818cf8;border:1px solid #334155">${escHtml(t)}</span>`).join("");
      return `
        <div class="item">
          <button class="item-remove" data-url="${escHtml(p.url)}" title="Remove">✕</button>
          <div class="item-name">${escHtml(p.name)}</div>
          <div class="item-meta">
            <span class="badge" style="background:${srcColor}22;color:${srcColor}">${p.source}</span>
            ${p.difficulty ? `<span class="badge" style="background:#334155;color:#94a3b8">${p.difficulty}</span>` : ""}
            ${topicBadges}
          </div>
        </div>`;
    })
    .join("");

  // Attach per-item remove handlers
  listEl.querySelectorAll(".item-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const url = btn.getAttribute("data-url");
      chrome.runtime.sendMessage({ type: "REMOVE_PENDING", url }, (res) => {
        if (res?.problems) {
          render(res.problems);
        }
      });
    });
  });
}

function escHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// Load pending problems
chrome.runtime.sendMessage({ type: "GET_PENDING" }, (problems) => {
  render(problems || []);
});

// Push to Tracker — dispatches a CustomEvent that the React app listens for via bridge.js injection
document.getElementById("pushBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "GET_PENDING" }, (problems) => {
    if (!problems?.length) return;

    // We need to communicate with the tracker page. Two strategies:
    // 1. If a tracker tab is open, send via chrome.tabs
    // 2. Otherwise open the tracker and pass data via storage

    // Try to find an open tracker tab
    chrome.tabs.query({}, (tabs) => {
      const trackerTab = tabs.find(
        (t) => t.url && (t.url.includes("localhost:5173") || t.url.includes("dsa-tracker"))
      );

      if (trackerTab) {
        // Focus the tracker tab first
        chrome.tabs.update(trackerTab.id, { active: true });

        // Execute bridge script in the tracker page
        chrome.scripting.executeScript(
          {
            target: { tabId: trackerTab.id },
            func: (probs) => {
              window.dispatchEvent(
                new CustomEvent("dsa-tracker-add", { detail: probs })
              );
            },
            args: [problems],
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error("executeScript failed:", chrome.runtime.lastError.message);
              statusEl.textContent = "❌ " + chrome.runtime.lastError.message;
              setTimeout(() => (statusEl.textContent = ""), 4000);
              return;
            }
            chrome.runtime.sendMessage({ type: "CLEAR_PENDING" }, () => {
              statusEl.textContent = "✅ Pushed to tracker!";
              render([]);
              setTimeout(() => (statusEl.textContent = ""), 2500);
            });
          }
        );
      } else {
        // No tracker tab found — save to storage and open it
        chrome.storage.local.set({ pushOnLoad: problems }, () => {
          chrome.tabs.create({ url: TRACKER_ORIGIN });
          chrome.runtime.sendMessage({ type: "CLEAR_PENDING" }, () => {
            statusEl.textContent = "✅ Opening tracker…";
            render([]);
          });
        });
      }
    });
  });
});

// Clear all
document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "CLEAR_PENDING" }, () => {
    render([]);
    statusEl.textContent = "Cleared.";
    setTimeout(() => (statusEl.textContent = ""), 1500);
  });
});
