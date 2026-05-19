chrome.runtime.onInstalled.addListener(() => {
    console.log("Coworker Extension Installed");
});

const leetcode_origin = 'https://leetcode.com/*';
const localhost = 'https://localhost:5500/*';


chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));


chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on leetcode.com
  if (url.origin === leetcode_origin || url.origin === localhost) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: './sidebar/sidebar.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
}); 