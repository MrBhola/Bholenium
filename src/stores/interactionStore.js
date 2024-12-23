import { defineStore } from "pinia"
import { computed, ref } from "vue"

const DBName = "BholeniumDB";
const tableName = "bholenium_table";

// Open IndexedDB
const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DBName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

export const useInteractionStore = defineStore("interactionStore", () => {
    const interactions = ref({});
    const selectedInteractionId = ref(null)
    const url = ref("")
    const title = ref("")
    const commands = ref([])

    // Actions
    const getInteractionList = async () => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readonly");
        const store = transaction.objectStore(tableName);
        const allInteractions = store.getAll();

        allInteractions.onsuccess = (event) => {
            const result = event.target.result;

            // Convert the array into an object keyed by `id`
            interactions.value = result.reduce((acc, interaction) => {
                acc[interaction.id] = interaction;
                return acc;
            }, {});
        };

        allInteractions.onerror = (event) => {
            console.error("Failed to load allInteractions from IndexedDB", event.target.error);
        };
    };

    const addInteraction = async () => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readwrite");
        const store = transaction.objectStore(tableName);

        // Deeply serialize the commands
        const plainCommands = JSON.parse(JSON.stringify(recordedActions.value));

        const newInteraction = {
            url: url.value,
            title: title.value,
            commands: plainCommands
        };

        console.log("Storable Interaction:", newInteraction);

        const addRequest = store.add(newInteraction);

        addRequest.onsuccess = () => {
            console.log("Interaction added successfully.");
            getInteractionList();
        };

        addRequest.onerror = (event) => {
            console.error("Failed to add interaction:", event.target.error);
        };
    };


    // convert any proxy object to plain object
    const toPlainObject = (obj) => {
        if (obj === null || typeof obj !== 'object') {
            // Return primitive values as-is
            return obj;
        }

        if (obj instanceof Array) {
            // If the object is an array, recursively convert each element
            return obj.map(toPlainObject);
        }

        if (obj instanceof Proxy || Object.prototype.toString.call(obj) === '[object Object]') {
            // Convert Proxy or plain object into a serializable object
            const plainObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    plainObj[key] = toPlainObject(obj[key]); // Recursively convert nested values
                }
            }
            return plainObj;
        }

        return obj; // For other object types, return as-is
    }

    const deleteInteraction = async (id) => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readwrite");
        const store = transaction.objectStore(tableName);
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
            getInteractionList()
        };

        deleteRequest.onerror = (event) => {
            console.error("Failed to delete interaction:", event.target.error);
        };
    };

    const loadInteraction = async (id) => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readwrite");
        const store = transaction.objectStore(tableName);
        const getDetail = store.get(id);
        getDetail.onsuccess = (event) => {
            const detail = event.target.result;
            console.log(detail)
            selectedInteractionId.value = detail.id;
            recordedActions.value = detail.commands;
            url.value = detail.url;
            title.value = detail.title;
        }

        getDetail.onerror = (event) => {
            console.error("Failed to delete interaction:", event.target.error);
        };
    }

    const tabIdToRecord = ref(null)
    const recordedActions = ref([])
    const handleOpenAndRecord = () => {
            const formattedUrl = formatUrl(url.value);

            if (formattedUrl) {
                chrome.tabs.create({ url: formattedUrl }, (tab) => {
                    tabIdToRecord.value = tab.id; // Save the tab ID for recording
                    recordedActions.value = []; // Clear previous recordings
                });
            } else {
                alert("Please enter a valid URL.");
            }
    }

    function formatUrl(inputUrl) {
        try {
            const url = new URL(inputUrl.includes("://") ? inputUrl : `http://${inputUrl}`);
            return url.href;
        } catch {
            return null;
        }
    }

    //  listens for any interaction message and updates the recordedActions value
    chrome.runtime.onMessage.addListener((message, sender) => {
        if (sender.tab.id === tabIdToRecord.value && message.type === "interaction") {
            recordedActions.value.push(message);
        }
    })

    const handlePlay = () => {
            if (!recordedActions.value.length) return;

            const formatedUrl  = formatUrl(url.value);
            if (formatedUrl) {
                replay(formatedUrl, recordedActions.value)
            }
    }
    function replay(url, commands) {
        chrome.tabs.create({ url }, (tab) => {
            const replayTabId = tab.id;

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


    return {
        interactions,
        recordedActions,
        getInteractionList,
        url,
        title,
        commands,
        handleOpenAndRecord,
        handlePlay,
        deleteInteraction,
        loadInteraction,
        addInteraction,
    };
});
