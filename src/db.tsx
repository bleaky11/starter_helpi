export const initializeDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open("userDatabase", 2);

    request.onerror = (event) => reject(event);

    request.onsuccess = (event) => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const objectStore = db.createObjectStore("users", { keyPath: "username" }); // Ensure keyPath is correct
      objectStore.createIndex("username", "username", { unique: true }); // Index for username
      objectStore.createIndex("loggedIn", "loggedIn", { unique: false }); // Index for loggedIn
    };
  });
};

  