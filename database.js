let db;
const dbName = 'BholeniumDB'
const savedTestTable  = 'saved_tests_table'
const listElement =  document.getElementById('savedTestList');

// Open IndexedDB
export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(savedTestTable)) {
                db.createObjectStore(savedTestTable, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db); // Resolve the promise when the database is successfully opened
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
            reject(event.target.errorCode); // Reject the promise if there’s an error
        };
    });
};

export const getSavedList = () => {
    openDB()
        .then(() => {
            const transaction = db.transaction([savedTestTable], 'readonly');
            const objectStore = transaction.objectStore(savedTestTable);

            //clear the list
            listElement.innerHTML = "";
            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'note';

                    const noteTitle = document.createElement('h3');
                    noteTitle.textContent = data.title;
                    noteDiv.appendChild(noteTitle);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => {
                        deleteTest(data.id);
                    });
                    listElement.appendChild(deleteButton);

                    listElement.appendChild(noteDiv);
                    cursor.continue();
                }
            };
        })
        .catch((error) => {
            console.error("Failed to open the database:", error);
        });
};
export const saveTest = (url, title, command) => {
       openDB().then( () => {
           console.log(db, url, title, command);
           const transaction = db.transaction([savedTestTable], 'readwrite');
           const objectStore = transaction.objectStore(savedTestTable);
           const newTest = { url, title, command };

           const request = objectStore.add(newTest);
           request.onsuccess = () => {
               // @TODO clear form if necessary
               getSavedList();
           };
           request.onerror = () => {
               console.error('Error saving test');
           };
       }).catch((e) => {
           console.log("error while opening database")
       })
};

// Delete a test from IndexedDB
export const deleteTest = (id) => {
    const transaction = db.transaction([savedTestTable], 'readwrite');
    const objectStore = transaction.objectStore(savedTestTable);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
        getSavedList();
    };

    request.onerror = () => {
        console.error('Error deleting test item');
    };
};
