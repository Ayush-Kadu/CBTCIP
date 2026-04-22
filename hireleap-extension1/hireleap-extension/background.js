chrome.runtime.onInstalled.addListener(() => {
    console.log("HireLeap Extension Installed");
});

// LISTEN for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "ANALYZE_JOB") {

        (async () => {
            try {
                // 1. Check login
                const authRes = await fetch("https://www.hireleap.app/api/check-auth", {
                    credentials: "include"
                });

                const authData = await authRes.json();

                if (!authData.loggedIn) {
                    sendResponse({
                        redirect: "https://www.hireleap.app/signup"
                    });
                    return;
                }

                // 2. Analyze JD
                const res = await fetch("https://www.hireleap.app/api/analyze", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ jd: message.jd })
                });

                const result = await res.json();

                sendResponse({ result });

            } catch (err) {
                console.error(err);
                sendResponse({ error: "Something went wrong" });
            }
        })();

        return true; // IMPORTANT (keeps async alive)
    }
});