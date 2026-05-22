import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import styles from "./index.css?inline";

console.log("Coworker Loaded");

let sidebarOpen = false;

// ---------- ROOT ----------
const root = document.createElement("div");

root.id = "coworker-root";

document.body.appendChild(root);

// ---------- SHADOW ROOT ----------
const shadowRoot = root.attachShadow({
  mode: "open",
});

// ---------- STYLE ----------
const styleTag = document.createElement("style");

styleTag.textContent = styles;

shadowRoot.appendChild(styleTag);

// ---------- REACT ROOT ----------
const reactRoot = document.createElement("div");

reactRoot.id = "react-root";

shadowRoot.appendChild(reactRoot);

// ---------- RENDER APP ----------
ReactDOM.createRoot(reactRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ---------- SCRAPER ----------
function scrapeProblem() {
  const title =
    document.querySelector(
      "div.text-title-large"
    )?.innerText;

  const desc =
    document.querySelector(
      '[data-track-load="description_content"]'
    )?.innerText;

  return {
    title,
    desc,
  };
}

// ---------- TOGGLE ----------
chrome.runtime.onMessage.addListener(
  (message) => {

    if (
      message.action ===
      "toggle_sidebar"
    ) {

      sidebarOpen =
      !sidebarOpen;

      reactRoot.style.right =
      sidebarOpen
        ? "0"
        : "-420px";
    }
  }
);

// ---------- GET PROBLEM ----------
chrome.runtime.onMessage.addListener(
  (
    message,
    sender,
    sendResponse
  ) => {

    if (
      message.action ===
      "get_problem"
    ) {

      sendResponse(
        scrapeProblem()
      );
    }
  }
);