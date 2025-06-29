// Storage Module — IndexedDB-based persistent storage

class Storage {
    static dbName = 'ChatAppDB';
    static dbVersion = 1;
    static db;
  
    // Initialize IndexedDB
    static async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(Storage.dbName, Storage.dbVersion);
  
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('messages')) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains('queue')) {
            db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
          }
        };
  
        request.onsuccess = (e) => {
          Storage.db = e.target.result;
          resolve();
        };
  
        request.onerror = (e) => {
          console.error("IndexedDB error:", e);
          reject(e);
        };
      });
    }
  
    // Save message
    static async saveMessages(messages) {
      return new Promise((resolve, reject) => {
        const tx = Storage.db.transaction('messages', 'readwrite');
        const store = tx.objectStore('messages');
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          let addCount = 0;
          if (messages.length === 0) resolve();
          messages.forEach(msg => {
            const addReq = store.add(msg);
            addReq.onsuccess = () => {
              addCount++;
              if (addCount === messages.length) {
                tx.oncomplete = () => resolve();
              }
            };
            addReq.onerror = reject;
          });
        };
        clearReq.onerror = reject;
      });
    }
  
    // Load all messages
    static async loadMessages() {
      return new Promise((resolve) => {
        const tx = Storage.db.transaction('messages', 'readonly');
        const store = tx.objectStore('messages');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
      });
    }
  
    // Save theme
    static async saveTheme(theme) {
      return new Promise((resolve, reject) => {
        const tx = Storage.db.transaction('settings', 'readwrite');
        const store = tx.objectStore('settings');
        const putReq = store.put({ key: 'theme', value: theme });
        putReq.onsuccess = () => {
          tx.oncomplete = () => resolve();
        };
        putReq.onerror = reject;
      });
    }
  
    static async loadTheme() {
      return new Promise((resolve) => {
        const tx = Storage.db.transaction('settings', 'readonly');
        const store = tx.objectStore('settings');
        const request = store.get('theme');
        request.onsuccess = () => resolve(request.result ? request.result.value : null);
        request.onerror = () => resolve(null);
      });
    }
  
    // Offline Queue Management
    static async saveQueue(queue) {
      return new Promise((resolve, reject) => {
        const tx = Storage.db.transaction('queue', 'readwrite');
        const store = tx.objectStore('queue');
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          let addCount = 0;
          if (queue.length === 0) resolve();
          queue.forEach(msg => {
            const addReq = store.add(msg);
            addReq.onsuccess = () => {
              addCount++;
              if (addCount === queue.length) {
                tx.oncomplete = () => resolve();
              }
            };
            addReq.onerror = reject;
          });
        };
        clearReq.onerror = reject;
      });
    }
  
    static async loadQueue() {
      return new Promise((resolve) => {
        const tx = Storage.db.transaction('queue', 'readonly');
        const store = tx.objectStore('queue');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
      });
    }
  }
  
  // Initialize storage when app starts
  // Storage.init().then(() => console.log("IndexedDB initialized"));
  