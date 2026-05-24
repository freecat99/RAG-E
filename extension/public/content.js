console.log("Content script loaded");

function scrapeProblem() {

    const title =
    document.querySelector(
        'div.text-title-large'
    )?.innerText;

    const description =
    document.querySelector(
        '[data-track-load="description_content"]'
    )?.innerText;

    return {
        title,
        description
    };
}

// ---------- INITIAL REQUEST ----------
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

    if(message.action === "GET_PROBLEM") {

        sendResponse(
            scrapeProblem()
        );
    }
});

// ---------- URL CHANGE DETECTION ----------
let lastUrl = location.href;

const observer =
new MutationObserver(() => {

    const currentUrl =
    location.href;

    if(currentUrl !== lastUrl) {

        lastUrl = currentUrl;

        console.log(
            "URL changed:",
            currentUrl
        );

        // wait for LeetCode DOM to update
        setTimeout(() => {

            const data =
            scrapeProblem();

            console.log(
                "Sending updated problem",
                data
            );

            chrome.runtime.sendMessage({
                type: "PROBLEM_CHANGED",
                data
            });

        }, 1000);
    }
});

observer.observe(document.body, {
    subtree: true,
    childList: true
});