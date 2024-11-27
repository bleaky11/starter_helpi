export const initializeDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open("userDatabase", 3);

    request.onerror = (event) => reject(event);

    request.onsuccess = (event) => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;

      if (!db.objectStoreNames.contains("users")) {
        const objectStore = db.createObjectStore("users", { keyPath: "username" });
        objectStore.createIndex("username", "username", { unique: true });
        objectStore.createIndex("loggedIn", "loggedIn", { unique: false });
      } 
    };
  });
};

  