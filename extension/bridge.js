/* bridge.js — Content script that runs on problem pages.
   Detects the current platform, scrapes problem metadata,
   and injects a "Save to Tracker" button on the page. */

(() => {
  // Avoid double-injection
  if (document.getElementById("dsa-tracker-save-btn")) return;

  const { source, name, url, difficulty, topics } = window.__dsaTrackerProblem || {};
  if (!source) return; // detect.js didn't find a match

  /* ── Inject floating "Save to Tracker" button ── */
  const btn = document.createElement("button");
  btn.id = "dsa-tracker-save-btn";
  btn.textContent = "💾 Save to Tracker";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "999999",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 24px rgba(99,102,241,.4)",
    transition: "transform .15s, box-shadow .15s",
    fontFamily: "system-ui, sans-serif",
  });

  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.05)";
    btn.style.boxShadow = "0 6px 32px rgba(99,102,241,.55)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 4px 24px rgba(99,102,241,.4)";
  });

  btn.addEventListener("click", () => {
    btn.disabled = true;
    btn.textContent = "⏳ Saving…";

    chrome.runtime.sendMessage(
      {
        type: "SAVE_PROBLEM",
        payload: { name, url, source, difficulty, topics: topics || [] },
      },
      (res) => {
        if (res?.status === "duplicate") {
          btn.textContent = "⚠️ Already saved";
          btn.style.background = "#f59e0b";
        } else {
          btn.textContent = "✅ Saved!";
          btn.style.background = "#10b981";
        }
        setTimeout(() => {
          btn.textContent = "💾 Save to Tracker";
          btn.style.background =
            "linear-gradient(135deg, #6366f1, #8b5cf6)";
          btn.disabled = false;
        }, 2000);
      }
    );
  });

  document.body.appendChild(btn);
})();
