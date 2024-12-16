import { openDB, saveTest, getSavedList, deleteTest } from './database.js'
document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById("urlInput");
    const titleInput = document.getElementById("titleInput");
    const recordButton = document.getElementById("recordButton");
    const playButton = document.getElementById("playButton");
    const saveButton = document.getElementById("saveButton");
    const interactionList = document.getElementById("interactionList");

    let tabIdToRecord = null;
    let recordedActions = []; // Array to store recorded actions

    //load list of saved test cases
    getSavedList()
    // Function to log interactions to the UI and store them
    function logInteraction(message) {
        const li = document.createElement("li");
        li.textContent = `Action: ${message.action}, Target: ${message.selector.target}, Target Type: ${message.selector.type} Value: ${message.value || "N/A"}`;
        interactionList.appendChild(li);

        // Store the recorded action
        recordedActions.push(message);
        playButton.disabled = false; // Enable the play button once actions are recorded
        saveButton.disabled = false;
    }

    // Format URL
    function formatUrl(inputUrl) {
        try {
            const url = new URL(inputUrl.includes("://") ? inputUrl : `http://${inputUrl}`);
            return url.href;
        } catch {
            return null;
        }
    }

    // Open URL in a new tab and start recording
    recordButton.addEventListener("click", () => {
        const inputUrl = urlInput.value;
        const formattedUrl = formatUrl(inputUrl);

        if (formattedUrl) {
            chrome.tabs.create({ url: formattedUrl }, (tab) => {
                tabIdToRecord = tab.id; // Save the tab ID for recording
                recordedActions = []; // Clear previous recordings
                interactionList.innerHTML = ""; // Clear the interaction list
                playButton.disabled = true; // Disable play until new actions are recorded
                saveButton.disabled = true; // Disable save button until new interaction recorded
            });
        } else {
            alert("Please enter a valid URL.");
        }
    });

    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((message, sender) => {
        if (sender.tab.id === tabIdToRecord && message.type === "interaction") {
            logInteraction(message);
        }
    });

    // Replay recorded actions
    playButton.addEventListener("click", () => {
        if (!recordedActions.length) return;

        const url = formatUrl(urlInput.value);
        if (url) {
            replay(url, recordedActions)
        }
    });
    saveButton.addEventListener("click", () => {

        const url = formatUrl(urlInput.value);
        const title = titleInput.value;

        if(url && title && recordedActions.length) {
            console.log("save is clicked")
            saveTest( url,title, recordedActions)
        } else {
            alert("Please enter Url, Title and record first")
        }
    })

    function replay(message, commands) {
        chrome.tabs.create({ url }, (tab) => {
            const replayTabId = tab.id;
            console.log("Replay tabId", replayTabId, tab);

            // Replay actions after the new tab loads
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === replayTabId && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);

                    // Inject and send actions for replay
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: replayTabId },
                            files: ["replay.js"],
                        },
                        () => {
                            chrome.tabs.sendMessage(replayTabId, {
                                type: "replay",
                                actions: commands,
                            });
                        }
                    );
                }
            });
        });
    }
});
