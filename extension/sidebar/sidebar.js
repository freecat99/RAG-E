document
.getElementById("analyze")
.addEventListener(
    "click",
    async () => {

        const [tab] =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        chrome.tabs.sendMessage(
            tab.id,
            {
                action: "get_problem"
            },
            async (response) => {

                console.log(response);

                document
                .getElementById("result")
                .innerHTML = `
                    <h2>
                        ${response.title}
                    </h2>
                `;
            }
        );
    }
);