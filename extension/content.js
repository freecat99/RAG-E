console.log("Coworker Loaded");

let sidebarOpen = false;

const sidebar =
document.createElement("iframe");

sidebar.src =
chrome.runtime.getURL(
    "sidebar/sidebar.html"
);

sidebar.id = "dsa-help-sidebar";

document.body.appendChild(sidebar);

chrome.runtime.onMessage.addListener(
    (message) => {

        if (
            message.action ===
            "toggle_sidebar"
        ) {

            sidebarOpen =
            !sidebarOpen;

            sidebar.style.right =
            sidebarOpen
            ? "0"
            : "-420px";
        }
    }
);

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (
            message.action ===
            "get_problem"
        ) {

            const title =
            document.querySelector(
                '[data-cy="question-title"]'
            )?.innerText;

            sendResponse({
                title
            });
        }
    }
);