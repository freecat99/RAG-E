chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
 
// enable the icon only on LeetCode
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
 
  const isLeetCode = tab.url?.includes("leetcode.com");
 
  if (isLeetCode) {
    chrome.action.enable(tabId);
    chrome.action.setTitle({ tabId, title: "Open Coworker" });
  } else {
    chrome.action.disable(tabId);
    chrome.action.setTitle({ tabId, title: "Coworker — visit LeetCode to use" });
  }
});
 
// relay messages between content script and sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PROBLEM_DATA") {
    // store the latest problem so sidebar can fetch it on load
    chrome.storage.local.set({ currentProblem: message.payload }, () => {
      sendResponse({ ok: true });
    });
    return true; // keep channel open for async sendResponse
  }
});
 