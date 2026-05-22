chrome.runtime.onInstalled.addListener(() => {
    console.log("Coworker Extension Installed");
});

chrome.sidePanel
  .setPanelBehavior({
    openPanelOnActionClick: true
  })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(
  async (tabId, info, tab) => {

    if (!tab.url) return;

    const url = new URL(tab.url);

    if (
      url.origin ===
      "https://leetcode.com"
    ) {

      await chrome.sidePanel.setOptions({
        tabId,
        path: "index.html",
        enabled: true
      });

    } else {

      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false
      });
    }
});