// Coworker — content script
// Runs on every LeetCode page, scrapes problem info and sends it to the extension

(function () {
  let lastSentSlug = null;

  function scrapeProblem() {
    // title
    const titleEl =
      document.querySelector('[data-cy="question-title"]') ||
      document.querySelector(".text-title-large a") ||
      document.querySelector("h4.mr-2");
    const title = titleEl?.textContent?.trim() ?? null;

    // slug from URL  e.g. /problems/two-sum/
    const slugMatch = window.location.pathname.match(/\/problems\/([\w-]+)/);
    const slug = slugMatch ? slugMatch[1] : null;

    // difficulty badge
    const diffEl = document.querySelector('[diff]') ||
      document.querySelector(".text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard");
    const difficulty = diffEl?.textContent?.trim() ?? null;

    // problem description (markdown rendered as HTML)
    const descEl =
      document.querySelector(".question-content__JfgR") ||
      document.querySelector("[data-track-load='description_content']") ||
      document.querySelector(".elfjS");
    const description = descEl?.innerText?.trim() ?? null;

    // code editor content (Monaco)
    const codeLines = document.querySelectorAll(".view-line");
    const code = codeLines.length
      ? Array.from(codeLines).map((l) => l.textContent).join("\n").trim()
      : null;

    // selected language
    const langEl =
      document.querySelector(".ant-select-selection-item") ||
      document.querySelector("[data-cy='lang-select'] .ant-select-selection-item");
    const language = langEl?.textContent?.trim() ?? null;

    return { title, slug, difficulty, description, code, language, url: window.location.href };
  }

  function maybeEmit() {
    const data = scrapeProblem();
    if (!data.slug || data.slug === lastSentSlug) return;
    lastSentSlug = data.slug;

    chrome.runtime.sendMessage({ type: "PROBLEM_DATA", payload: data }, () => {
      // Suppress "no listener" errors during cold start
      void chrome.runtime.lastError;
    });
  }

  // fire on initial load
  maybeEmit();

  // re-fire when LeetCode does client-side navigation (it's a SPA)
  const observer = new MutationObserver(() => maybeEmit());
  observer.observe(document.body, { childList: true, subtree: true });

  // also listen if the sidebar explicitly asks for fresh data
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "GET_PROBLEM") {
      sendResponse(scrapeProblem());
    }
  });
})();