import { defineStore } from "pinia"
import { computed, ref } from "vue"

const DBName = "memoDatabase";
const tableName = "memoTable";

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

export const useMemoStore = defineStore("memoStore", () => {
    const memos = ref({});

    // Actions
    const loadMemos = async () => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readonly");
        const store = transaction.objectStore(tableName);
        const allMemosRequest = store.getAll();

        allMemosRequest.onsuccess = (event) => {
            const result = event.target.result;

            // Convert the array into an object keyed by `id`
            memos.value = result.reduce((acc, memo) => {
                acc[memo.id] = memo;
                return acc;
            }, {});
        };

        allMemosRequest.onerror = (event) => {
            console.error("Failed to load memos from IndexedDB", event.target.error);
        };
    };

    const addMemo = async (memo) => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readwrite");
        const store = transaction.objectStore(tableName);
        const addRequest = store.put(memo);

        addRequest.onsuccess = () => {
            loadMemos(); // Reload memos to update UI
        };

        addRequest.onerror = (event) => {
            console.error("Failed to add memo:", event.target.error);
        };
    };

    const deleteMemo = async (id) => {
        const db = await openDatabase();
        const transaction = db.transaction(tableName, "readwrite");
        const store = transaction.objectStore(tableName);
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
            loadMemos()
        };

        deleteRequest.onerror = (event) => {
            console.error("Failed to delete memo:", event.target.error);
        };
    };

    // Getter for memo count
    const memoCount = computed(() => Object.keys(memos.value).length);

    return {
        memos,
        loadMemos,
        addMemo,
        deleteMemo,
        memoCount,
    };
});
