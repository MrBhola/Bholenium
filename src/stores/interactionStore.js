import { defineStore } from "pinia"
import { computed, ref } from "vue"
import  { postFixFileName } from "./../helper.js"

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

export const useInteractionStore = defineStore("interaction-store", () => {
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

    // export actions
    const exportAllData = async () => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(tableName, "readonly");
            const store = transaction.objectStore(tableName);

            const allData = store.getAll();

            allData.onsuccess = (event) => {
                const data = event.target.result;

                const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON
                const blob = new Blob([jsonData], { type: "application/json" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `Bholenium_export_${postFixFileName()}.json`;
                a.click();
            };

            allData.onerror = (event) => {
                console.error("Failed to export data:", event.target.error);
            };
        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    // bulk export
    const exportSelectedInteractions = async (ids, title = "") => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(tableName, "readonly");
            const store = transaction.objectStore(tableName);

            const results = [];

            // Create a promise that resolves once all the data is fetched
            const fetchPromises = ids.map(id => {
                return new Promise((resolve, reject) => {
                    const request = store.get(id);

                    request.onsuccess = (event) => {
                        const data = event.target.result;
                        if (data) {
                            results.push(data);
                        }
                        resolve();
                    };

                    request.onerror = (event) => {
                        reject(`Failed to fetch data for ID ${id}: ${event.target.error}`);
                    };
                });
            });

            // Wait for all promises to resolve
            await Promise.all(fetchPromises);

            // Convert the results to JSON and create a downloadable file
            const jsonData = JSON.stringify(results, null, 2);
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = `${title}_bholenium_${postFixFileName()}.json`;
            a.click();

        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    // import data action
    const importData = async (file) => {
        try {
            const fileContent = await file.text(); // Read file content
            const jsonData = JSON.parse(fileContent); // Parse JSON

            const db = await openDatabase();
            const transaction = db.transaction(tableName, "readwrite");
            const store = transaction.objectStore(tableName);

            jsonData.forEach((item) => {
                const { id, ...dataWithoutId } = item; // Remove `id` field
                store.add(dataWithoutId); // Add to store
            });

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    getInteractionList();
                    resolve("success");
                };

                transaction.onerror = (event) => {
                    console.error("Failed to import data:", event.target.error);
                    reject(new Error("Failed to import data"));
                };
            });
        } catch (error) {
            console.error("Error importing data:", error);
            throw error;
        }
    };


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
        exportAllData,
        exportSelectedInteractions,
        importData,
        selectedInteractionId,
    };
});
