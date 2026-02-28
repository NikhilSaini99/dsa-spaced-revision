/* background.js — Manifest V3 service worker
   Listens for messages from content scripts and stores problems
   until the tracker page picks them up. */

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "SAVE_PROBLEM") {
    const problem = {
      ...msg.payload,
      savedAt: new Date().toISOString(),
    };

    chrome.storage.local.get({ pendingProblems: [] }, (data) => {
      // De-duplicate by URL
      const existing = data.pendingProblems;
      if (existing.some((p) => p.url === problem.url)) {
        sendResponse({ status: "duplicate" });
        return;
      }
      existing.push(problem);
      chrome.storage.local.set({ pendingProblems: existing }, () => {
        // Update badge
        chrome.action.setBadgeText({ text: String(existing.length) });
        chrome.action.setBadgeBackgroundColor({ color: "#6366f1" });
        sendResponse({ status: "saved" });
      });
    });
    return true; // keep channel open for async sendResponse
  }

  if (msg.type === "GET_PENDING") {
    chrome.storage.local.get({ pendingProblems: [] }, (data) => {
      sendResponse(data.pendingProblems);
    });
    return true;
  }

  if (msg.type === "CLEAR_PENDING") {
    chrome.storage.local.set({ pendingProblems: [] }, () => {
      chrome.action.setBadgeText({ text: "" });
      sendResponse({ status: "cleared" });
    });
    return true;
  }
});
