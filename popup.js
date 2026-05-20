document.getElementById("start").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    console.log("Газ");

    chrome.tabs.sendMessage(tab.id, {
        action: "START_RESPONSES"
    });
});