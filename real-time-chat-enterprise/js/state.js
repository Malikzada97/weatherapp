// Centralized State Manager using simple observer pattern

class AppState {
    constructor() {
      this.state = {
        messages: [],
        theme: 'light', // Default theme
        queue: [] // Offline message queue
      };
      this.listeners = [];
    }
  
    // Subscribe for state changes
    subscribe(callback) {
      this.listeners.push(callback);
    }
  
    // Notify all listeners on state change
    notify() {
      this.listeners.forEach(callback => callback(this.state));
    }
  
    // Load state from storage (IndexedDB handled in storage.js)
    async initialize() {
      this.state.messages = await Storage.loadMessages();
      this.state.theme = await Storage.loadTheme() || 'light';
      this.notify();
    }
  
    // Add message to state
    async addMessage(message) {
      this.state.messages.push(message);
      await Storage.saveMessages(this.state.messages);
      this.notify();
    }
  
    // Change theme
    async setTheme(newTheme) {
      this.state.theme = newTheme;
      await Storage.saveTheme(newTheme);
      this.notify();
    }
  
    // Manage offline queue
    addToQueue(message) {
      this.state.queue.push(message);
      Storage.saveQueue(this.state.queue);
    }
  
    async loadQueue() {
      this.state.queue = await Storage.loadQueue();
    }
  
    async removeFromQueue() {
      this.state.queue.shift();
      Storage.saveQueue(this.state.queue);
    }
  }
  
  const appState = new AppState();
  